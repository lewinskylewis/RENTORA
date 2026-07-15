import { requireSupabase } from "@/app/lib/supabase";
import type { RoleStatus } from "@/app/types/database";

async function count(table: "agencies" | "properties" | "units" | "agent_applications" | "user_roles"): Promise<number> {
  const sb = requireSupabase();
  const { count, error } = await sb.from(table).select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

export interface AdminCounts {
  agencies: number;
  properties: number;
  units: number;
  pendingApplications: number;
  activeAgents: number;
}

export async function getAdminCounts(): Promise<AdminCounts> {
  const sb = requireSupabase();
  const [agencies, properties, units, pendingApps, activeAgents] = await Promise.all([
    count("agencies"),
    count("properties"),
    count("units"),
    sb.from("agent_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    sb.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "agent").eq("status", "active"),
  ]);
  if (pendingApps.error) throw pendingApps.error;
  if (activeAgents.error) throw activeAgents.error;
  return {
    agencies,
    properties,
    units,
    pendingApplications: pendingApps.count ?? 0,
    activeAgents: activeAgents.count ?? 0,
  };
}

/** Admin: suspend / reactivate an agent (also flips their agent_profile). */
export async function setAgentStatus(userId: string, status: RoleStatus): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.rpc("set_agent_status", { _user_id: userId, _status: status });
  if (error) throw error;
}
