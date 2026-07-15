import { useTheme } from "@/app/theme";

export function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  const theme = useTheme();
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${on ? "" : "bg-white/10"}`}
      style={on ? { background: theme.ctaTeal } : {}}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}
