// ─── Auth / role domain types ─────────────────────────────────────────────────
// These mirror the backend schema (see supabase/migrations). The permanent user
// identity comes from Supabase Auth; app roles live in `user_roles` so one person
// can hold tenant + agent + admin simultaneously.

export type AppRole = "tenant" | "agent" | "admin";

export type RoleStatus = "pending" | "active" | "suspended" | "rejected";

export type AccountStatus = "active" | "suspended" | "disabled";

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  status: RoleStatus;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
}

/** The workspace a multi-role user is currently viewing. */
export type Workspace = "tenant" | "agent" | "admin" | "guest";
