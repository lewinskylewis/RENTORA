import { useEffect, useState } from "react";
import { Building2, Users, FileClock, Home, Layers } from "lucide-react";
import { useSession } from "@/app/providers/SessionProvider";
import { adminService } from "@/app/services";
import type { AdminCounts } from "@/app/services/admin";

function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: typeof Building2 }) {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</span>
        <Icon className="w-4 h-4 text-zinc-500" />
      </div>
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
    </div>
  );
}

export function AdminDashboard() {
  const { isConfigured } = useSession();
  const [counts, setCounts] = useState<AdminCounts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }
    let active = true;
    adminService
      .getAdminCounts()
      .then((c) => active && setCounts(c))
      .catch((e) => active && setError(e instanceof Error ? e.message : String(e)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [isConfigured]);

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <h1 className="text-2xl font-semibold text-white">Overview</h1>
      <p className="mt-1 text-sm text-zinc-400">Platform-wide totals across every agency.</p>

      {!isConfigured && (
        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          Running in dev mode — connect Supabase (set <code>VITE_SUPABASE_URL</code> and{" "}
          <code>VITE_SUPABASE_ANON_KEY</code>) to see live counts.
        </div>
      )}
      {error && (
        <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>
      )}

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && isConfigured
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl border border-zinc-800/60 bg-zinc-900/40 animate-pulse" />
            ))
          : (
            <>
              <StatCard label="Agencies" value={counts?.agencies ?? "—"} icon={Building2} />
              <StatCard label="Properties" value={counts?.properties ?? "—"} icon={Home} />
              <StatCard label="Units" value={counts?.units ?? "—"} icon={Layers} />
              <StatCard label="Pending applications" value={counts?.pendingApplications ?? "—"} icon={FileClock} />
              <StatCard label="Active agents" value={counts?.activeAgents ?? "—"} icon={Users} />
            </>
          )}
      </div>
    </div>
  );
}
