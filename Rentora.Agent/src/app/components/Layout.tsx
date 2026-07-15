import React, { useState } from "react";
import { Outlet, NavLink } from "react-router";
import { 
  LayoutDashboard, 
  Building2, 
  Grid2X2, 
  Users, 
  KeySquare, 
  Wrench, 
  CalendarCheck, 
  CircleDollarSign, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  Command,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Properties", path: "/properties", icon: Building2 },
  { name: "Units", path: "/units", icon: Grid2X2 },
  { name: "Tenants", path: "/tenants", icon: Users },
  { name: "Vacancies", path: "/vacancies", icon: KeySquare },
  { name: "Maintenance", path: "/maintenance", icon: Wrench },
  { name: "Leads", path: "/leads", icon: CalendarCheck },
  { name: "Finance", path: "/finance", icon: CircleDollarSign },
  { name: "Reports", path: "/reports", icon: BarChart3 },
];

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-zinc-50 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-800/60 bg-[#09090b] flex flex-col shrink-0 transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-lg">Rentora</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar flex flex-col gap-1">
          <div className="text-xs font-medium text-zinc-500 px-3 mb-2 uppercase tracking-wider">Operations</div>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-zinc-800/80 text-white shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                )
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.name}
            </NavLink>
          ))}

          <div className="mt-8 mb-2 px-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">System</div>
          <NavLink
            to="/settings"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-zinc-800/80 text-white shadow-sm"
                  : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
              )
            }
          >
            <Settings className="w-4 h-4 shrink-0" />
            Settings
          </NavLink>
        </div>

        {/* User profile section */}
        <div className="p-4 border-t border-zinc-800/60 shrink-0">
          <button className="flex items-center gap-3 w-full hover:bg-zinc-800/40 p-2 rounded-md transition-colors text-left">
            <img 
              src="https://images.unsplash.com/photo-1769636929231-3cd7f853d038?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBoZWFkc2hvdCUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc4MDU2ODEyMXww&ixlib=rb-4.1.0&q=80&w=100&utm_source=figma&utm_medium=referral" 
              alt="Agent profile" 
              className="w-8 h-8 rounded-full object-cover border border-zinc-700"
            />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-zinc-200 truncate">Alex Mwangi</p>
              <p className="text-xs text-zinc-500 truncate">Lead Agent</p>
            </div>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-8 border-b border-zinc-800/60 shrink-0 bg-[#09090b]/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search properties, tenants, units..." 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full pl-9 pr-12 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Command className="w-3 h-3 text-zinc-500" />
                <span className="text-xs text-zinc-500 font-medium">K</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-zinc-400 hover:text-zinc-200 transition-colors p-1.5 rounded-full hover:bg-zinc-800/50">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#09090b]"></span>
            </button>
            <div className="h-6 w-px bg-zinc-800"></div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="hidden sm:inline">System Operational</span>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <Outlet />
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #27272a;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #3f3f46;
        }
      `}} />
    </div>
  );
}
