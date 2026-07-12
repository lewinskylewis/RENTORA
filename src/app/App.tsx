import { useState } from "react";
import { useNavigate } from "react-router";
import { BackgroundAura } from "@/app/components";
import { AppRoutes } from "@/app/routing/AppRoutes";
import { navStateToPath } from "@/app/routing/paths";
import { THEME_VARS, THEMES, ThemeContext } from "@/app/theme";
import type { Theme } from "@/app/theme";
import type { AuthState, NavState } from "@/app/types";

/**
 * Mock auth mode survives reloads (per tab) so refreshing a nested route like
 * /tenant/payments lands back on that page instead of bouncing to /login.
 * Replace with real session handling when backend authentication arrives.
 */
const AUTH_STORAGE_KEY = "rentora.authState";

export default function App() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<Theme>("cosmos");
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = sessionStorage.getItem(AUTH_STORAGE_KEY);
    return saved === "app" || saved === "guest" ? saved : "auth";
  });

  const changeAuthState = (next: AuthState) => {
    setAuthState(next);
    sessionStorage.setItem(AUTH_STORAGE_KEY, next);
  };

  const guest = authState === "guest";

  // Every page still expresses navigation as a NavState intent; this adapter
  // turns those intents into router URLs so history back/forward "just work".
  const handleNav = (nav: NavState) => navigate(navStateToPath(nav, guest));

  // Auth state transitions
  const enterApp = () => { changeAuthState("app"); navigate("/tenant/dashboard"); };
  const enterGuest = () => { changeAuthState("guest"); navigate("/guest"); };
  const requireAuth = () => { setSidebarOpen(false); changeAuthState("auth"); navigate("/login"); };
  const signOut = () => { setSidebarOpen(false); changeAuthState("auth"); navigate("/login"); };

  const theme = THEMES[activeTheme];

  return (
    <ThemeContext.Provider value={theme}>
      <style>{THEME_VARS}</style>
      <style>{`
        .sidebar-nav::-webkit-scrollbar { width: 2px; }
        .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.10); border-radius: 99px; }
        .sidebar-nav::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.22); }
        .sidebar-nav { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.10) transparent; }
      `}</style>

      <div data-theme={activeTheme} className="min-h-screen text-white relative overflow-x-hidden transition-colors duration-700" style={{ backgroundColor: theme.bgBase }}>
        <BackgroundAura />

        <AppRoutes
          authState={authState}
          onNav={handleNav}
          onAuthed={enterApp}
          onGuest={enterGuest}
          onRequireAuth={requireAuth}
          onSignOut={signOut}
          sidebarOpen={sidebarOpen}
          onOpenSidebar={() => setSidebarOpen(true)}
          onCloseSidebar={() => setSidebarOpen(false)}
          activeTheme={activeTheme}
          onThemeChange={setActiveTheme}
        />
      </div>
    </ThemeContext.Provider>
  );
}
