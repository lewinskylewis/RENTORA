import { requireSupabase } from "@/app/lib/supabase";
import type { PropertyRow, UnitRow } from "@/app/types/database";

/** Properties visible to the caller (RLS: agent's agency, or admin). */
export async function listProperties(): Promise<PropertyRow[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getProperty(id: string): Promise<PropertyRow | null> {
  const sb = requireSupabase();
  const { data, error } = await sb.from("properties").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function getPropertyUnits(propertyId: string): Promise<UnitRow[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("units")
    .select("*")
    .eq("property_id", propertyId)
    .order("unit_number", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createProperty(input: Partial<PropertyRow>): Promise<PropertyRow> {
  const sb = requireSupabase();
  const { data, error } = await sb.from("properties").insert(input).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateProperty(id: string, patch: Partial<PropertyRow>): Promise<PropertyRow> {
  const sb = requireSupabase();
  const { data, error } = await sb.from("properties").update(patch).eq("id", id).select("*").single();
  if (error) throw error;
  return data;
}

export async function archiveProperty(id: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.from("properties").update({ status: "archived" }).eq("id", id);
  if (error) throw error;
}
