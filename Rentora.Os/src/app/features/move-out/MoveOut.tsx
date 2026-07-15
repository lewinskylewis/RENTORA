import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { BackButton, GlassCard, PageHeader } from "@/app/components";
import { useTheme } from "@/app/theme";
import type { NavState } from "@/app/types";

export function MoveOut({ onNav }: { onNav: (nav: NavState) => void }) {
  const theme = useTheme();
  const [moveOutDate, setMoveOutDate] = useState("");
  const [reason, setReason] = useState("");
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2>(1);

  const checklist = [
    "I understand I need to give 30 days notice",
    "I will return all keys and access cards",
    "I will allow property inspection on vacate",
    "I understand deposit refund takes 14 working days",
    "I will clear all outstanding balances",
  ];

  const reasons = ["Relocating to another city", "Upgrading to a bigger space", "Financial reasons", "Family circumstances", "Dissatisfied with property", "Other"];

  const toggleCheck = (item: string) => {
    setCheckedItems((prev) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]);
  };

  const allChecked = checkedItems.length === checklist.length;

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <BackButton onBack={() => onNav({ page: "dashboard" })} />
      <PageHeader title="Move-Out Request" subtitle="30-day notice required" accent="teal" />

      {/* Timeline */}
      <GlassCard className="p-6 mb-6">
        <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-5">Process Timeline</p>
        <div className="space-y-0">
          {[
            { step: "1", label: "Submit Notice", desc: "Today — 30 day clock starts", done: true },
            { step: "2", label: "Property Inspection", desc: "28 days from notice", done: false },
            { step: "3", label: "Key Handover", desc: "Move-out day", done: false },
            { step: "4", label: "Deposit Refund", desc: "14 working days after inspection", done: false },
          ].map(({ step: s, label, desc, done }, i, arr) => (
            <div key={s} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${done ? "bg-teal-500/20 border-teal-500/50 text-teal-400" : "bg-white/[0.03] border-white/[0.08] text-white/30"}`}>
                  {done ? <Check className="w-4 h-4" /> : s}
                </div>
                {i < arr.length - 1 && <div className="w-px h-8 bg-white/[0.05] my-1" />}
              </div>
              <div className="pb-6">
                <p className={`text-sm font-medium ${done ? "text-white/90" : "text-white/50"}`}>{label}</p>
                <p className="text-xs text-white/30 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {step === 1 ? (
        <>
          <GlassCard className="p-6 mb-5">
            <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">Intended Move-Out Date</p>
            <input
              type="date"
              value={moveOutDate}
              onChange={(e) => setMoveOutDate(e.target.value)}
              min="2026-07-04"
              className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-teal-500/50 transition-all [color-scheme:dark]"
            />
          </GlassCard>

          <GlassCard className="p-6 mb-8">
            <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">Reason for Moving</p>
            <div className="grid grid-cols-2 gap-3">
              {reasons.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`p-3 rounded-xl text-xs text-left border transition-all ${reason === r ? "bg-teal-500/10 border-teal-500/50 text-teal-300" : "bg-white/[0.02] border-white/[0.05] text-white/50 hover:bg-white/[0.05]"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </GlassCard>

          <button
            onClick={() => setStep(2)}
            disabled={!moveOutDate || !reason}
            className="w-full py-4 rounded-2xl text-white font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            style={{ background: theme.ctaTeal, boxShadow: `0 0 30px ${theme.glow2}` }}
          >
            Continue <ArrowRight className="w-5 h-5" />
          </button>
        </>
      ) : (
        <>
          <GlassCard className="p-6 mb-8">
            <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-5">Acknowledgement Checklist</p>
            <div className="space-y-4">
              {checklist.map((item) => (
                <button
                  key={item}
                  onClick={() => toggleCheck(item)}
                  className="flex items-start gap-4 w-full text-left group"
                >
                  <div className={`flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 transition-all ${checkedItems.includes(item) ? "bg-teal-500 border-teal-500" : "border-white/20 group-hover:border-white/40"}`}>
                    {checkedItems.includes(item) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm transition-colors ${checkedItems.includes(item) ? "text-white/70" : "text-white/40 group-hover:text-white/60"}`}>{item}</span>
                </button>
              ))}
            </div>
          </GlassCard>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white/70 font-medium hover:bg-white/[0.06] transition-all">
              Back
            </button>
            <button
              disabled={!allChecked}
              onClick={() => onNav({ page: "moveout-confirm" })}
              className="flex-[2] py-4 rounded-2xl text-white font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: theme.ctaTeal, boxShadow: `0 0 30px ${theme.glow2}` }}
            >
              Submit Move-Out Notice
            </button>
          </div>
        </>
      )}
    </main>
  );
}
