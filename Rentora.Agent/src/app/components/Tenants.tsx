import React from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Plus,
  Mail,
  Phone,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const tenantsData = [
  { id: "T-1042", name: "Sarah Jenkins", property: "The Skyline Residences", unit: "114", leaseStart: "Jan 1, 2023", leaseEnd: "Dec 31, 2023", status: "Active", rentStatus: "Paid", phone: "(555) 123-4567", email: "sarah.j@example.com" },
  { id: "T-1043", name: "Marcus Johnson", property: "The Skyline Residences", unit: "101", leaseStart: "Mar 15, 2023", leaseEnd: "Mar 14, 2024", status: "Active", rentStatus: "Paid", phone: "(555) 987-6543", email: "mjohnson@example.com" },
  { id: "T-1044", name: "David Chen", property: "Riverfront Lofts", unit: "201", leaseStart: "Nov 1, 2023", leaseEnd: "Oct 31, 2024", status: "Pending", rentStatus: "Deposit", phone: "(555) 456-7890", email: "dchen.design@example.com" },
  { id: "T-1045", name: "Emma Wilson", property: "Riverfront Lofts", unit: "202", leaseStart: "Jul 1, 2022", leaseEnd: "Jun 30, 2024", status: "Active", rentStatus: "Overdue", phone: "(555) 234-5678", email: "emma.w.88@example.com" },
  { id: "T-1046", name: "The Martinez Family", property: "Oakwood Townhomes", unit: "301", leaseStart: "Sep 1, 2021", leaseEnd: "Aug 31, 2024", status: "Active", rentStatus: "Paid", phone: "(555) 345-6789", email: "martinez.fam@example.com" },
  { id: "T-1047", name: "Alex Rodriguez", property: "The Skyline Residences", unit: "405", leaseStart: "Feb 1, 2023", leaseEnd: "Jan 31, 2024", status: "Notice Given", rentStatus: "Paid", phone: "(555) 876-5432", email: "arod.dev@example.com" },
  { id: "T-1048", name: "Jessica Kim", property: "Oakwood Townhomes", unit: "12", leaseStart: "May 1, 2023", leaseEnd: "Apr 30, 2024", status: "Active", rentStatus: "Paid", phone: "(555) 765-4321", email: "jkim.art@example.com" },
];

export function Tenants() {
  return (
    <div className="flex h-full relative overflow-hidden flex-col p-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Tenant Directory</h1>
          <p className="text-zinc-400 text-sm">Comprehensive database of all active and past residents.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search tenants..." 
              className="bg-zinc-900 border border-zinc-800 rounded-md pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>
          <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Add Tenant
          </button>
        </div>
      </div>

      <div className="bg-[#18181b] border border-zinc-800/80 rounded-xl overflow-hidden flex-1 flex flex-col shadow-sm">
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Tenant</th>
                <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Contact</th>
                <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Property / Unit</th>
                <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Rent Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Lease Dates</th>
                <th className="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {tenantsData.map((tenant) => (
                <tr 
                  key={tenant.id} 
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/40 transition-colors group"
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                        {tenant.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{tenant.name}</p>
                        <p className="text-xs text-zinc-500">{tenant.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-indigo-400 cursor-pointer transition-colors"><Mail className="w-3 h-3"/> {tenant.email}</span>
                      <span className="flex items-center gap-1.5 text-xs text-zinc-400"><Phone className="w-3 h-3"/> {tenant.phone}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <p className="text-sm text-zinc-200">{tenant.property}</p>
                    <p className="text-xs text-zinc-500">Unit {tenant.unit}</p>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                      tenant.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      tenant.status === "Notice Given" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                      "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    )}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                     {tenant.rentStatus === "Paid" ? (
                       <span className="flex items-center gap-1.5 text-sm text-emerald-400"><CheckCircle2 className="w-4 h-4"/> Paid</span>
                     ) : tenant.rentStatus === "Overdue" ? (
                       <span className="flex items-center gap-1.5 text-sm text-rose-400"><AlertCircle className="w-4 h-4"/> Overdue</span>
                     ) : (
                       <span className="flex items-center gap-1.5 text-sm text-blue-400"><AlertCircle className="w-4 h-4"/> {tenant.rentStatus}</span>
                     )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <p className="text-sm text-zinc-300">{tenant.leaseStart} -</p>
                    <p className="text-sm text-zinc-400">{tenant.leaseEnd}</p>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button className="text-zinc-500 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-zinc-800 flex items-center justify-between text-sm text-zinc-500 bg-zinc-900/30">
          <span>Showing {tenantsData.length} tenants</span>
          <div className="flex gap-2">
            <button className="px-2 py-1 hover:text-zinc-300 disabled:opacity-50">Previous</button>
            <button className="px-2 py-1 hover:text-zinc-300 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
