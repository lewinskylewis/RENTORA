import { requireSupabase } from "@/app/lib/supabase";

export interface AgentMetrics {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  reservedUnits: number;
  occupancyPct: number;
  activeTenancies: number;
  pendingInvitations: number;
}

/** Agency-scoped dashboard metrics. RLS guarantees every query only counts the
 *  logged-in agent's agency, so no explicit agency filter is needed. */
export async function getAgentMetrics(): Promise<AgentMetrics> {
  const sb = requireSupabase();
  const head = (t: "properties" | "units" | "tenancies" | "tenant_invitations") =>
    sb.from(t).select("*", { count: "exact", head: true });

  const [props, units, occupied, vacant, reserved, activeTen, pendingInv] = await Promise.all([
    head("properties"),
    head("units"),
    head("units").eq("occupancy_status", "occupied"),
    head("units").eq("occupancy_status", "vacant"),
    head("units").eq("occupancy_status", "reserved"),
    head("tenancies").eq("status", "active"),
    head("tenant_invitations").in("status", ["pending", "matched"]),
  ]);

  for (const r of [props, units, occupied, vacant, reserved, activeTen, pendingInv]) {
    if (r.error) throw r.error;
  }

  const totalUnits = units.count ?? 0;
  const occupiedUnits = occupied.count ?? 0;
  return {
    totalProperties: props.count ?? 0,
    totalUnits,
    occupiedUnits,
    vacantUnits: vacant.count ?? 0,
    reservedUnits: reserved.count ?? 0,
    occupancyPct: totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0,
    activeTenancies: activeTen.count ?? 0,
    pendingInvitations: pendingInv.count ?? 0,
  };
}
