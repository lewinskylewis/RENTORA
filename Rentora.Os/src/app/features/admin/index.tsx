import { AdminPlaceholder } from "./pages/AdminPlaceholder";

export { AdminDashboard } from "./pages/AdminDashboard";

export function AgentApplicationsPage() {
  return (
    <AdminPlaceholder
      title="Agent applications"
      note="Review, approve, reject, or request more information on agent applications. Wired to review_agent_application() in Phase 6."
    />
  );
}

export function AgentsPage() {
  return (
    <AdminPlaceholder
      title="Agents"
      note="View, suspend, and reactivate agents across all agencies. Backed by set_agent_status() in Phase 6."
    />
  );
}

export function AgenciesPage() {
  return <AdminPlaceholder title="Agencies" note="Browse agencies and their property/unit counts. Arrives in Phase 6." />;
}
