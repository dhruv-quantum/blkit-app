# Brainy Ladder — Kit Companion

A web app for browsing your Brainy Ladder kit's instruction sheets and
activity videos, installable on a phone's home screen like a regular app —
no App Store required.

The real product lineup is built in: **Playgroup, Nursery, KG–I, KG–II,
Phonics**, plus a **Flashcards** add-on. Right now only Nursery's
**Animals** booklet has real content loaded (11 activities from the actual
kit PDF, organized into 4 developmental quarters) — the rest show as
locked, ready to be filled in.

Accounts now come in three flavors:

- **Admin** — sees everything, creates parent *and* staff profiles.
- **Staff** — creates and manages parent profiles (not other staff), grants
  or revokes which kits a parent can see.
- **Parent** — signs in and sees only the kit(s) they've been granted.

There's no public sign-up page anywhere in the app — every account is
created by an admin or staff member from the dashboard.

---

## 1. Before you start

You need **Node.js** installed on your computer (this runs the project, it
has nothing to do with the app's content). Any version 20 or newer works.

1. Go to **[nodejs.org](https://nodejs.org)** and download the **LTS**
   version for your operating system.
2. Run the installer, accepting the defaults.
3. Confirm it worked — open a terminal (**Terminal** on Mac, **Command
   Prompt** or **PowerShell** on Windows) and type:
   ```
   node -v
   npm -v
   ```
   Both should print a version number. If you get "command not found,"
   restart your terminal (or your computer) and try again.

You'll also want a code editor to look at files later —
[VS Code](https://code.visualstudio.com) is free and works well, but isn't
required just to run the app.

---

## 2. First-time setup

1. Unzip this project folder somewhere easy to find, e.g. your Desktop.
2. Open a terminal and navigate into it:
   ```
   cd path/to/brainy-ladder-app
   ```
   (Type `cd `, then drag the folder into the terminal window, then press
   Enter — most terminals fill in the path for you.)
3. Install the project's dependencies (only needed once, or after content
   updates change what's installed):
   ```
   npm install
   ```
   This downloads everything the app needs into a `node_modules` folder.
   It can take a minute; you'll see a progress bar.

---

## 3. Setting up Supabase (accounts & kit access)

The app needs a [Supabase](https://supabase.com) project to handle logins
and to remember which parent can see which kit. Supabase's free tier is
enough for this. You'll do this setup once.

### 3.1 Create the project

1. Sign up / sign in at [supabase.com](https://supabase.com).
2. Click **New project**. Pick any name and a database password (save that
   password somewhere — you likely won't need it day-to-day, but keep it).
3. Wait a minute or two for it to finish provisioning.

### 3.2 Run the schema

1. In your new project, open **SQL Editor** (left sidebar) → **New query**.
2. Open `supabase/schema.sql` from this project in a text editor, copy the
   whole file, and paste it into the SQL Editor.
3. Click **Run**. You should see "Success. No rows returned." This creates
   the `profiles`, `kits`, and `kit_access` tables, seeds the 6 kit/add-on
   rows, and sets up Row Level Security so parents can only ever see their
   own data no matter what.

### 3.3 Get your API keys

Go to **Settings → API**. You'll need two values from here shortly:
- **Project URL** (e.g. `https://abcdefgh.supabase.co`)
- **anon public** key (a long string — safe to use in the browser app)
- **service_role** key, further down the same page, marked secret — this
  one grants full database access and must never end up in the browser.
  Treat it like a password.

### 3.4 Bootstrap your first admin

Nobody can create anyone yet, because there's no admin to do the creating.
This one-time step uses the Supabase dashboard directly instead of the app:

1. **Authentication → Users → Add user** (top right). Enter your own email
   and set a password. Leave "Auto Confirm User" checked.
2. **Table Editor → profiles**. You should see one new row (the trigger in
   `schema.sql` created it automatically) with `role` set to `parent`.
3. Click that row, change `role` to `admin`, save.

That's it — that email + password is now your admin login for the app.

### 3.5 Configure environment variables

1. In this project folder, copy `.env.local.example` to a new file named
   `.env.local`.
2. Fill in the three values:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
   `.env.local` is already gitignored — it will never get committed or
   pushed to GitHub.

Restart `npm run dev` if it was already running, then go to `/login` and
sign in with the admin account you just bootstrapped.

**A note on that service role key:** it's only ever read by
`api/admin/create-user.js`, which runs on the server (never in a browser).
Never rename that variable to start with `VITE_` — that prefix is what
tells the build tool to bundle a value into client-side code, and doing
that with this key would hand out full database access to anyone who
opened their browser's developer console.

---

## 4. Running it locally

```
npm run dev
```

This starts a local server and prints a URL, typically
`http://localhost:5173`. Open that in your browser — you'll land on the
login page. Changes you make to the code appear instantly without
restarting anything.

Press `Ctrl + C` in the terminal to stop the server.

### Viewing it on your phone

1. Make sure your phone and computer are on the **same Wi-Fi network**.
2. Run:
   ```
   npm run dev -- --host
   ```
3. It will print a second URL like `http://192.168.1.23:5173` — type that
   into your phone's browser.
4. To install it like an app:
   - **Android (Chrome):** tap the ⋮ menu → **Add to Home screen**.
   - **iPhone (Safari):** tap the Share icon → **Add to Home Screen**.

It'll then open full-screen from your home screen icon, just like the demo
you saw in the earlier prototype.

---

## 5. Version control with GitHub

This project is already set up as a git repository with commits. Putting
it on GitHub gives you a backup, a change history, and — usefully — lets
hosting services auto-deploy every time you push, instead of manually
dragging a folder in.

1. Go to **[github.com/new](https://github.com/new)**, give it a name (e.g.
   `brainy-ladder-app`), and create it **empty** — don't check "Add a
   README" or `.gitignore`, since this project already has both.
2. GitHub will show you a remote URL, e.g.
   `https://github.com/your-username/brainy-ladder-app.git`. Back in your
   terminal, inside the project folder:
   ```
   git remote add origin https://github.com/your-username/brainy-ladder-app.git
   git push -u origin main
   ```
3. Refresh the GitHub page — your code is now there.

From then on, whenever you make changes:
```
git add -A
git commit -m "describe what changed"
git push
```

Prefer a visual tool over the command line? **[GitHub
Desktop](https://desktop.github.com)** does all of the above through a
simple interface — open the project folder in it, and it walks you through
publishing the repository and committing changes with buttons instead of
commands.

**Note:** your actual secrets (the Supabase service role key, etc.) live
only in `.env.local`, which is gitignored and never gets committed — the
repository itself has nothing sensitive in it, even if you make it public.

### Auto-deploying from GitHub

Once your code is on GitHub, hosting is a one-time setup instead of a
manual step every time.

#### Vercel (recommended)

1. Go to **[vercel.com/new](https://vercel.com/new)** and sign in (GitHub
   login is easiest).
2. Click **Import** next to your `brainy-ladder-app` repository.
3. Vercel auto-detects it as a Vite project. Leave the build defaults:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Before deploying, open **Environment Variables** and add the same three
   from your `.env.local`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
   and `SUPABASE_SERVICE_ROLE_KEY`. This step is easy to miss and the app
   won't be able to log anyone in without it.
5. Click **Deploy**. In about a minute you'll get a live URL like
   `brainy-ladder-app.vercel.app`.

This project already includes a `vercel.json` that tells Vercel to send
unknown URLs (like `/kit/nursery/booklet/animals`) to the app itself
instead of a 404 page, since the app decides what those routes mean
internally. Real files — images, icons, the manifest — are still served
directly and untouched.

From now on, every `git push` to your `main` branch automatically
redeploys the live site. Pushing to any other branch gets its own preview
URL first, so you can check changes before they go live.

**Prefer the command line?** From inside the project folder:
```
npx vercel        # deploys a preview, asks a few setup questions the first time
npx vercel --prod  # deploys to your production URL
```
This works even before the project is on GitHub, though connecting GitHub
(above) is what gives you auto-deploy on every push. You'll still need to
add the same 3 environment variables in the Vercel dashboard either way.

**Custom domain:** once deployed, Vercel's project settings has a
"Domains" tab where you can point your own domain (e.g. `app.brainyladder
.com`) at it — just follow the DNS instructions it gives you.

#### Netlify

Same idea, different dashboard: [app.netlify.com](https://app.netlify.com)
→ "Add new site" → "Import an existing project" → pick your GitHub repo.
Build command: `npm run build`, publish directory: `dist`. Add the same 3
environment variables under Site settings → Environment variables.

---

## 6. Putting it online without GitHub

If you'd rather skip GitHub for now, you can still host it directly:

1. Run `npm run build` — this creates a `dist/` folder with the finished,
   optimized app.
2. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)** and drag
   the `dist` folder into the page. Netlify gives you a live URL in seconds.

The tradeoff: you'd repeat this drag-and-drop manually after every change,
since there's no repo for it to auto-deploy from — and you'd still need to
set the 3 environment variables in that site's settings for login to work.

---

## 7. Managing accounts (the admin dashboard)

Sign in as an admin or staff member and a **Dashboard** link appears in the
top bar (`/admin`).

**Creating a profile:** fill in email, name, and role. For a parent
profile, tick which kit(s) to grant. Submitting sends that person an email
invite (via Supabase's built-in auth email) — they click the link, set
their own password, and they're in. Nobody's password ever passes through
this app or through you.

**Adjusting a parent's kits:** the Parents table lists everyone, with a
row of kit chips — click one to grant it, click again to revoke it. This
is exactly how you'd handle "this family bought Phonics too" later,
without creating a new account.

**Staff vs. admin:** staff can do everything above for parents, but the
"Staff" role option only appears for admins — a staff member can't create
another staff account or see the staff/admin list, matching how the roles
were scoped.

**A known limitation worth knowing about:** kit *content* (the activity
steps, images, etc.) currently ships inside the app's regular code bundle,
not fetched from Supabase — so today's access control governs which kits
someone can *navigate to and be shown* in the UI, not a hard technical wall
against, say, someone reading the app's source files directly. This is a
reasonable tradeoff while only one kit (Nursery/Animals) has real content;
if that becomes a real concern once more paid content exists, the fix is
moving kit content into Supabase behind the same Row Level Security rather
than bundling it — worth a dedicated pass when you're ready for it.

---

## 8. Adding content

Everything about kits and booklets — activities, quarters, materials,
steps, and sheet images — lives in one file:

```
src/data/kit.js
```

The 5 kits live in the `KITS` array; the Flashcards add-on is in `ADDONS`.
Only `nursery` has `contentReady: true` and a real `booklets` array today.

### Adding an image for a sheet

Drop the image file into `public/images/sheets/`, then reference it as
`/images/sheets/your-file-name.jpg` in `kit.js` (see the existing entries
for the pattern).

### Adding a new activity to the Animals booklet

Copy one of the objects inside the Animals booklet's `activities` array
(look for `ANIMALS_BOOKLET` in `kit.js`) and adjust its fields:

```js
{
  id: "unique-id",              // must be unique across all activities
  title: "Activity Name",
  theme: "Wild Animals",        // just a label shown as a tag
  quarter: 2,                   // 1-4, which quarter it belongs to
  sheetImage: "/images/sheets/your-file.jpg",
  sheetLabel: "Sheet 4 · Activity 12",
  focus: "What skill this builds",
  materials: ["Item one", "Item two"],
  steps: ["Step one.", "Step two."],
  videoUrl: null,                // or an embeddable URL once you have one
}
```

### Loading real content into another kit

Find that kit's entry in the `KITS` array (e.g. `playgroup`, `kg1`,
`phonics`), set `contentReady: true`, and give it a `booklets` array
following the same shape as `ANIMALS_BOOKLET`. It'll automatically appear
as a real, open-able kit once at least one parent has been granted access
to it.

### Adding a real activity video

Once you have a video hosted somewhere embeddable (YouTube, Vimeo, etc.),
just set that activity's `videoUrl` to the embed link, e.g.
`"https://www.youtube.com/embed/VIDEO_ID"`. The video button will switch
from the "coming soon" state to actually playing it.

---

## 9. How progress is stored

Marking an activity complete saves to the browser's local storage on that
device — nothing leaves the phone or gets sent anywhere. That means:

- Progress is per-device. Dad's phone and Mum's phone won't show the same
  checkmarks unless it's the same browser.
- Clearing browser data / reinstalling wipes progress.
- Progress isn't tied to the Supabase account yet — accounts control
  *which kits you can see*, not where your checkmarks are stored.

If you'd like progress to follow a parent's account across devices instead
of staying local to one phone, that's a natural next step now that real
accounts exist (a small `progress` table alongside `kit_access` would do
it) — worth a dedicated pass when you're ready.

---

## 10. Project structure

```
brainy-ladder-app/
├─ api/
│  └─ admin/create-user.js  → the one server-side function (uses the secret
│                              service role key to create new accounts)
├─ supabase/
│  └─ schema.sql            → run this once in Supabase's SQL Editor
├─ public/
│  ├─ icons/                → app icons (home screen, browser tab)
│  └─ images/sheets/        → the actual kit page images
├─ src/
│  ├─ data/kit.js           → ALL content: kits, booklets, quarters, activities
│  ├─ lib/supabaseClient.js → the Supabase client used in the browser
│  ├─ contexts/AuthContext.jsx → tracks who's signed in and their role
│  ├─ components/           → reusable UI pieces (cards, modals, icons...)
│  ├─ pages/                → Library, KitHome, BookletView, LoginPage, AdminDashboard
│  ├─ hooks/
│  │  ├─ useProgress.js     → local-storage-backed completion tracking
│  │  └─ useKitAccess.js    → resolves which kits the signed-in user can see
│  └─ utils/storage.js      → small localStorage helper
├─ src/__tests__/           → automated tests (app flow + fake Supabase)
├─ vite.config.js           → build tool + PWA (installable app) config
├─ .env.local.example       → template for your own .env.local
└─ package.json
```

---

## 11. Running the tests (optional)

There are two automated test files:

- `src/__tests__/app.test.jsx` — clicks through the entire app (login,
  role-based kit visibility, opening a booklet, marking activities done,
  both modals) against a fake in-memory Supabase client.
- `api/admin/create-user.test.js` — checks the account-creation function's
  authorization rules directly (rejects non-admins, staff can't create
  staff, etc.) without touching a real database.

You never need to run these, but if you (or a developer you bring on)
change the code later, it's a quick way to check nothing broke:

```
npm test
```

---

## What's next

Natural next steps, roughly in order of how much they'd unlock:

1. **Load a second booklet's real content** (Early Literacy, Early
   Numeracy, or Social & Emotional) so Nursery stops being single-booklet.
2. **Load a second kit's real content** (Playgroup, KG-I, KG-II, or
   Phonics).
3. **Add real activity videos** as they're produced.
4. **Move kit content behind Supabase + Row Level Security**, closing the
   content-security gap noted in section 7, once more paid kits have real
   content worth protecting.
5. **Progress synced to the account** instead of local-only, so a parent's
   checkmarks follow them across devices.
