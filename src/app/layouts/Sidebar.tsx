import { useState } from "react";
import {
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  Inbox,
  Info as InfoIcon,
  LogIn,
  LogOut,
  Moon,
  Palette,
  Star,
  Sun,
  Sunset,
  User,
  X,
} from "lucide-react";
import { RentoraMark } from "@/app/components";
import { useTheme } from "@/app/theme";
import type { Theme } from "@/app/theme";
import type { NavState } from "@/app/types";

export function Sidebar({
  open,
  onClose,
  onNav,
  activeTheme,
  onThemeChange,
  guest = false,
  onAuth = () => {},
  onSignOut = () => {},
}: {
  open: boolean;
  onClose: () => void;
  onNav: (nav: NavState) => void;
  activeTheme: Theme;
  onThemeChange: (t: Theme) => void;
  guest?: boolean;
  onAuth?: () => void;
  onSignOut?: () => void;
}) {
  const theme = useTheme();
  const [showThemes, setShowThemes] = useState(false);

  const navigate = (nav: NavState) => {
    onClose();
    onNav(nav);
  };

  const requireAuth = () => {
    onClose();
    onAuth();
  };

  const themes: { id: Theme; label: string; icon: React.ReactNode; preview: string }[] = [
    { id: "cosmos", label: "Cosmos", icon: <Moon className="w-4 h-4" />, preview: "linear-gradient(135deg,#2563eb,#7e22ce)" },
    { id: "aurora", label: "Aurora", icon: <Sunset className="w-4 h-4" />, preview: "linear-gradient(135deg,#22c55e,#15803d)" },
    { id: "midnight", label: "Midnight", icon: <Sun className="w-4 h-4" />, preview: "linear-gradient(135deg,#3b82f6,#1e3a8a)" },
  ];

  const menuItems = [
    {
      label: "Profile",
      icon: <User className="w-5 h-5" />,
      desc: guest ? "Sign in to access" : "Manage your account",
      action: () => navigate({ page: "profile" }),
      accent: "text-blue-400",
      glow: "bg-blue-500/10",
      gated: true,
    },
    {
      label: "Alerts & Notifications",
      icon: <Bell className="w-5 h-5" />,
      desc: guest ? "Sign in to access" : "Manage your alerts",
      action: () => navigate({ page: "notifications" }),
      accent: "text-purple-400",
      glow: "bg-purple-500/10",
      badge: guest ? undefined : "2",
      gated: true,
    },
    {
      label: "Inbox",
      icon: <Inbox className="w-5 h-5" />,
      desc: guest ? "Sign in to access" : "Messages from agents",
      action: () => navigate({ page: "inbox" }),
      accent: "text-teal-400",
      glow: "bg-teal-500/10",
      gated: true,
    },
    {
      label: "Rate Us",
      icon: <Star className="w-5 h-5" />,
      desc: "Share your feedback",
      action: () => navigate({ page: "rate-us" }),
      accent: "text-yellow-400",
      glow: "bg-yellow-500/10",
    },
    {
      label: "About Rentora",
      icon: <InfoIcon className="w-5 h-5" />,
      desc: "Version 2.4.1",
      action: () => navigate({ page: "about" }),
      accent: "text-cyan-400",
      glow: "bg-cyan-500/10",
    },
    {
      label: "Themes",
      icon: <Palette className="w-5 h-5" />,
      desc: "Customise your look",
      action: () => setShowThemes((p) => !p),
      accent: "text-fuchsia-400",
      glow: "bg-fuchsia-500/10",
      expandable: true,
      expanded: showThemes,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 left-0 h-full z-[70] w-[300px] sm:w-[320px] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Glass panel */}
        <div className="h-full backdrop-blur-3xl border-r border-white/[0.07] flex flex-col shadow-[4px_0_40px_rgba(0,0,0,0.6)] overflow-hidden" style={{ backgroundColor: theme.panelBg }}>

          {/* Inner neon glow */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-[-30%] left-[-20%] w-[70%] h-[50%] bg-blue-600/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[50%] bg-purple-600/10 blur-[100px] rounded-full" />
          </div>

          {/* Header */}
          <div className="relative flex items-center justify-between px-6 pt-12 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg,${theme.logoFrom},${theme.logoTo})`, boxShadow: `0 0 20px ${theme.logoGlow}` }}>
                <RentoraMark className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-white tracking-tight">Rentora</p>
                <p className="text-[9px] uppercase tracking-widest text-teal-400/80 font-semibold">Home Starts Here</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {/* User card */}
          {guest ? (
            <button
              onClick={requireAuth}
              className="relative mx-4 mb-6 p-4 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.07] hover:border-white/[0.15] transition-colors text-left w-[calc(100%-2rem)] group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/60 flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white/95 text-sm truncate">Guest</p>
                  <p className="text-xs text-white/40 truncate">Sign in to unlock your home</p>
                </div>
                <ChevronRight className="ml-auto w-4 h-4 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </div>
            </button>
          ) : (
            <div className="relative mx-4 mb-6 p-4 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.07]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-[0_0_15px_rgba(147,51,234,0.3)] flex-shrink-0">
                  LK
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white/95 text-sm truncate">Lewis Kariuki</p>
                  <p className="text-xs text-white/40 truncate">Lewiskariukiexample@gmail.com</p>
                </div>
                <div className="ml-auto flex-shrink-0">
                  <div className="px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-semibold">
                    850
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nav items */}
          <nav className="sidebar-nav relative flex-1 overflow-y-auto px-4 space-y-1">
            {menuItems.map((item) => (
              <div key={item.label}>
                <button
                  onClick={() => (guest && item.gated ? requireAuth() : item.action())}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-white/[0.05] transition-all duration-200 group text-left"
                >
                  <div className={`p-2 rounded-xl ${item.glow} ${item.accent} flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/85 group-hover:text-white transition-colors truncate">{item.label}</p>
                    <p className="text-xs text-white/30 mt-0.5 truncate">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.badge && (
                      <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(168,85,247,0.7)]">
                        {item.badge}
                      </span>
                    )}
                    {item.expandable ? (
                      <ChevronDown className={`w-4 h-4 text-white/20 transition-transform duration-300 ${item.expanded ? "rotate-180" : ""}`} />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 group-hover:translate-x-0.5 transition-all" />
                    )}
                  </div>
                </button>

                {/* Theme picker inline expansion */}
                {item.expandable && item.expanded && (
                  <div className="ml-4 mr-2 mb-2 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => { onThemeChange(t.id); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeTheme === t.id ? "bg-white/[0.08] border border-white/[0.1]" : "hover:bg-white/[0.04]"}`}
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ background: t.preview }}>
                          {t.icon}
                        </div>
                        <span className="text-sm text-white/75 flex-1 text-left">{t.label}</span>
                        {activeTheme === t.id && <Check className="w-3.5 h-3.5 text-teal-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Divider */}
          <div className="mx-6 border-t border-white/[0.05] my-2" />

          {/* Log in / Log out */}
          <div className="relative px-4 pb-10">
            {guest ? (
              <button
                onClick={requireAuth}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-white transition-all duration-200 group hover:scale-[1.01]"
                style={{ background: theme.ctaBlue, boxShadow: `0 0 20px ${theme.glow1}` }}
              >
                <div className="p-2 rounded-xl bg-white/15 group-hover:scale-110 transition-transform duration-200">
                  <LogIn className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold">Sign In / Create Account</p>
                  <p className="text-xs text-white/70 mt-0.5">Unlock the full experience</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/60 group-hover:translate-x-0.5 transition-all" />
              </button>
            ) : (
              <button
                onClick={() => { onClose(); onSignOut(); }}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-red-500/5 to-orange-500/5 border border-red-500/10 hover:from-red-500/10 hover:to-orange-500/10 hover:border-red-500/20 transition-all duration-200 group"
              >
                <div className="p-2 rounded-xl bg-red-500/10 text-red-400 group-hover:scale-110 transition-transform duration-200">
                  <LogOut className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-red-400/90 group-hover:text-red-400 transition-colors">Log Out</p>
                  <p className="text-xs text-white/25 mt-0.5">Lewiskariukiexample@gmail.com</p>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400/30 group-hover:text-red-400/60 group-hover:translate-x-0.5 transition-all" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
