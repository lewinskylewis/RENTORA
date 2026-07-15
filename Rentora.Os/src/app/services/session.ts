import { requireSupabase } from "@/app/lib/supabase";
import type { ProfileRow, UserRoleRow } from "@/app/types/database";

export interface SessionBundle {
  userId: string;
  profile: ProfileRow | null;
  roles: UserRoleRow[];
}

/** Loads the authoritative profile + role set for a user, straight from the DB. */
export async function loadSessionBundle(userId: string): Promise<SessionBundle> {
  const sb = requireSupabase();
  const [profileRes, rolesRes] = await Promise.all([
    sb.from("profiles").select("*").eq("id", userId).maybeSingle(),
    sb.from("user_roles").select("*").eq("user_id", userId),
  ]);
  if (profileRes.error) throw profileRes.error;
  if (rolesRes.error) throw rolesRes.error;
  return {
    userId,
    profile: profileRes.data ?? null,
    roles: rolesRes.data ?? [],
  };
}

/** Update the caller's own profile (RLS restricts to own row). */
export async function updateMyProfile(userId: string, patch: Partial<ProfileRow>): Promise<ProfileRow> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("profiles")
    .update(patch)
    .eq("id", userId)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
