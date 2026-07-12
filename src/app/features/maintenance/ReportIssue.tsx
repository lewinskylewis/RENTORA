import { useState } from "react";
import { Camera, Send } from "lucide-react";
import { BackButton, GlassCard, PageHeader, Spinner, StatusIcon } from "@/app/components";
import { maintenanceTickets } from "@/app/data/mock-data";
import { useTheme } from "@/app/theme";
import type { NavState } from "@/app/types";

export function ReportIssue({ onNav }: { onNav: (nav: NavState) => void }) {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { id: "plumbing", label: "Plumbing", icon: "🚿" },
    { id: "electrical", label: "Electrical", icon: "⚡" },
    { id: "structural", label: "Structural", icon: "🏗️" },
    { id: "appliance", label: "Appliance", icon: "🔌" },
    { id: "security", label: "Security", icon: "🔐" },
    { id: "cleaning", label: "Cleaning", icon: "🧹" },
  ];

  const priorityColors = {
    low: "text-teal-400 border-teal-500/50 bg-teal-500/10",
    medium: "text-yellow-400 border-yellow-500/50 bg-yellow-500/10",
    high: "text-red-400 border-red-500/50 bg-red-500/10",
  };

  const handleSubmit = () => {
    if (!selectedCategory || !description) return;
    setSubmitting(true);
    setTimeout(() => onNav({ page: "issue-success" }), 1600);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <BackButton onBack={() => onNav({ page: "dashboard" })} />
      <PageHeader title="Report an Issue" subtitle="We'll respond within 24 hours" accent="purple" />

      {/* Active tickets */}
      {maintenanceTickets.length > 0 && (
        <GlassCard className="p-5 mb-6">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">Active Tickets</p>
          <div className="space-y-3">
            {maintenanceTickets.map((t) => (
              <div key={t.id} className="flex items-center gap-3 text-sm">
                <StatusIcon status={t.status} />
                <span className="text-white/80 flex-1">{t.title}</span>
                <span className="text-white/30 text-xs capitalize">{t.status.replace("-", " ")}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <GlassCard className="p-6 mb-5">
        <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">Issue Category</p>
        <div className="grid grid-cols-3 gap-3">
          {categories.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`p-4 rounded-2xl border text-center transition-all duration-200 ${
                selectedCategory === id
                  ? "bg-purple-500/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                  : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]"
              }`}
            >
              <span className="text-2xl block mb-1">{icon}</span>
              <span className={`text-xs font-medium ${selectedCategory === id ? "text-purple-300" : "text-white/60"}`}>{label}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-6 mb-5">
        <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">Priority Level</p>
        <div className="flex gap-3">
          {(["low", "medium", "high"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize border transition-all ${
                priority === p ? priorityColors[p] : "bg-white/[0.02] border-white/[0.05] text-white/50 hover:bg-white/[0.05]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-6 mb-5">
        <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Describe the issue in detail — what happened, when it started, and how urgent it is..."
          className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 text-white placeholder-white/20 text-sm resize-none focus:outline-none focus:border-purple-500/50 focus:shadow-[0_0_0_2px_rgba(168,85,247,0.1)] transition-all"
        />
        <div className="text-xs text-white/30 mt-2 text-right">{description.length}/500</div>
      </GlassCard>

      <GlassCard className="p-6 mb-8">
        <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">Attach Photos (optional)</p>
        <div className="border-2 border-dashed border-white/[0.08] rounded-2xl p-8 text-center hover:border-white/[0.15] hover:bg-white/[0.02] transition-all cursor-pointer group">
          <Camera className="w-8 h-8 text-white/20 group-hover:text-white/40 mx-auto mb-3 transition-colors" />
          <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors">Tap to upload photos</p>
          <p className="text-xs text-white/20 mt-1">JPG, PNG up to 10MB each</p>
        </div>
      </GlassCard>

      <button
        onClick={handleSubmit}
        disabled={!selectedCategory || !description || submitting}
        className="w-full py-4 rounded-2xl text-white font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
        style={{ background: theme.ctaPurple, boxShadow: `0 0 30px ${theme.glow3}` }}
      >
        {submitting ? (
          <><Spinner /> Submitting...</>
        ) : (
          <><Send className="w-5 h-5" /> Submit Ticket</>
        )}
      </button>
    </main>
  );
}
