// Hand-authored to mirror supabase/migrations. When you have the Supabase CLI
// linked you can regenerate this with:
//   supabase gen types typescript --linked > src/app/types/database.ts
// Until then this file is the source of truth for the typed client.

export type AccountStatus = "active" | "suspended" | "disabled";
export type AppRole = "tenant" | "agent" | "admin";
export type RoleStatus = "pending" | "active" | "suspended" | "rejected";
export type VerificationStatus = "pending" | "verified" | "rejected" | "suspended";
export type AgencyStatus = "active" | "suspended";
export type PropertyStatus = "draft" | "active" | "archived";
export type OccupancyStatus = "vacant" | "reserved" | "occupied" | "maintenance";
export type ListingStatus = "private" | "published" | "hidden";
export type TenancyStatus =
  | "invited" | "pending_confirmation" | "active" | "notice_given" | "ended" | "cancelled" | "disputed";
export type InvitationStatus = "pending" | "matched" | "accepted" | "rejected" | "expired" | "cancelled";
export type ApplicationStatus = "pending" | "approved" | "rejected" | "needs_more_information";

export interface ProfileRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRow {
  id: string;
  user_id: string;
  role: AppRole;
  status: RoleStatus;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
}

export interface TenantProfileRow {
  id: string;
  user_id: string;
  national_id_last4: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  preferred_contact_method: string | null;
  created_at: string;
  updated_at: string;
}

export interface AgencyRow {
  id: string;
  name: string;
  business_registration_number: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  county: string | null;
  logo_url: string | null;
  status: AgencyStatus;
  created_at: string;
  updated_at: string;
}

export interface AgentProfileRow {
  id: string;
  user_id: string;
  agency_id: string | null;
  job_title: string | null;
  verification_status: VerificationStatus;
  onboarding_status: string;
  created_at: string;
  updated_at: string;
}

export interface AgentApplicationRow {
  id: string;
  user_id: string;
  agency_name: string;
  applicant_name: string;
  phone: string | null;
  email: string | null;
  county: string | null;
  estimated_units_managed: number | null;
  business_registration_number: string | null;
  notes: string | null;
  status: ApplicationStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface PropertyRow {
  id: string;
  agency_id: string;
  created_by: string | null;
  name: string;
  property_type: string | null;
  description: string | null;
  address: string | null;
  county: string | null;
  town: string | null;
  latitude: number | null;
  longitude: number | null;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
}

export interface UnitRow {
  id: string;
  property_id: string;
  unit_number: string;
  unit_type: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  monthly_rent: number | null;
  deposit_amount: number | null;
  occupancy_status: OccupancyStatus;
  listing_status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export interface TenancyRow {
  id: string;
  tenant_user_id: string;
  property_id: string;
  unit_id: string;
  agency_id: string;
  created_by_agent_id: string | null;
  lease_start: string | null;
  lease_end: string | null;
  monthly_rent: number | null;
  deposit_amount: number | null;
  billing_day: number | null;
  status: TenancyStatus;
  tenant_accepted_at: string | null;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TenantInvitationRow {
  id: string;
  agency_id: string;
  property_id: string;
  unit_id: string;
  invited_by_agent_id: string | null;
  tenant_name: string | null;
  tenant_email: string | null;
  tenant_phone: string | null;
  matched_user_id: string | null;
  invitation_token_hash: string | null;
  expires_at: string | null;
  status: InvitationStatus;
  lease_start: string | null;
  lease_end: string | null;
  monthly_rent: number | null;
  deposit_amount: number | null;
  billing_day: number | null;
  created_at: string;
  accepted_at: string | null;
  rejected_at: string | null;
}

export interface AuditLogRow {
  id: string;
  actor_user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

type TableShape<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: TableShape<ProfileRow>;
      user_roles: TableShape<UserRoleRow>;
      tenant_profiles: TableShape<TenantProfileRow>;
      agencies: TableShape<AgencyRow>;
      agent_profiles: TableShape<AgentProfileRow>;
      agent_applications: TableShape<AgentApplicationRow>;
      properties: TableShape<PropertyRow>;
      units: TableShape<UnitRow>;
      tenancies: TableShape<TenancyRow>;
      tenant_invitations: TableShape<TenantInvitationRow>;
      audit_logs: TableShape<AuditLogRow>;
    };
    Views: Record<string, never>;
    Functions: {
      submit_agent_application: {
        Args: {
          _agency_name: string;
          _applicant_name: string;
          _phone: string;
          _county: string;
          _estimated_units_managed?: number | null;
          _business_registration_number?: string | null;
          _notes?: string | null;
        };
        Returns: string;
      };
      review_agent_application: {
        Args: { _application_id: string; _decision: ApplicationStatus; _notes?: string | null };
        Returns: undefined;
      };
      set_agent_status: {
        Args: { _user_id: string; _status: RoleStatus };
        Returns: undefined;
      };
      create_tenant_invitation: {
        Args: {
          _property_id: string;
          _unit_id: string;
          _tenant_name: string;
          _tenant_email: string;
          _tenant_phone: string;
          _lease_start?: string | null;
          _lease_end?: string | null;
          _monthly_rent?: number | null;
          _deposit_amount?: number | null;
          _billing_day?: number | null;
          _expires_in_days?: number | null;
        };
        Returns: { invitation_id: string; matched: boolean; token: string | null };
      };
      accept_tenant_invitation: {
        Args: { _invitation_id: string; _token?: string | null };
        Returns: string;
      };
      reject_tenant_invitation: {
        Args: { _invitation_id: string; _token?: string | null };
        Returns: undefined;
      };
      give_tenancy_notice: { Args: { _tenancy_id: string }; Returns: undefined };
      end_tenancy: { Args: { _tenancy_id: string }; Returns: undefined };
    };
    Enums: {
      account_status: AccountStatus;
      app_role: AppRole;
      role_status: RoleStatus;
      verification_status: VerificationStatus;
      agency_status: AgencyStatus;
      property_status: PropertyStatus;
      occupancy_status: OccupancyStatus;
      listing_status: ListingStatus;
      tenancy_status: TenancyStatus;
      invitation_status: InvitationStatus;
      application_status: ApplicationStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
