import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "./env";

// The client stays schema-agnostic at the boundary (the generated Database
// generic is version-brittle); strong typing lives in the service layer, which
// returns the hand-authored Row types from types/database.ts.
export type RentoraClient = SupabaseClient;

// A single shared client for the whole app. `null` when env is not configured
// (dev/preview mode) — services detect this and surface a clear error instead of
// throwing at import time. Only the ANON key is ever used here; the service-role
// key must never appear in VITE_ variables / client code.
export const supabase: RentoraClient | null = isSupabaseConfigured
  ? createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/** Narrowing helper: throws a readable error when the backend isn't wired yet. */
export function requireSupabase(): RentoraClient {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.",
    );
  }
  return supabase;
}

export { isSupabaseConfigured };
