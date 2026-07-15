import { requireSupabase } from "@/app/lib/supabase";
import type { UnitRow } from "@/app/types/database";

/** All units visible to the caller (RLS: agent's agency, or admin). */
export async function listUnits(): Promise<UnitRow[]> {
  const sb = requireSupabase();
  const { data, error } = await sb.from("units").select("*").order("unit_number", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createUnit(input: Partial<UnitRow>): Promise<UnitRow> {
  const sb = requireSupabase();
  const { data, error } = await sb.from("units").insert(input).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateUnit(id: string, patch: Partial<UnitRow>): Promise<UnitRow> {
  const sb = requireSupabase();
  const { data, error } = await sb.from("units").update(patch).eq("id", id).select("*").single();
  if (error) throw error;
  return data;
}

export async function deleteUnit(id: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.from("units").delete().eq("id", id);
  if (error) throw error;
}
