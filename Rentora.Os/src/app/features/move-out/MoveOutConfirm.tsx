import { FileText } from "lucide-react";
import { BackToDashboardButton, DetailCard } from "@/app/components";
import type { NavState } from "@/app/types";

export function MoveOutConfirm({ onNav }: { onNav: (nav: NavState) => void }) {
  return (
    <main className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="relative mb-8 inline-block">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400/20 to-emerald-600/20 border border-teal-500/30 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(45,212,191,0.3)]">
          <FileText className="w-10 h-10 text-teal-400" />
        </div>
      </div>
      <h2 className="text-3xl font-light tracking-tight mb-3">Notice Submitted</h2>
      <p className="text-white/50 mb-2">Reference #MO-2026-0031</p>
      <p className="text-sm text-white/30 mb-10">Your 30-day move-out notice has been received. Your property manager will contact you within 2 business days to confirm inspection scheduling.</p>

      <DetailCard
        rows={[
          { label: "Notice Submitted", value: "Jul 4, 2026" },
          { label: "Vacate By", value: "Aug 4, 2026" },
          { label: "Deposit", value: "Kes 120,000" },
          { label: "Refund ETA", value: "Aug 22, 2026" },
        ]}
      />

      <div className="space-y-3">
        <BackToDashboardButton onNav={onNav} />
        <button onClick={() => onNav({ page: "house-detail", houseId: "1" })} className="w-full py-4 rounded-2xl border border-teal-500/30 text-teal-400 font-medium hover:bg-teal-500/10 transition-all">
          Browse New Homes
        </button>
      </div>
    </main>
  );
}
