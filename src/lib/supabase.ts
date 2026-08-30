import { createClient } from "@supabase/supabase-js";

// ADMIN SETUP REQUIRED
// -----------------------------------------------------------------------
// 1. Create a free project at https://supabase.com
// 2. Run /supabase/schema.sql in the Supabase SQL editor to create all tables.
// 3. In Supabase: Project Settings -> API, copy the "Project URL" and the
//    "anon public" key (NOT the service_role key — that one stays server-side only).
// 4. In Netlify: Site settings -> Environment variables, add:
//      VITE_SUPABASE_URL
//      VITE_SUPABASE_ANON_KEY
// 5. Locally, copy .env.example to .env and fill in the same two values.
//
// The anon key is safe to ship to the browser IF Row Level Security (RLS)
// policies are enabled on every table (the schema.sql file does this for you).
// Never put the service_role key in any file under /src — it belongs only in
// Netlify Function environment variables (see netlify/functions/*.ts).
// -----------------------------------------------------------------------

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    "[ADPAP] Supabase environment variables are not set. The app will run in local demo mode " +
      "(data is stored only in this browser tab). Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
      "to enable the real database. See src/lib/supabase.ts for setup instructions."
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;
