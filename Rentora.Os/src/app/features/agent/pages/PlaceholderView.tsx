import { Hammer } from "lucide-react";

export function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="flex-1 h-full w-full flex flex-col items-center justify-center p-8 text-zinc-400">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 flex flex-col items-center max-w-md text-center">
        <div className="h-16 w-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 border border-zinc-700/50">
          <Hammer className="w-8 h-8 text-zinc-500" />
        </div>
        <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight mb-2">
          {title} Module
        </h2>
        <p className="text-sm text-zinc-500">
          This module is currently under construction in the RentFlow OS preview.
          Operational systems are being wired up.
        </p>
      </div>
    </div>
  );
}
