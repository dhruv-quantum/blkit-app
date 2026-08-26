import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
      "in a .env.local file (see README.md, section 'Setting up Supabase')."
  );
}

// A harmless stand-in used only when Supabase hasn't been configured yet.
// createClient() throws synchronously if given an empty URL/key, which would
// otherwise crash the entire app at import time — before the person has had
// a chance to see any "you need to set this up" messaging. This stub lets
// the app render normally (nobody has a session, every query politely
// errors) so LoginPage's real "Supabase isn't configured" notice is what
// they actually see.
function createUnconfiguredStub() {
  const notConfiguredError = { message: "Supabase is not configured yet." };
  const chain = {
    select: () => chain,
    eq: () => chain,
    order: () => chain,
    single: async () => ({ data: null, error: notConfiguredError }),
    insert: async () => ({ data: null, error: notConfiguredError }),
    delete: () => chain,
    then: (resolve) => resolve({ data: [], error: notConfiguredError }),
  };
  return {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signInWithPassword: async () => ({ error: notConfiguredError }),
      signOut: async () => {},
    },
    from: () => chain,
  };
}

// The ANON/PUBLIC key is designed to be shipped in client-side code and is
// safe to expose — it only grants whatever Row Level Security policies in
// supabase/schema.sql allow. It is NOT the service role key, which must
// never appear in this codebase (it lives only in api/ serverless function
// environment variables on Vercel).
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createUnconfiguredStub();
