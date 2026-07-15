import { requireSupabase } from "@/app/lib/supabase";
import type { TenantInvitationRow } from "@/app/types/database";

export interface CreateInvitationInput {
  propertyId: string;
  unitId: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  leaseStart?: string | null;
  leaseEnd?: string | null;
  monthlyRent?: number | null;
  depositAmount?: number | null;
  billingDay?: number | null;
  expiresInDays?: number;
}

export interface CreateInvitationResult {
  invitation_id: string;
  matched: boolean;
  token: string | null; // raw token, only when the tenant has no account yet
}

export async function createInvitation(input: CreateInvitationInput): Promise<CreateInvitationResult> {
  const sb = requireSupabase();
  const { data, error } = await sb.rpc("create_tenant_invitation", {
    _property_id: input.propertyId,
    _unit_id: input.unitId,
    _tenant_name: input.tenantName,
    _tenant_email: input.tenantEmail,
    _tenant_phone: input.tenantPhone,
    _lease_start: input.leaseStart ?? null,
    _lease_end: input.leaseEnd ?? null,
    _monthly_rent: input.monthlyRent ?? null,
    _deposit_amount: input.depositAmount ?? null,
    _billing_day: input.billingDay ?? null,
    _expires_in_days: input.expiresInDays ?? 14,
  });
  if (error) throw error;
  return data;
}

/** Invitations addressed to the current tenant (matched to their account). */
export async function listMyInvitations(userId: string): Promise<TenantInvitationRow[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("tenant_invitations")
    .select("*")
    .eq("matched_user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Invitations issued by the agent's agency (RLS enforces agency scope). */
export async function listAgencyInvitations(): Promise<TenantInvitationRow[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("tenant_invitations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function acceptInvitation(invitationId: string, token?: string): Promise<string> {
  const sb = requireSupabase();
  const { data, error } = await sb.rpc("accept_tenant_invitation", {
    _invitation_id: invitationId,
    _token: token ?? null,
  });
  if (error) throw error;
  return data;
}

export async function rejectInvitation(invitationId: string, token?: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc("reject_tenant_invitation", {
    _invitation_id: invitationId,
    _token: token ?? null,
  });
  if (error) throw error;
}
