import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import type { Theme } from "@/app/theme";
import type { NavState } from "@/app/types";

/** Chrome shared by every signed-in / guest page: slide-out sidebar + sticky header. */
export function AppLayout({
  children,
  sidebarOpen,
  onOpenSidebar,
  onCloseSidebar,
  onNav,
  activeTheme,
  onThemeChange,
  guest,
  onAuth,
  onSignOut,
}: {
  children: React.ReactNode;
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
  onNav: (nav: NavState) => void;
  activeTheme: Theme;
  onThemeChange: (t: Theme) => void;
  guest: boolean;
  onAuth: () => void;
  onSignOut: () => void;
}) {
  return (
    <>
      <Sidebar
        open={sidebarOpen}
        onClose={onCloseSidebar}
        onNav={onNav}
        activeTheme={activeTheme}
        onThemeChange={onThemeChange}
        guest={guest}
        onAuth={onAuth}
        onSignOut={onSignOut}
      />

      <div className="relative z-10">
        <Header onNav={onNav} onOpenSidebar={onOpenSidebar} guest={guest} onAuth={onAuth} />
        {children}
      </div>
    </>
  );
}
