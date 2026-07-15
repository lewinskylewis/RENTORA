import { Construction } from "lucide-react";

/** Neutral zinc-themed placeholder for admin sections that land in Phase 6
 *  (application review, agent suspension, agency management). The route + shell
 *  exist now so navigation and guards work end-to-end. */
export function AdminPlaceholder({ title, note }: { title: string; note: string }) {
  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      <h1 className="text-2xl font-semibold text-white">{title}</h1>
      <div className="mt-6 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-8 flex flex-col items-center text-center">
        <Construction className="w-8 h-8 text-zinc-500" />
        <p className="mt-3 text-sm text-zinc-400 max-w-sm">{note}</p>
      </div>
    </div>
  );
}
