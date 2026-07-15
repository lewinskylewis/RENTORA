import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Plus,
  MoreHorizontal,
  X,
  Camera,
  History,
  Wrench,
  CheckCircle2
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const unitsData = [
  { id: "U-101", property: "The Skyline Residences", status: "Occupied", tenant: "Marcus Johnson", rent: "$2,400", lastPayment: "Oct 1, 2023", issues: 0, type: "2B/2B", sqft: 1100 },
  { id: "U-102", property: "The Skyline Residences", status: "Vacant", tenant: "--", rent: "$2,100", lastPayment: "--", issues: 1, type: "1B/1B", sqft: 850 },
  { id: "U-103", property: "The Skyline Residences", status: "Occupied", tenant: "Sarah Jenkins", rent: "$2,400", lastPayment: "Sep 28, 2023", issues: 2, type: "2B/2B", sqft: 1100 },
  { id: "U-201", property: "Riverfront Lofts", status: "Reserved", tenant: "David Chen", rent: "$3,200", lastPayment: "Deposit Paid", issues: 0, type: "Studio Loft", sqft: 950 },
  { id: "U-202", property: "Riverfront Lofts", status: "Occupied", tenant: "Emma Wilson", rent: "$3,500", lastPayment: "Oct 2, 2023", issues: 0, type: "1B/1B Loft", sqft: 1200 },
  { id: "U-301", property: "Oakwood Townhomes", status: "Occupied", tenant: "The Martinez Family", rent: "$4,100", lastPayment: "Oct 1, 2023", issues: 1, type: "3B/2.5B", sqft: 1800 },
];

