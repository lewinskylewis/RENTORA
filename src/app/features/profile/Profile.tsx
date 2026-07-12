import { useState } from "react";
import {
  Award,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Edit3,
  Fingerprint,
  Lock,
  LogOut,
  Mail,
  Phone,
  Shield,
  User,
  Wallet,
} from "lucide-react";
import { BackButton, GlassCard, PageHeader, Toggle } from "@/app/components";
import { currentHome } from "@/app/data/mock-data";
import type { NavState } from "@/app/types";

export function Profile({ onNav }: { onNav: (nav: NavState) => void }) {
  const [editing, setEditing] = useState(false);
  const [info, setInfo] = useState({
    name: "James Mwangi",
    email: "james.mwangi@email.com",
    phone: "+254 712 345 678",
    id: "3401••••",
    occupation: "Software Engineer",
  });
  const [prefs, setPrefs] = useState({ push: true, email: true, sms: false, marketing: false });
  const togglePref = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  const stats = [
    { label: "Tenant Score", value: "850", sub: "Excellent", color: "text-purple-400" },
    { label: "On-Time Rate", value: "100%", sub: "36 payments", color: "text-teal-400" },
    { label: "Tenure", value: "2 yrs", sub: "Since 2024", color: "text-blue-400" },
  ];

  const personalFields = [
    { key: "name", label: "Full Name", icon: User },
    { key: "email", label: "Email Address", icon: Mail },
    { key: "phone", label: "Phone Number", icon: Phone },
    { key: "id", label: "National ID", icon: Fingerprint },
    { key: "occupation", label: "Occupation", icon: Briefcase },
  ] as const;

  const leaseRows = [
    { label: "Residence", value: currentHome.unit },
    { label: "Location", value: currentHome.location },
    { label: "Monthly Rent", value: `Kes ${currentHome.rentAmount.toLocaleString()}` },
    { label: "Lease Period", value: "Jan 2024 – Dec 2026" },
    { label: "Deposit Held", value: `Kes ${currentHome.deposit.toLocaleString()}` },
  ];

  const prefRows = [
    { key: "push", label: "Push Notifications", desc: "Alerts on your device" },
    { key: "email", label: "Email Updates", desc: "Receipts and reminders" },
    { key: "sms", label: "SMS Alerts", desc: "Payment confirmations" },
    { key: "marketing", label: "Offers & Promotions", desc: "New listings and deals" },
  ] as const;

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <BackButton onBack={() => onNav({ page: "dashboard" })} />
      <PageHeader title="Profile" subtitle="Manage your account" accent="blue" />

      {/* Hero */}
      <GlassCard className="p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5" />
        <div className="relative z-10 flex items-center gap-5 flex-wrap">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-[0_0_25px_rgba(147,51,234,0.35)] flex-shrink-0">
            JM
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-light tracking-tight">{info.name}</h3>
              <div className="p-1 rounded-full bg-teal-500/15" title="Verified">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
              </div>
            </div>
            <p className="text-sm text-white/50 truncate">{info.email}</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold flex items-center gap-1">
                <Award className="w-3 h-3" /> Score 850
              </span>
              <span className="px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold">
                Verified Tenant
              </span>
            </div>
          </div>
          <button
            onClick={() => setEditing((e) => !e)}
            className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] text-white text-sm font-medium transition-all flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4 text-blue-400" /> {editing ? "Done" : "Edit"}
          </button>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map((s) => (
          <GlassCard key={s.label} className="p-4 text-center">
            <div className={`text-2xl font-light ${s.color}`}>{s.value}</div>
            <p className="text-xs text-white/70 mt-1">{s.label}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{s.sub}</p>
          </GlassCard>
        ))}
      </div>

      {/* Personal Info */}
      <GlassCard className="p-6 mb-6">
        <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-5">Personal Information</p>
        <div className="space-y-4">
          {personalFields.map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-blue-400 flex-shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/40 mb-1">{label}</p>
                {editing && key !== "id" ? (
                  <input
                    value={info[key]}
                    onChange={(e) => setInfo((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                ) : (
                  <p className="text-sm font-medium text-white/90 truncate">{info[key]}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Lease */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-medium text-white/60 uppercase tracking-wider">Current Lease</p>
          <span className="px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium">Active</span>
        </div>
        <div className="space-y-3">
          {leaseRows.map((r) => (
            <div key={r.label} className="flex justify-between text-sm gap-4">
              <span className="text-white/50 flex-shrink-0">{r.label}</span>
              <span className="text-white/90 text-right">{r.value}</span>
            </div>
          ))}
        </div>
        <button onClick={() => onNav({ page: "pay-rent" })} className="w-full mt-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] text-sm font-medium text-white/80 transition-all flex items-center justify-center gap-2">
          <Wallet className="w-4 h-4 text-indigo-400" /> Manage Payments
        </button>
      </GlassCard>

      {/* Preferences */}
      <GlassCard className="p-6 mb-6">
        <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-5">Notification Preferences</p>
        <div className="space-y-4">
          {prefRows.map((r) => (
            <div key={r.key} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white/85">{r.label}</p>
                <p className="text-xs text-white/40 mt-0.5">{r.desc}</p>
              </div>
              <Toggle on={prefs[r.key]} onToggle={() => togglePref(r.key)} />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Security */}
      <GlassCard className="p-6 mb-6">
        <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-5">Security</p>
        <div className="space-y-2">
          {[
            { label: "Change Password", desc: "Last changed 3 months ago", icon: Lock },
            { label: "Two-Factor Authentication", desc: "Enabled via SMS", icon: Shield },
          ].map(({ label, desc, icon: Icon }) => (
            <button key={label} className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.04] transition-colors group text-left">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-teal-400 flex-shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white/85">{label}</p>
                <p className="text-xs text-white/40 mt-0.5">{desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Log out */}
      <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 hover:from-red-500/15 hover:to-orange-500/15 text-red-400 font-medium transition-all flex items-center justify-center gap-2">
        <LogOut className="w-4 h-4" /> Log Out
      </button>
    </main>
  );
}
