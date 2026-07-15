import { 
  Building2, 
  Users, 
  KeySquare, 
  Wrench, 
  TrendingUp, 
  AlertCircle,
  Clock,
  ArrowRight,
  Plus,
  Home,
  UserPlus,
  Tag
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// KPI Data
const kpis = [
  { title: "Total Units", value: "248", icon: Building2, trend: "+12", trendUp: true },
  { title: "Occupancy Rate", value: "94.2%", icon: Users, trend: "+2.1%", trendUp: true },
  { title: "Vacant Units", value: "14", icon: KeySquare, trend: "-3", trendUp: true, alert: true },
  { title: "Pending Maint.", value: "8", icon: Wrench, trend: "+2", trendUp: false, alert: true },
  { title: "Monthly Est.", value: "$485.2k", icon: TrendingUp, trend: "+$12k", trendUp: true },
];

// Activity Feed Data
const activities = [
  { id: 1, type: "maintenance", title: "New tenant issue reported", desc: "HVAC failure in Unit 402, The Skyline", time: "10 mins ago", urgent: true },
  { id: 2, type: "finance", title: "Rent overdue alert", desc: "Sarah Jenkins, Unit 114 (3 days late)", time: "1 hour ago", urgent: true },
  { id: 3, type: "lead", title: "Viewing scheduled", desc: "Tomorrow at 2:00 PM for Unit 5B, Grand Ave", time: "2 hours ago", urgent: false },
  { id: 4, type: "vacancy", title: "New vacancy listed", desc: "Unit 301, Riverfront Lofts is now on market", time: "3 hours ago", urgent: false },
  { id: 5, type: "maintenance", title: "Maintenance resolved", desc: "Plumbing issue fixed in Unit 2A", time: "5 hours ago", urgent: false },
];

// Urgent Actions Data
const urgentActions = [
  { id: 1, title: "Overdue rent payment", desc: "Unit 114 - $2,400", action: "Resolve", type: "finance" },
  { id: 2, title: "Unresolved maintenance", desc: "HVAC failure - Unit 402", action: "Assign", type: "maintenance" },
  { id: 3, title: "Unlisted vacant unit", desc: "Unit 8C cleared yesterday", action: "Create Listing", type: "vacancy" },
];

export function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header section */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Command Center</h1>
          <p className="text-zinc-400 text-sm">Real-time overview of your property portfolio.</p>
        </div>
        <div className="text-sm font-medium text-zinc-500 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800">
          Last updated: Just now
        </div>
      </div>

      {/* 1. KPI OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-[#18181b] border border-zinc-800/80 rounded-xl p-5 flex flex-col shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
                <kpi.icon className={cn("w-5 h-5", kpi.alert && kpi.title === "Vacant Units" ? "text-orange-400" : kpi.alert && kpi.title === "Pending Maint." ? "text-rose-400" : "text-indigo-400")} />
              </div>
              <span className={cn("text-xs font-medium px-2 py-1 rounded-full bg-zinc-900 border", kpi.trendUp ? "text-emerald-400 border-emerald-400/20" : "text-rose-400 border-rose-400/20")}>
                {kpi.trend}
              </span>
            </div>
            <div>
              <p className="text-zinc-400 text-sm font-medium mb-1">{kpi.title}</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Feed & Actions */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* 4. QUICK ACTION GRID */}
          <div className="bg-[#18181b] border border-zinc-800/80 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "Add Property", icon: Plus },
                { name: "Add Unit", icon: Home },
                { name: "Add Tenant", icon: UserPlus },
                { name: "Create Listing", icon: Tag },
              ].map((action, i) => (
                <button key={i} className="flex flex-col items-center justify-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 hover:border-zinc-700 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                    <action.icon className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400" />
                  </div>
                  <span className="text-xs font-medium text-zinc-300 group-hover:text-zinc-100">{action.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. LIVE ACTIVITY FEED */}
          <div className="bg-[#18181b] border border-zinc-800/80 rounded-xl p-6 flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Activity Feed
              </h2>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View all</button>
            </div>
            
            <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-zinc-800">
              {activities.map((act) => (
                <div key={act.id} className="flex gap-4 relative z-10">
                  <div className={cn(
                    "w-10 h-10 rounded-full border-4 border-[#18181b] flex items-center justify-center shrink-0",
                    act.urgent ? "bg-rose-500/20 text-rose-400" : "bg-zinc-800 text-zinc-400",
                    act.type === 'maintenance' && !act.urgent ? "bg-emerald-500/20 text-emerald-400" : ""
                  )}>
                    {act.type === 'maintenance' && <Wrench className="w-4 h-4" />}
                    {act.type === 'finance' && <AlertCircle className="w-4 h-4" />}
                    {act.type === 'lead' && <Clock className="w-4 h-4" />}
                    {act.type === 'vacancy' && <KeySquare className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className={cn("text-sm font-medium", act.urgent ? "text-rose-100" : "text-zinc-200")}>{act.title}</p>
                      <span className="text-xs text-zinc-500">{act.time}</span>
                    </div>
                    <p className="text-sm text-zinc-400">{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Urgent Actions */}
        <div className="flex flex-col gap-8">
          
          {/* 3. URGENT ACTION PANEL */}
          <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500"></div>
            <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Action Required
            </h2>
            
            <div className="space-y-3">
              {urgentActions.map((action) => (
                <div key={action.id} className="bg-zinc-900/80 border border-rose-900/30 rounded-lg p-4 flex flex-col gap-3 hover:border-rose-900/60 transition-colors">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-100 mb-1">{action.title}</h3>
                    <p className="text-xs text-zinc-400">{action.desc}</p>
                  </div>
                  <button className="flex items-center justify-center gap-2 w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium rounded-md transition-colors border border-rose-500/20">
                    {action.action}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-rose-900/30 text-center">
              <button className="text-xs text-zinc-400 hover:text-zinc-300">Dismiss non-critical alerts</button>
            </div>
          </div>

          {/* Mini Chart / Status widget */}
          <div className="bg-[#18181b] border border-zinc-800/80 rounded-xl p-6 flex-1">
             <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider mb-4">
              Occupancy Target
            </h2>
            <div className="flex items-center justify-center py-6">
               <div className="relative w-32 h-32 flex items-center justify-center">
                  {/* Fake donut chart with CSS */}
                  <div className="absolute inset-0 rounded-full border-[12px] border-zinc-800"></div>
                  <div className="absolute inset-0 rounded-full border-[12px] border-indigo-500 border-r-transparent border-b-transparent -rotate-45"></div>
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-white">94%</span>
                    <span className="text-xs text-zinc-500">Current</span>
                  </div>
               </div>
            </div>
            <div className="flex justify-between text-xs text-zinc-400 px-4">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-indigo-500 rounded-full"></span> Occupied</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-zinc-800 rounded-full"></span> Vacant</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