export function Units() {
  const [selectedUnit, setSelectedUnit] = useState<typeof unitsData[0] | null>(null);

  return (
    <div className="flex h-full relative overflow-hidden">
      {/* Main Table Area */}
      <div className={cn("flex-1 flex flex-col p-8 transition-all duration-300 overflow-hidden", selectedUnit ? "pr-[400px]" : "")}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Units Database</h1>
            <p className="text-zinc-400 text-sm">Structured overview of all managed units.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search units..." 
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
              Add Unit
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-[#18181b] border border-zinc-800/80 rounded-xl overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto custom-scrollbar flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Unit ID</th>
                  <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Property Name</th>
                  <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Tenant Name</th>
                  <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Rent Amount</th>
                  <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Last Payment</th>
                  <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap text-center">Issues</th>
                  <th className="py-3 px-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {unitsData.map((unit) => (
                  <tr 
                    key={unit.id} 
                    onClick={() => setSelectedUnit(unit)}
                    className={cn(
                      "border-b border-zinc-800/50 hover:bg-zinc-800/40 cursor-pointer transition-colors group",
                      selectedUnit?.id === unit.id ? "bg-zinc-800/60" : ""
                    )}
                  >
                    <td className="py-3 px-4 text-sm font-medium text-white whitespace-nowrap">{unit.id}</td>
                    <td className="py-3 px-4 text-sm text-zinc-300 whitespace-nowrap">{unit.property}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                        unit.status === "Occupied" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        unit.status === "Vacant" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                        "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      )}>
                        {unit.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-zinc-300 whitespace-nowrap">{unit.tenant}</td>
                    <td className="py-3 px-4 text-sm font-medium text-zinc-100 whitespace-nowrap">{unit.rent}</td>
                    <td className="py-3 px-4 text-sm text-zinc-400 whitespace-nowrap">{unit.lastPayment}</td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {unit.issues > 0 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold">
                          {unit.issues}
                        </span>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
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
            <span>Showing {unitsData.length} units</span>
            <div className="flex gap-2">
              <button className="px-2 py-1 hover:text-zinc-300 disabled:opacity-50">Previous</button>
              <button className="px-2 py-1 hover:text-zinc-300 disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Detail Panel */}
      <div className={cn(
        "absolute top-0 right-0 h-full w-[400px] bg-[#18181b] border-l border-zinc-800 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col z-20",
        selectedUnit ? "translate-x-0" : "translate-x-full"
      )}>
        {selectedUnit && (
          <>
            <div className="p-6 border-b border-zinc-800 flex items-start justify-between bg-zinc-900/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-white">{selectedUnit.id}</h2>
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                    selectedUnit.status === "Occupied" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    selectedUnit.status === "Vacant" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                    "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  )}>
                    {selectedUnit.status}
                  </span>
                </div>
                <p className="text-sm text-zinc-400">{selectedUnit.property}</p>
              </div>
              <button onClick={() => setSelectedUnit(null)} className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-8">
              {/* Unit Summary */}
              <section>
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Unit Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                    <p className="text-xs text-zinc-500 mb-1">Type</p>
                    <p className="text-sm font-medium text-zinc-200">{selectedUnit.type}</p>
                  </div>
                  <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                    <p className="text-xs text-zinc-500 mb-1">Size</p>
                    <p className="text-sm font-medium text-zinc-200">{selectedUnit.sqft} sqft</p>
                  </div>
                  <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                    <p className="text-xs text-zinc-500 mb-1">Current Rent</p>
                    <p className="text-sm font-medium text-emerald-400">{selectedUnit.rent}</p>
                  </div>
                  <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                    <p className="text-xs text-zinc-500 mb-1">Active Issues</p>
                    <p className="text-sm font-medium text-zinc-200">{selectedUnit.issues}</p>
                  </div>
                </div>
              </section>

              {/* Media Gallery (Condition) */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Condition Media</h3>
                  <button className="text-xs text-indigo-400 flex items-center gap-1 hover:text-indigo-300">
                    <Camera className="w-3 h-3" /> Add
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square bg-zinc-800 rounded-md overflow-hidden border border-zinc-700">
                    <img src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25kbyUyMGludGVyaW9yJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3ODA1NjgxMjF8MA&ixlib=rb-4.1.0&q=80&w=400" className="w-full h-full object-cover" alt="living room" />
                  </div>
                  <div className="aspect-square bg-zinc-800 rounded-md overflow-hidden border border-zinc-700 flex items-center justify-center text-zinc-500 text-xs">
                    Kitchen
                  </div>
                  <div className="aspect-square bg-zinc-800 rounded-md overflow-hidden border border-zinc-700 flex items-center justify-center text-zinc-500 text-xs">
                    Bath
                  </div>
                </div>
              </section>

              {/* Tenant History */}
              <section>
                 <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <History className="w-4 h-4" /> Tenant History
                </h3>
                <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-2.5 before:w-px before:bg-zinc-800">
                  <div className="relative z-10 flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-200 font-medium">{selectedUnit.tenant !== '--' ? selectedUnit.tenant : 'Previous Tenant'}</p>
                      <p className="text-xs text-zinc-500">Current • Started Jan 2023</p>
                    </div>
                  </div>
                  <div className="relative z-10 flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400 font-medium">Michael Chang</p>
                      <p className="text-xs text-zinc-600">Jan 2021 - Dec 2022</p>
                    </div>
                  </div>
                </div>
              </section>
              
              {/* Maintenance Timeline */}
               <section>
                 <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Wrench className="w-4 h-4" /> Maintenance Log
                </h3>
                <div className="bg-zinc-900/50 rounded-lg border border-zinc-800/50 p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-zinc-200 font-medium">HVAC Filter Replacement</p>
                      <p className="text-xs text-zinc-500">Scheduled maintenance</p>
                    </div>
                    <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">Resolved</span>
                  </div>
                  <div className="flex justify-between items-start pt-3 border-t border-zinc-800/50">
                    <div>
                      <p className="text-sm text-zinc-200 font-medium">Leaking Faucet</p>
                      <p className="text-xs text-zinc-500">Reported by tenant</p>
                    </div>
                    <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">Resolved</span>
                  </div>
                </div>
              </section>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
