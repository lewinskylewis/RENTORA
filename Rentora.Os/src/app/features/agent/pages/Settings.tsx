import { useState } from "react";
import { User, Bell, Shield, Key, Building2, CreditCard, Palette } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "company", label: "Company", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "api", label: "API Keys", icon: Key },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col gap-8 h-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Settings</h1>
        <p className="text-zinc-400 text-sm">Manage your account and platform preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 flex flex-col gap-1 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left",
                activeTab === tab.id 
                  ? "bg-zinc-800 text-white shadow-sm" 
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              )}
            >
              <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-indigo-400" : "text-zinc-500")} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#18181b] border border-zinc-800/80 rounded-xl p-8">
          {activeTab === "profile" && (
            <div className="max-w-xl">
              <h2 className="text-lg font-semibold text-white mb-6">Personal Information</h2>
              
              <div className="flex items-center gap-6 mb-8">
                <img 
                  src="https://images.unsplash.com/photo-1769636929231-3cd7f853d038?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBoZWFkc2hvdCUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc4MDU2ODEyMXww&ixlib=rb-4.1.0&q=80&w=200" 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-zinc-800"
                />
                <div className="flex gap-3">
                  <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors border border-zinc-700">
                    Change Avatar
                  </button>
                  <button className="bg-transparent hover:bg-rose-500/10 text-rose-400 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Remove
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-medium text-zinc-400 mb-2 block">First Name</label>
                    <input type="text" defaultValue="Alex" className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-400 mb-2 block">Last Name</label>
                    <input type="text" defaultValue="Mercer" className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-2 block">Email Address</label>
                  <input type="email" defaultValue="alex.mercer@rentflow.os" className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-2 block">Role</label>
                  <input type="text" defaultValue="Lead Agent" disabled className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-md px-3 py-2 text-sm text-zinc-500 cursor-not-allowed" />
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-800/80">
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "profile" && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                <Palette className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-lg font-medium text-zinc-200 mb-1">Configuration View</h3>
              <p className="text-sm text-zinc-500 max-w-sm">The {activeTab} settings panel is currently available via the command line interface.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
