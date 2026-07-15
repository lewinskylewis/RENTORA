import { Bell, Sparkles, Wallet, Wrench } from "lucide-react";
import { BackButton, PageHeader } from "@/app/components";
import type { NavState } from "@/app/types";

export function Notifications({ onNav }: { onNav: (nav: NavState) => void }) {
  const notifications = [
    { id: "1", type: "payment", title: "Rent Due Soon", desc: "Your rent of Kes 60,000 is due in 11 days on June 15.", time: "2h ago", read: false, action: () => onNav({ page: "pay-rent" }) },
    { id: "2", type: "maintenance", title: "Ticket Update", desc: "Your kitchen faucet ticket is now In Progress. Plumber scheduled for tomorrow.", time: "4h ago", read: false, action: () => onNav({ page: "report-issue" }) },
    { id: "3", type: "ai", title: "New AI Recommendation", desc: "We found 3 properties that match your profile in Westlands.", time: "1d ago", read: true, action: () => onNav({ page: "ai-suggestions", suggestionType: "similar" }) },
    { id: "4", type: "system", title: "Lease Renewal Coming Up", desc: "Your lease expires in 3 months. Contact your agent to discuss renewal terms.", time: "2d ago", read: true, action: () => onNav({ page: "contact-agent" }) },
    { id: "5", type: "payment", title: "Payment Confirmed", desc: "Your rent payment of Kes 62,500 for May 2026 has been confirmed.", time: "1 month ago", read: true, action: () => {} },
  ];

  const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
    payment: { icon: <Wallet className="w-4 h-4" />, color: "bg-indigo-500/10 text-indigo-400" },
    maintenance: { icon: <Wrench className="w-4 h-4" />, color: "bg-purple-500/10 text-purple-400" },
    ai: { icon: <Sparkles className="w-4 h-4" />, color: "bg-blue-500/10 text-blue-400" },
    system: { icon: <Bell className="w-4 h-4" />, color: "bg-teal-500/10 text-teal-400" },
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <BackButton onBack={() => onNav({ page: "dashboard" })} />
      <PageHeader title="Notifications" subtitle={`${notifications.filter((n) => !n.read).length} unread`} accent="purple" />

      <div className="space-y-3">
        {notifications.map((n) => {
          const cfg = typeConfig[n.type];
          return (
            <button
              key={n.id}
              onClick={n.action}
              className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 group ${
                !n.read ? "bg-white/[0.04] border-white/[0.1] hover:bg-white/[0.07]" : "bg-white/[0.01] border-white/[0.04] hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex gap-4">
                <div className={`flex-shrink-0 p-2.5 rounded-xl ${cfg.color}`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`text-sm font-medium ${!n.read ? "text-white/95" : "text-white/60"}`}>{n.title}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!n.read && <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />}
                      <span className="text-xs text-white/25">{n.time}</span>
                    </div>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">{n.desc}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
}
