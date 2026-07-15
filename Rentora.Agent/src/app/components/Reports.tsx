import React from "react";
import { Download, FileText, BarChart3, PieChart, TrendingUp, Filter } from "lucide-react";

export function Reports() {
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8 h-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Reports & Analytics</h1>
          <p className="text-zinc-400 text-sm">Generate and export performance insights.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          <Download className="w-4 h-4" /> Export All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Financial Summary", desc: "Q3 2023 Revenue & Expenses", icon: BarChart3, color: "text-indigo-400", bg: "bg-indigo-500/10" },
          { title: "Occupancy Trends", desc: "Vacancy rates across all properties", icon: PieChart, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { title: "Maintenance Log", desc: "Ticket resolution times & costs", icon: TrendingUp, color: "text-orange-400", bg: "bg-orange-500/10" },
          { title: "Tenant Directory", desc: "Full list of active leases", icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" }
        ].map((report, i) => (
          <div key={i} className="bg-[#18181b] border border-zinc-800/80 rounded-xl p-6 flex flex-col hover:border-zinc-700 transition-colors cursor-pointer group">
            <div className={`w-12 h-12 rounded-lg ${report.bg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
              <report.icon className={`w-6 h-6 ${report.color}`} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{report.title}</h3>
            <p className="text-sm text-zinc-400 mb-6">{report.desc}</p>
            <div className="mt-auto pt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">PDF, CSV, Excel</span>
              <Download className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
