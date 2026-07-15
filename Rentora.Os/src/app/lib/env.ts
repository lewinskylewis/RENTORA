// Central, graceful access to public environment configuration. Missing values
// must NOT crash the app — the UI falls back to a clearly-labelled dev mode so
// the dashboards still render before a backend is connected.

const url = (import.meta.env.VITE_SUPABASE_URL ?? "").trim();
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

export const env = {
  supabaseUrl: url,
  supabaseAnonKey: anonKey,
};

/** True only when BOTH public Supabase variables are present. */
export const isSupabaseConfigured = url.length > 0 && anonKey.length > 0;
