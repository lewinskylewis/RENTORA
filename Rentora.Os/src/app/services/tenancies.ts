import { requireSupabase } from "@/app/lib/supabase";
import type { TenancyRow } from "@/app/types/database";

const LIVE: TenancyRow["status"][] = ["invited", "pending_confirmation", "active", "notice_given"];

/** The current tenant's tenancies (all history), newest first. */
export async function listMyTenancies(userId: string): Promise<TenancyRow[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("tenancies")
    .select("*")
    .eq("tenant_user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export function splitCurrentAndPast(tenancies: TenancyRow[]) {
  const current = tenancies.find((t) => LIVE.includes(t.status)) ?? null;
  const past = tenancies.filter((t) => t !== current);
  return { current, past };
}

/** Tenancies managed by the agent's agency (RLS enforces agency scope). */
export async function listAgencyTenancies(): Promise<TenancyRow[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("tenancies")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function giveNotice(tenancyId: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc("give_tenancy_notice", { _tenancy_id: tenancyId });
  if (error) throw error;
}

export async function endTenancy(tenancyId: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc("end_tenancy", { _tenancy_id: tenancyId });
  if (error) throw error;
}
