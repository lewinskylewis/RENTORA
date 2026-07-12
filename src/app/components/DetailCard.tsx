import { GlassCard } from "./GlassCard";

export interface DetailRow {
  label: string;
  value: string;
  valueClassName?: string;
}

/** Label/value summary card used by the payment, ticket and move-out confirmation screens. */
export function DetailCard({ rows }: { rows: DetailRow[] }) {
  return (
    <GlassCard className="p-6 mb-8 text-left">
      <div className="space-y-3">
        {rows.map(({ label, value, valueClassName }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-white/40">{label}</span>
            <span className={valueClassName ?? "text-white/80"}>{value}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
