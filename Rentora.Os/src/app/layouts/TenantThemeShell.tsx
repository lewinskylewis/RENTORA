import { BackgroundAura } from "@/app/components";
import { THEME_VARS, THEMES, ThemeContext } from "@/app/theme";
import type { Theme } from "@/app/theme";

const SCROLLBAR_CSS = `
  .sidebar-nav::-webkit-scrollbar { width: 2px; }
  .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
  .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.10); border-radius: 99px; }
  .sidebar-nav::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.22); }
  .sidebar-nav { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.10) transparent; }
`;

/**
 * Wraps the tenant / guest / auth experience in Rentora OS's dynamic theme
 * system (cosmos / aurora / midnight). Crucially this shell — and its
 * `data-theme` color remapping — does NOT wrap the /agent or /admin branches, so
 * the Agent Dashboard's fixed zinc/indigo palette is never recolored.
 */
export function TenantThemeShell({ activeTheme, children }: { activeTheme: Theme; children: React.ReactNode }) {
  const theme = THEMES[activeTheme];
  return (
    <ThemeContext.Provider value={theme}>
      <style>{THEME_VARS}</style>
      <style>{SCROLLBAR_CSS}</style>
      <div
        data-theme={activeTheme}
        className="min-h-screen text-white relative overflow-x-hidden transition-colors duration-700"
        style={{ backgroundColor: theme.bgBase }}
      >
        <BackgroundAura />
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
