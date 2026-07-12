import { useTheme } from "@/app/theme";

export function PageHeader({ title, subtitle, accent = "blue" }: { title: string; subtitle?: string; accent?: string }) {
  const theme = useTheme();
  const bar = accent === "teal" ? theme.bar2 : accent === "purple" || accent === "indigo" ? theme.bar3 : theme.bar1;
  const glow = accent === "teal" ? theme.glow2 : accent === "purple" || accent === "indigo" ? theme.glow3 : theme.glow1;
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: bar, boxShadow: `0 0 15px ${glow}` }} />
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-white/50 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
