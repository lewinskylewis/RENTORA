import type { NavState } from "@/app/types";

export function BackToDashboardButton({ onNav }: { onNav: (nav: NavState) => void }) {
  return (
    <button onClick={() => onNav({ page: "dashboard" })} className="w-full py-4 rounded-2xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.08] text-white font-medium transition-all">
      Back to Dashboard
    </button>
  );
}
