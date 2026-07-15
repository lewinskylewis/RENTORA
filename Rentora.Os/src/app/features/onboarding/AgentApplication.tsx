import { useNavigate } from "react-router";
import { GlassCard, PageHeader, BackButton } from "@/app/components";
import { useSession } from "@/app/providers/SessionProvider";

/** /apply/agent — the agent application form is built in Phase 5. This page
 *  already lives on the correct route with the tenant design language so the
 *  onboarding flow is navigable end-to-end. */
export function AgentApplication() {
  const navigate = useNavigate();
  const { isConfigured } = useSession();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <BackButton onBack={() => navigate(-1)} />
      <PageHeader title="Become a Rentora agent" subtitle="Apply to manage properties on Rentora" accent="teal" />
      <GlassCard className="p-6 sm:p-8">
        <p className="text-sm text-white/70 leading-relaxed">
          The full application form (agency details, county, estimated units managed, and business registration)
          lands in Phase 5. It submits through <code className="text-white/90">submit_agent_application()</code>, which
          creates a <span className="text-white/90">pending</span> agent role — the Agent Dashboard stays locked until an
          administrator approves it.
        </p>
        {!isConfigured && (
          <p className="mt-4 text-xs text-amber-300/80">
            Connect Supabase to enable live submissions.
          </p>
        )}
        <button
          onClick={() => navigate("/agent-application/status")}
          className="mt-6 inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium text-white"
          style={{ background: "linear-gradient(to right,#14b8a6,#059669)" }}
        >
          View application status
        </button>
      </GlassCard>
    </div>
  );
}
