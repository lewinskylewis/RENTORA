import { 
  CircleDollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download,
  Filter,
  CreditCard,
  Building,
  Wallet
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const revenueData = [
  { name: 'Jan', revenue: 42000, expenses: 12000 },
  { name: 'Feb', revenue: 45000, expenses: 14000 },
  { name: 'Mar', revenue: 48000, expenses: 13000 },
  { name: 'Apr', revenue: 47000, expenses: 18000 },
  { name: 'May', revenue: 52000, expenses: 15000 },
  { name: 'Jun', revenue: 58000, expenses: 14000 },
  { name: 'Jul', revenue: 61000, expenses: 16000 },
];

const recentTransactions = [
  { id: "TX-9012", tenant: "Sarah Jenkins", unit: "Unit 114", amount: "+$2,400", date: "Today, 10:23 AM", status: "Completed", type: "Rent" },
  { id: "TX-9013", tenant: "Marcus Johnson", unit: "Unit 101", amount: "+$2,100", date: "Yesterday", status: "Completed", type: "Rent" },
  { id: "TX-9014", tenant: "Pro HVAC Services", unit: "Multiple", amount: "-$850", date: "Oct 24", status: "Completed", type: "Maintenance" },
  { id: "TX-9015", tenant: "Emma Wilson", unit: "Unit 202", amount: "+$3,500", date: "Oct 23", status: "Pending", type: "Rent" },
  { id: "TX-9016", tenant: "City Water Dept", unit: "Skyline Res", amount: "-$1,240", date: "Oct 22", status: "Completed", type: "Utility" },
];

export function Finance() {
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Financial Overview</h1>
          <p className="text-zinc-400 text-sm">Track revenue, expenses, and cash flow in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Filter className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#18181b] border border-zinc-800/80 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Wallet className="w-24 h-24 text-indigo-500" />
          </div>
          <div className="relative z-10">
            <p className="text-zinc-400 text-sm font-medium mb-1">Net Revenue (MTD)</p>
            <h3 className="text-3xl font-bold text-white tracking-tight mb-4">$52,480.00</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-medium">
                <ArrowUpRight className="w-3 h-3 mr-1" /> 12.5%
              </span>
              <span className="text-zinc-500">vs last month</span>
            </div>
          </div>
        </div>

        <div className="bg-[#18181b] border border-zinc-800/80 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <CreditCard className="w-24 h-24 text-rose-500" />
          </div>
          <div className="relative z-10">
            <p className="text-zinc-400 text-sm font-medium mb-1">Operating Expenses</p>
            <h3 className="text-3xl font-bold text-white tracking-tight mb-4">$14,230.50</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded font-medium">
                <ArrowUpRight className="w-3 h-3 mr-1" /> 4.2%
              </span>
              <span className="text-zinc-500">vs last month</span>
            </div>
          </div>
        </div>

        <div className="bg-[#18181b] border border-zinc-800/80 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Building className="w-24 h-24 text-blue-500" />
          </div>
          <div className="relative z-10">
            <p className="text-zinc-400 text-sm font-medium mb-1">Outstanding Rent</p>
            <h3 className="text-3xl font-bold text-white tracking-tight mb-4">$8,600.00</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-medium">
                <ArrowDownRight className="w-3 h-3 mr-1" /> -2.1%
              </span>
              <span className="text-zinc-500">vs last month</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[#18181b] border border-zinc-800/80 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Cash Flow Overview
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1" key="colorRev">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} key="colorRev-start" />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} key="colorRev-end" />
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1" key="colorExp">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} key="colorExp-start" />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} key="colorExp-end" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#e4e4e7' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Area key="areaRev" type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area key="areaExp" type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-[#18181b] border border-zinc-800/80 rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">
              Recent Transactions
            </h2>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View all</button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-4">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    tx.amount.startsWith('+') ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                  )}>
                    <CircleDollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{tx.tenant}</p>
                    <p className="text-xs text-zinc-500">{tx.unit} • {tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-sm font-bold",
                    tx.amount.startsWith('+') ? "text-emerald-400" : "text-zinc-200"
                  )}>{tx.amount}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
