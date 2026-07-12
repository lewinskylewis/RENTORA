import { useState } from "react";
import { ArrowRight, Chrome, Eye, EyeOff, Lock, Mail, Phone, Search, Smartphone, User } from "lucide-react";
import { GlassCard, RentoraMark, Spinner } from "@/app/components";
import { useTheme } from "@/app/theme";
import { Field } from "./Field";

export function AuthScreen({ onAuthed, onGuest }: { onAuthed: () => void; onGuest: () => void }) {
  const theme = useTheme();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid = mode === "signin" ? !!(form.email && form.password) : !!(form.name && form.email && form.phone && form.password);

  const submit = () => {
    if (!valid) return;
    setLoading(true);
    setTimeout(onAuthed, 1400);
  };

  return (
    <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `linear-gradient(135deg,${theme.logoFrom},${theme.logoTo})`, boxShadow: `0 0 30px ${theme.logoGlow}` }}>
            <RentoraMark className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Rentora</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-teal-400/80 font-semibold mt-1">Home Starts Here</p>
        </div>

        <GlassCard className="p-7">
          <h2 className="text-xl font-semibold tracking-tight text-center mb-1">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-white/50 text-center mb-6">
            {mode === "signin" ? "Sign in to manage your home" : "Join thousands of smart renters"}
          </p>

          {/* Tabs */}
          <div className="flex gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-6">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${mode === m ? "text-white" : "text-white/50 hover:text-white/80"}`}
                style={mode === m ? { background: theme.ctaBlue, boxShadow: `0 0 20px ${theme.glow1}` } : {}}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {mode === "signup" && <Field icon={User} placeholder="Full name" value={form.name} onChange={set("name")} />}
            <Field icon={Mail} type="email" placeholder="Email address" value={form.email} onChange={set("email")} />
            {mode === "signup" && <Field icon={Phone} type="tel" placeholder="Phone number" value={form.phone} onChange={set("phone")} />}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                placeholder="Password"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)] transition-all"
              />
              <button onClick={() => setShowPw((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === "signin" && (
            <div className="text-right mt-3">
              <button className="text-xs text-teal-400/80 hover:text-teal-400 transition-colors">Forgot password?</button>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={submit}
            disabled={!valid || loading}
            className="w-full mt-6 py-3.5 rounded-2xl text-white font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            style={{ background: theme.ctaBlue, boxShadow: `0 0 30px ${theme.glow1}` }}
          >
            {loading ? (
              <><Spinner /> Please wait...</>
            ) : (
              <>{mode === "signin" ? "Sign In" : "Create Account"} <ArrowRight className="w-4 h-4" /></>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-xs text-white/30">or continue with</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] text-sm font-medium text-white/80 transition-all">
              <Chrome className="w-4 h-4 text-blue-400" /> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] text-sm font-medium text-white/80 transition-all">
              <Smartphone className="w-4 h-4 text-teal-400" /> Phone
            </button>
          </div>
        </GlassCard>

        {/* Guest access */}
        <button
          onClick={onGuest}
          className="w-full mt-4 py-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15] text-sm font-medium text-white/70 hover:text-white transition-all flex items-center justify-center gap-2 group"
        >
          <Search className="w-4 h-4 text-teal-400" />
          Browse vacant homes as guest
          <ArrowRight className="w-4 h-4 text-white/40 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-center text-xs text-white/30 mt-6 leading-relaxed">
          By continuing you agree to Rentora's{" "}
          <button className="text-white/50 hover:text-white/70 underline underline-offset-2">Terms</button> and{" "}
          <button className="text-white/50 hover:text-white/70 underline underline-offset-2">Privacy Policy</button>.
        </p>
      </div>
    </main>
  );
}
