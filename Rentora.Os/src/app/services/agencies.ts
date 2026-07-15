import { requireSupabase } from "@/app/lib/supabase";
import type { AgencyRow, AgentProfileRow } from "@/app/types/database";

/** The agent's own agency (RLS returns only the caller's agency). */
export async function getMyAgency(): Promise<AgencyRow | null> {
  const sb = requireSupabase();
  const { data, error } = await sb.from("agencies").select("*").limit(1).maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function updateAgency(id: string, patch: Partial<AgencyRow>): Promise<AgencyRow> {
  const sb = requireSupabase();
  const { data, error } = await sb.from("agencies").update(patch).eq("id", id).select("*").single();
  if (error) throw error;
  return data;
}

export async function getMyAgentProfile(userId: string): Promise<AgentProfileRow | null> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("agent_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}
