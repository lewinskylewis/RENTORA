import { Bell, LogIn, MessageSquare } from "lucide-react";
import { RentoraMark } from "@/app/components";
import { useTheme } from "@/app/theme";
import type { NavState } from "@/app/types";

export function Header({
  onNav,
  onOpenSidebar,
  notifCount = 2,
  guest = false,
  onAuth = () => {},
}: {
  onNav: (nav: NavState) => void;
  onOpenSidebar: () => void;
  notifCount?: number;
  guest?: boolean;
  onAuth?: () => void;
}) {
  const theme = useTheme();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-3xl border-b border-white/[0.05] shadow-2xl" style={{ backgroundColor: theme.headerBg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <button onClick={onOpenSidebar} className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300" style={{ background: `linear-gradient(135deg,${theme.logoFrom},${theme.logoTo})`, boxShadow: `0 0 20px ${theme.logoGlow}` }}>
              <RentoraMark className="w-6 h-6 drop-shadow-md" />
            </div>
            <div>
              <h1 className="text-xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                Rentora
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-teal-400/80 font-semibold">
                Home Starts Here
              </p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            {guest ? (
              <button
                onClick={onAuth}
                className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center gap-2"
                style={{ background: theme.ctaBlue, boxShadow: `0 0 20px ${theme.glow1}` }}
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNav({ page: "notifications" })}
                  className="relative w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-all duration-300 flex items-center justify-center group"
                >
                  <Bell className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                  {notifCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                  )}
                </button>
                <button
                  onClick={() => onNav({ page: "contact-agent" })}
                  className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-all duration-300 flex items-center justify-center group"
                >
                  <MessageSquare className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
