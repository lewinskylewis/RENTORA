import React from "react";
import { Plus, Search, Calendar, UserPlus, Phone, Mail, MoreHorizontal } from "lucide-react";

const leadsData = [
  { id: 1, name: "Jessica Taylor", phone: "(555) 234-8912", property: "The Skyline Residences", unit: "Unit 402", status: "New Lead", date: "2 hrs ago" },
  { id: 2, name: "Michael Chang", phone: "(555) 981-2245", property: "Riverfront Lofts", unit: "Studio 2B", status: "Contacted", date: "Yesterday" },
  { id: 3, name: "Sarah Jenkins", phone: "(555) 443-1122", property: "Oakwood Townhomes", unit: "Unit 14", status: "Viewing Scheduled", date: "Oct 24, 2:00 PM" },
  { id: 4, name: "Robert Fox", phone: "(555) 887-5533", property: "The Skyline Residences", unit: "Unit 115", status: "Application Pending", date: "Oct 22" },
];

export function Leads() {
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8 h-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Leads & Viewings</h1>
          <p className="text-zinc-400 text-sm">Manage prospective tenants and property viewings.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input type="text" placeholder="Search leads..." className="bg-zinc-900 border border-zinc-800 rounded-md pl-9 pr-4 py-2 text-sm text-zinc-200 focus:ring-1 focus:ring-indigo-500/50" />
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <UserPlus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      <div className="bg-[#18181b] border border-zinc-800/80 rounded-xl overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Prospect</th>
                <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Contact</th>
                <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Target Unit</th>
                <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Timeline</th>
                <th className="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {leadsData.map((lead) => (
                <tr key={lead.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-white text-sm">{lead.name}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center gap-3 text-zinc-300">
                      <button className="hover:text-indigo-400"><Phone className="w-4 h-4"/></button>
                      <button className="hover:text-indigo-400"><Mail className="w-4 h-4"/></button>
                      <span className="text-xs text-zinc-500">{lead.phone}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-zinc-200">{lead.property}</p>
                    <p className="text-xs text-zinc-500">{lead.unit}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-blue-500/10 text-blue-400 border-blue-500/20">
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-zinc-400 flex items-center gap-1.5 mt-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {lead.date}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-zinc-500 hover:text-zinc-300"><MoreHorizontal className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
