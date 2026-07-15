import { useNavigate } from "react-router";
import { Clock, CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { GlassCard, PageHeader } from "@/app/components";
import { useSession } from "@/app/providers/SessionProvider";

/** /agent-application/status — reflects the agent role's status from the backend.
 *  Approved agents get a button into the dashboard; pending/rejected/needs-info
 *  see the matching message. Detailed application timeline arrives in Phase 5. */
export function AgentApplicationStatus() {
  const navigate = useNavigate();
  const { roles, hasRole } = useSession();
  const agent = roles.find((r) => r.role === "agent");

  const state = hasRole("agent", "active")
    ? "approved"
    : agent?.status === "rejected"
      ? "rejected"
      : agent?.status === "suspended"
        ? "suspended"
        : agent
          ? "pending"
          : "none";

  const config = {
    approved: { icon: CheckCircle2, color: "#22c55e", title: "Application approved", body: "You now have agent access. Head to the Agent Dashboard to get started." },
    pending: { icon: Clock, color: "#60a5fa", title: "Application under review", body: "Your agent application is pending. We'll notify you once an administrator reviews it." },
    rejected: { icon: XCircle, color: "#f43f5e", title: "Application not approved", body: "Your agent application was not approved. Contact support if you believe this is an error." },
    suspended: { icon: XCircle, color: "#f59e0b", title: "Agent access suspended", body: "Your agent access is currently suspended. Contact an administrator for details." },
    none: { icon: HelpCircle, color: "#a855f7", title: "No application yet", body: "You haven't applied to become an agent. Start an application to manage properties on Rentora." },
  }[state];

  const Icon = config.icon;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader title="Agent application" subtitle="Track your onboarding status" accent="purple" />
      <GlassCard className="p-8 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${config.color}20` }}>
          <Icon className="w-7 h-7" style={{ color: config.color }} />
        </div>
        <h3 className="mt-5 text-xl font-semibold">{config.title}</h3>
        <p className="mt-2 text-sm text-white/60 max-w-sm">{config.body}</p>

        {state === "approved" && (
          <button
            onClick={() => navigate("/agent")}
            className="mt-6 rounded-full px-5 py-2.5 text-sm font-medium text-white"
            style={{ background: "linear-gradient(to right,#3b82f6,#9333ea)" }}
          >
            Go to Agent Dashboard
          </button>
        )}
        {state === "none" && (
          <button
            onClick={() => navigate("/apply/agent")}
            className="mt-6 rounded-full px-5 py-2.5 text-sm font-medium text-white"
            style={{ background: "linear-gradient(to right,#a855f7,#d946ef)" }}
          >
            Apply to become an agent
          </button>
        )}
        <button onClick={() => navigate("/tenant/dashboard")} className="mt-4 text-sm text-white/50 hover:text-white transition-colors">
          Back to tenant dashboard
        </button>
      </GlassCard>
    </div>
  );
}
