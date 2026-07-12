import { useState } from "react";
import { Inbox, Search } from "lucide-react";
import { BackButton, PageHeader } from "@/app/components";
import { useTheme } from "@/app/theme";
import type { NavState } from "@/app/types";

export function InboxPage({ onNav }: { onNav: (nav: NavState) => void }) {
  const theme = useTheme();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [query, setQuery] = useState("");

  const threads = [
    { id: "1", name: "Amara Osei", role: "Property Manager · Skyline", avatar: "AO", gradient: "from-blue-500 to-purple-600", last: "A plumber has been scheduled for tomorrow between 9 AM and 12 PM.", time: "10:07 AM", unread: 0, online: true },
    { id: "2", name: "Kevin Mwangi", role: "Agent · Aurora Residences", avatar: "KM", gradient: "from-teal-500 to-emerald-600", last: "Yes, the unit is still available. Would you like to schedule a viewing?", time: "Yesterday", unread: 2, online: true },
    { id: "3", name: "Fatima Al-Amin", role: "Agent · Vista Luxury Suites", avatar: "FA", gradient: "from-purple-500 to-fuchsia-600", last: "Thank you for your interest! I've sent over the floor plans.", time: "Mon", unread: 0, online: false },
    { id: "4", name: "Rentora Support", role: "Customer Care", avatar: "RS", gradient: "from-indigo-500 to-blue-600", last: "Your ticket #TKT-2026-0047 has been received and is being reviewed.", time: "Jun 2", unread: 1, online: true },
    { id: "5", name: "Priya Sharma", role: "Agent · Nexus Towers", avatar: "PS", gradient: "from-amber-500 to-orange-600", last: "The ocean-view apartment has a private plunge pool on the balcony.", time: "May 28", unread: 0, online: false },
  ];

  const filtered = threads.filter((t) => {
    if (filter === "unread" && t.unread === 0) return false;
    if (query && !t.name.toLowerCase().includes(query.toLowerCase()) && !t.last.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const totalUnread = threads.reduce((a, t) => a + t.unread, 0);

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <BackButton onBack={() => onNav({ page: "dashboard" })} />
      <PageHeader title="Inbox" subtitle={totalUnread > 0 ? `${totalUnread} unread messages` : "All caught up"} accent="teal" />

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search messages..."
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-teal-500/50 transition-all"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] w-fit mb-5">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? "bg-white/[0.08] text-white border border-white/10" : "text-white/50 hover:text-white"}`}
          >
            {f}
            {f === "unread" && totalUnread > 0 && <span className="ml-1 text-teal-400">({totalUnread})</span>}
          </button>
        ))}
      </div>

      {/* Threads */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <Inbox className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm">No messages found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((t) => (
            <button
              key={t.id}
              onClick={() => onNav({ page: "contact-agent" })}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left group ${t.unread > 0 ? "bg-white/[0.04] border-white/[0.1] hover:bg-white/[0.07]" : "bg-white/[0.01] border-white/[0.04] hover:bg-white/[0.04]"}`}
            >
              <div className="relative flex-shrink-0">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                  {t.avatar}
                </div>
                {t.online && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-teal-400 border-2 shadow-[0_0_6px_rgba(45,212,191,0.8)]" style={{ borderColor: theme.dotBorder }} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className={`text-sm font-medium truncate ${t.unread > 0 ? "text-white/95" : "text-white/70"}`}>{t.name}</p>
                  <span className="text-xs text-white/30 flex-shrink-0">{t.time}</span>
                </div>
                <p className="text-[11px] text-white/35 mb-1 truncate">{t.role}</p>
                <p className={`text-xs truncate ${t.unread > 0 ? "text-white/60" : "text-white/35"}`}>{t.last}</p>
              </div>
              {t.unread > 0 && (
                <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(45,212,191,0.6)]">
                  {t.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
