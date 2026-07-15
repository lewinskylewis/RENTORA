import { CheckCircle2 } from "lucide-react";
import { BackToDashboardButton, DetailCard } from "@/app/components";
import { currentHome } from "@/app/data/mock-data";
import type { NavState } from "@/app/types";

export function PaymentSuccess({ onNav }: { onNav: (nav: NavState) => void }) {
  return (
    <main className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="relative mb-8 inline-block">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400/20 to-emerald-600/20 border border-teal-500/30 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(45,212,191,0.3)]">
          <CheckCircle2 className="w-10 h-10 text-teal-400" />
        </div>
        <div className="absolute inset-0 bg-teal-500/10 blur-[40px] rounded-full" />
      </div>
      <h2 className="text-3xl font-light tracking-tight mb-3">Payment Successful</h2>
      <p className="text-white/50 mb-2">Kes {(currentHome.rentAmount + currentHome.serviceCharge).toLocaleString()} paid</p>
      <p className="text-sm text-white/30 mb-10">A confirmation has been sent to your registered email and phone.</p>

      <DetailCard
        rows={[
          { label: "Reference", value: "RNT-2026-06-0412" },
          { label: "Date", value: "June 4, 2026" },
          { label: "Method", value: "M-Pesa" },
          { label: "Status", value: "Confirmed", valueClassName: "text-teal-400 font-medium" },
        ]}
      />

      <BackToDashboardButton onNav={onNav} />
    </main>
  );
}
