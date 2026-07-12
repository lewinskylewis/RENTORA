import { ExternalLink, FileText, Globe, Heart, Info, Lock, Shield, Sparkles, Wallet, Wrench } from "lucide-react";
import { BackButton, GlassCard, RentoraMark } from "@/app/components";
import { useTheme } from "@/app/theme";
import type { NavState } from "@/app/types";

export function About({ onNav }: { onNav: (nav: NavState) => void }) {
  const theme = useTheme();

  const features = [
    { icon: Wallet, label: "Secure Payments", desc: "M-Pesa, Airtel & cards", color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { icon: Sparkles, label: "AI Recommendations", desc: "Homes matched to you", color: "text-blue-400", bg: "bg-blue-500/10" },
    { icon: Wrench, label: "Fast Maintenance", desc: "24-hour response", color: "text-purple-400", bg: "bg-purple-500/10" },
    { icon: Shield, label: "Tenant Scoring", desc: "Build your reputation", color: "text-teal-400", bg: "bg-teal-500/10" },
  ];

  const stats = [
    { value: "50K+", label: "Tenants" },
    { value: "12K+", label: "Homes" },
    { value: "4.9", label: "Rating" },
    { value: "98%", label: "Happy" },
  ];

  const changelog = [
    { version: "2.4.1", date: "Jun 2026", note: "New AI suggestion engine and theme customisation." },
    { version: "2.3.0", date: "Apr 2026", note: "Redesigned move-out flow with a live process timeline." },
    { version: "2.2.0", date: "Feb 2026", note: "Added Airtel Money and faster payment processing." },
  ];

  const links = [
    { label: "Visit Website", icon: Globe },
    { label: "Privacy Policy", icon: Lock },
    { label: "Terms of Service", icon: FileText },
    { label: "Help Center", icon: Info },
  ];

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <BackButton onBack={() => onNav({ page: "dashboard" })} />

      {/* Hero */}
      <GlassCard className="p-8 mb-6 text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 0%, ${theme.glow1}, transparent 70%)`, opacity: 0.15 }} />
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5" style={{ background: `linear-gradient(135deg,${theme.logoFrom},${theme.logoTo})`, boxShadow: `0 0 35px ${theme.logoGlow}` }}>
            <RentoraMark className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-semibold tracking-tight mb-1">Rentora</h2>
          <p className="text-[11px] uppercase tracking-[0.2em] text-teal-400/80 font-semibold mb-4">Home Starts Here</p>
          <span className="inline-block px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs font-medium text-white/60">Version 2.4.1</span>
          <p className="text-sm text-white/50 leading-relaxed mt-5 max-w-md mx-auto">
            Rentora is the intelligent operating system for modern renting — pay rent, report issues, discover your next home, and build your tenant reputation, all in one beautifully simple app.
          </p>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <GlassCard key={s.label} className="p-4 text-center">
            <div className="text-xl font-light text-transparent bg-clip-text" style={{ backgroundImage: theme.priceGrad }}>{s.value}</div>
            <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Features */}
      <GlassCard className="p-6 mb-6">
        <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-5">What Rentora Does</p>
        <div className="grid grid-cols-2 gap-4">
          {features.map(({ icon: Icon, label, desc, color, bg }) => (
            <div key={label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className={`p-2.5 rounded-xl ${bg} ${color} w-fit mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-white/90">{label}</p>
              <p className="text-xs text-white/40 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Changelog */}
      <GlassCard className="p-6 mb-6">
        <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-5">What's New</p>
        <div className="space-y-0">
          {changelog.map((c, i, arr) => (
            <div key={c.version} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.7)] mt-1.5" />
                {i < arr.length - 1 && <div className="w-px flex-1 bg-white/[0.06] my-1" />}
              </div>
              <div className="pb-6">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white/90">v{c.version}</p>
                  <span className="text-xs text-white/30">· {c.date}</span>
                </div>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">{c.note}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Links */}
      <GlassCard className="p-3 mb-6">
        {links.map(({ label, icon: Icon }, i, arr) => (
          <button key={label} className={`w-full flex items-center gap-4 p-3.5 rounded-xl hover:bg-white/[0.04] transition-colors group text-left ${i < arr.length - 1 ? "border-b border-white/[0.04]" : ""}`}>
            <div className="p-2 rounded-lg bg-white/[0.03] text-white/50 group-hover:text-white/80 transition-colors">
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-sm text-white/80 flex-1">{label}</span>
            <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
          </button>
        ))}
      </GlassCard>

      <p className="text-center text-xs text-white/25 leading-relaxed pb-4">
        Made with <Heart className="w-3 h-3 text-red-400/60 fill-red-400/60 inline -mt-0.5" /> in Nairobi<br />
        © 2026 Rentora Technologies. All rights reserved.
      </p>
    </main>
  );
}
