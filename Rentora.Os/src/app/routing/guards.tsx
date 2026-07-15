import { Navigate, Outlet } from "react-router";
import { useSession } from "@/app/providers/SessionProvider";

// Full-screen neutral loading state used while the session resolves. Kept dark
// so it works under both the tenant and agent shells.
function FullScreenLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-400">
      <div className="flex items-center gap-3 text-sm">
        <span className="w-4 h-4 rounded-full border-2 border-zinc-600 border-t-transparent animate-spin" />
        Loading…
      </div>
    </div>
  );
}

/** Any signed-in user. Unauthenticated visitors go to /login. */
export function RequireAuth() {
  const { loading, userId } = useSession();
  if (loading) return <FullScreenLoading />;
  if (!userId) return <Navigate to="/login" replace />;
  return <Outlet />;
}

/** Approved agents only. Pending/rejected agents are routed to their status
 *  page; users with no agent role are bounced to the tenant workspace. */
export function RequireAgent() {
  const { loading, userId, hasRole } = useSession();
  if (loading) return <FullScreenLoading />;
  if (!userId) return <Navigate to="/login" replace />;
  if (hasRole("agent", "active")) return <Outlet />;
  // Pending, rejected, or suspended agents all land on the status page (which
  // renders the appropriate message); users with no agent role go to /tenant.
  if (hasRole("agent", "pending") || hasRole("agent", "rejected") || hasRole("agent", "suspended")) {
    return <Navigate to="/agent-application/status" replace />;
  }
  return <Navigate to="/tenant/dashboard" replace />;
}

/** Active admins only. */
export function RequireAdmin() {
  const { loading, userId, hasRole } = useSession();
  if (loading) return <FullScreenLoading />;
  if (!userId) return <Navigate to="/login" replace />;
  if (hasRole("admin", "active")) return <Outlet />;
  return <Navigate to="/tenant/dashboard" replace />;
}
