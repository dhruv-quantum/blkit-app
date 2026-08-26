-- ============================================================================
-- Brainy Ladder Kit Companion — database schema
--
-- Run this once, in full, in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New query → paste this whole file → Run).
--
-- What this sets up:
--   - profiles      one row per person, with a role: admin / staff / parent
--   - kits          the 5 kits + 1 add-on (static reference list)
--   - kit_access    which parent has been granted which kit
--   - Row Level Security so that, when the app queries these tables using a
--     signed-in user's session, Postgres itself enforces who can see what —
--     a parent can only ever see their own profile and their own granted
--     kits, no matter what the client-side code does.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'parent' check (role in ('admin', 'staff', 'parent')),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per person. role decides what they can do in the app.';

-- ---------------------------------------------------------------------------
-- 2. kits — static reference list, seeded below. Keep the `id` values here
--    in sync with the `id`s used in src/data/kit.js (KITS and ADDONS).
-- ---------------------------------------------------------------------------
create table if not exists public.kits (
  id text primary key,
  name text not null,
  is_addon boolean not null default false
);

insert into public.kits (id, name, is_addon) values
  ('playgroup', 'The Brain Train', false),
  ('nursery', 'The Brainy Badgers', false),
  ('kg1', 'The Rapid Learners', false),
  ('kg2', 'The Clever Buds', false),
  ('phonics', 'Phonics Learning Kit', false),
  ('flashcards', 'Flashcards', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 3. kit_access — which parent can open which kit
-- ---------------------------------------------------------------------------
create table if not exists public.kit_access (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles (id) on delete cascade,
  kit_id text not null references public.kits (id),
  granted_by uuid references public.profiles (id),
  granted_at timestamptz not null default now(),
  unique (parent_id, kit_id)
);

-- ---------------------------------------------------------------------------
-- 4. Helper function: looks up the CURRENTLY SIGNED IN user's role.
--    security definer + a fixed search_path means this runs with the
--    function owner's privileges, bypassing RLS internally — this is what
--    lets a policy safely check "is the caller an admin?" without infinite
--    recursion (a normal query from inside a policy would itself trigger
--    the same policy again).
-- ---------------------------------------------------------------------------
create or replace function public.my_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- 5. Auto-create a profile row whenever a new auth user is created.
--    New users default to role='parent' — promoting to 'staff' happens
--    through the app's admin-only create-user flow, and promoting to
--    'admin' is a deliberate manual step in the Supabase dashboard (see
--    README.md, "Bootstrapping your first admin").
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(new.raw_user_meta_data ->> 'role', 'parent')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 6. Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.kits enable row level security;
alter table public.kit_access enable row level security;

-- profiles: everyone can see their own row
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid());

-- profiles: admin can see every row (other admins, staff, parents)
drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin"
  on public.profiles for select
  using (public.my_role() = 'admin');

-- profiles: staff can see parent rows only — not other staff, not admins
drop policy if exists "profiles_select_staff" on public.profiles;
create policy "profiles_select_staff"
  on public.profiles for select
  using (public.my_role() = 'staff' and role = 'parent');

-- profiles: admin/staff can update a parent's own editable fields (e.g. name)
-- The `with check` clause blocks any update from changing role away from
-- 'parent' through this policy — role changes only ever happen server-side.
drop policy if exists "profiles_update_parent" on public.profiles;
create policy "profiles_update_parent"
  on public.profiles for update
  using (public.my_role() in ('admin', 'staff') and role = 'parent')
  with check (role = 'parent');

-- kits: any signed-in user can read the kit list (needed to show names/labels)
drop policy if exists "kits_select_authenticated" on public.kits;
create policy "kits_select_authenticated"
  on public.kits for select
  using (auth.role() = 'authenticated');

-- kit_access: a parent can see their own grants
drop policy if exists "kit_access_select_own" on public.kit_access;
create policy "kit_access_select_own"
  on public.kit_access for select
  using (parent_id = auth.uid());

-- kit_access: admin/staff can see every grant
drop policy if exists "kit_access_select_staff" on public.kit_access;
create policy "kit_access_select_staff"
  on public.kit_access for select
  using (public.my_role() in ('admin', 'staff'));

-- kit_access: admin/staff can grant a kit to a parent
drop policy if exists "kit_access_insert_staff" on public.kit_access;
create policy "kit_access_insert_staff"
  on public.kit_access for insert
  with check (public.my_role() in ('admin', 'staff'));

-- kit_access: admin/staff can revoke a grant
drop policy if exists "kit_access_delete_staff" on public.kit_access;
create policy "kit_access_delete_staff"
  on public.kit_access for delete
  using (public.my_role() in ('admin', 'staff'));

-- ============================================================================
-- End of schema. Next: create your own account via Dashboard → Authentication
-- → Users → Add user, then follow README.md "Bootstrapping your first admin"
-- to make that account an admin.
-- ============================================================================
