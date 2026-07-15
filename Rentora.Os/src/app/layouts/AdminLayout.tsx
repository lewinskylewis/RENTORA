import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { LayoutDashboard, FileCheck2, Users, Building2, Menu, X, LogOut, ShieldCheck } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSession } from "@/app/providers/SessionProvider";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Overview", path: "/admin", end: true, icon: LayoutDashboard },
  { name: "Agent applications", path: "/admin/agent-applications", icon: FileCheck2 },
  { name: "Agents", path: "/admin/agents", icon: Users },
  { name: "Agencies", path: "/admin/agencies", icon: Building2 },
];

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { profile, signOut } = useSession();

  return (
    <div className="flex h-screen w-full bg-[#0a0a0f] text-zinc-50 font-sans overflow-hidden relative">
      {open && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setOpen(false)} />}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-800/60 bg-[#0a0a0f] flex flex-col shrink-0 transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-violet-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.4)]">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-lg">Rentora Admin</span>
          </div>
          <button onClick={() => setOpen(false)} className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all",
                  isActive ? "bg-zinc-800/80 text-white" : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200",
                )
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-zinc-800/60">
          <div className="flex items-center gap-3 w-full p-2 rounded-md">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-semibold">
              {(profile?.full_name ?? "A").slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-zinc-200 truncate">{profile?.full_name ?? "Administrator"}</p>
              <p className="text-xs text-zinc-500 truncate">Admin</p>
            </div>
            <button
              onClick={() => void signOut().then(() => navigate("/login"))}
              title="Sign out"
              className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800/50"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#0a0a0f]">
        <header className="h-16 flex items-center gap-4 px-4 sm:px-8 border-b border-zinc-800/60 shrink-0 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-10">
          <button onClick={() => setOpen(true)} className="p-2 -ml-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/50">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm text-zinc-400">Administration</span>
        </header>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
