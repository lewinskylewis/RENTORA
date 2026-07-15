import { CheckCircle2 } from "lucide-react";
import { BackToDashboardButton, DetailCard } from "@/app/components";
import type { NavState } from "@/app/types";

export function IssueSuccess({ onNav }: { onNav: (nav: NavState) => void }) {
  return (
    <main className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="relative mb-8 inline-block">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400/20 to-fuchsia-600/20 border border-purple-500/30 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(168,85,247,0.3)]">
          <CheckCircle2 className="w-10 h-10 text-purple-400" />
        </div>
      </div>
      <h2 className="text-3xl font-light tracking-tight mb-3">Ticket Submitted</h2>
      <p className="text-white/50 mb-2">Ticket #TKT-2026-0047</p>
      <p className="text-sm text-white/30 mb-10">A maintenance team member will contact you within 24 hours to schedule a visit.</p>

      <DetailCard
        rows={[
          { label: "Status", value: "Pending" },
          { label: "Estimated Response", value: "Within 24 hrs" },
          { label: "Priority", value: "Medium" },
          { label: "Assigned To", value: "Maintenance Team" },
        ]}
      />

      <BackToDashboardButton onNav={onNav} />
    </main>
  );
}
