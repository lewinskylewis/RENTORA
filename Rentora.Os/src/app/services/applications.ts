import { requireSupabase } from "@/app/lib/supabase";
import type { AgentApplicationRow, ApplicationStatus } from "@/app/types/database";

export interface SubmitApplicationInput {
  agencyName: string;
  applicantName: string;
  phone: string;
  county: string;
  estimatedUnitsManaged?: number | null;
  businessRegistrationNumber?: string | null;
  notes?: string | null;
}

export async function submitAgentApplication(input: SubmitApplicationInput): Promise<string> {
  const sb = requireSupabase();
  const { data, error } = await sb.rpc("submit_agent_application", {
    _agency_name: input.agencyName,
    _applicant_name: input.applicantName,
    _phone: input.phone,
    _county: input.county,
    _estimated_units_managed: input.estimatedUnitsManaged ?? null,
    _business_registration_number: input.businessRegistrationNumber ?? null,
    _notes: input.notes ?? null,
  });
  if (error) throw error;
  return data;
}

/** The caller's most recent application (RLS restricts to own rows). */
export async function getMyLatestApplication(userId: string): Promise<AgentApplicationRow | null> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("agent_applications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

/** Admin: list applications, optionally filtered by status. */
export async function listApplications(status?: ApplicationStatus): Promise<AgentApplicationRow[]> {
  const sb = requireSupabase();
  let q = sb.from("agent_applications").select("*").order("created_at", { ascending: false });
  if (status) q = q.eq("status", status);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function reviewApplication(
  applicationId: string,
  decision: ApplicationStatus,
  notes?: string,
): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc("review_agent_application", {
    _application_id: applicationId,
    _decision: decision,
    _notes: notes ?? null,
  });
  if (error) throw error;
}
