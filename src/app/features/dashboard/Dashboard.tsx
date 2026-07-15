import { useState } from "react";
import {
  ArrowRight,
  Bath,
  Bed,
  ChevronRight,
  Filter,
  Home,
  LogOut,
  MapPin,
  MessageSquare,
  Search,
  Shield,
  Star,
  TrendingUp,
  Wallet,
  Wrench,
} from "lucide-react";
import { AmenityIcon, GlassCard, ImageWithFallback, StatusIcon } from "@/app/components";
import { currentHome, maintenanceTickets, vacantHouses } from "@/app/data/mock-data";
import { useTheme } from "@/app/theme";
import type { NavState, PageType } from "@/app/types";

export function Dashboard({ onNav, guest = false, onAuth = () => {} }: { onNav: (nav: NavState) => void; guest?: boolean; onAuth?: () => void }) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<"recommended" | "sponsored">("recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([20000, 120000]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | null>(null);

  const filteredHouses = vacantHouses.filter((h) => {
    if (h.price < priceRange[0] || h.price > priceRange[1]) return false;
    if (selectedBedrooms !== null && h.bedrooms !== selectedBedrooms) return false;
    return true;
  });
  const displayedHouses = activeTab === "sponsored" ? filteredHouses.filter((h) => h.isPromoted) : filteredHouses;

  const quickActions = [
    { label: "Pay Rent", icon: Wallet, color: "indigo", gradient: "from-indigo-500/10 to-blue-500/10", page: "pay-rent" as PageType },
    { label: "Report Issue", icon: Wrench, color: "purple", gradient: "from-purple-500/10 to-fuchsia-500/10", page: "report-issue" as PageType },
    { label: "Move-out", icon: LogOut, color: "teal", gradient: "from-teal-500/10 to-emerald-500/10", page: "move-out" as PageType },
    { label: "Contact Agent", icon: MessageSquare, color: "blue", gradient: "from-blue-500/10 to-cyan-500/10", page: "contact-agent" as PageType },
  ];

  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-500/10 text-indigo-400 hover:shadow-indigo-500/10",
    purple: "bg-purple-500/10 text-purple-400 hover:shadow-purple-500/10",
    teal: "bg-teal-500/10 text-teal-400 hover:shadow-teal-500/10",
    blue: "bg-blue-500/10 text-blue-400 hover:shadow-blue-500/10",
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* GUEST WELCOME BANNER */}
      {guest && (
        <section>
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] p-8" style={{ background: `linear-gradient(135deg, ${theme.orb1}, transparent)` }}>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs font-medium text-white/60 mb-4">
                <Search className="w-3.5 h-3.5 text-teal-400" /> Guest Mode
              </div>
              <h2 className="text-3xl font-light tracking-tight mb-2">Find your next home</h2>
              <p className="text-sm text-white/50 max-w-md mb-6">
                Browse vacant homes freely. Create an account to save favourites, book viewings, pay rent, and unlock AI recommendations.
              </p>
              <button
                onClick={onAuth}
                className="px-5 py-3 rounded-2xl text-white font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                style={{ background: theme.ctaBlue, boxShadow: `0 0 30px ${theme.glow1}` }}
              >
                Sign In / Sign Up <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ACTIVE LIVING LAYER (tenant only) */}
      {!guest && (
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 rounded-full" style={{ background: theme.bar1, boxShadow: `0 0 15px ${theme.glow1}` }} />
          <h2 className="text-2xl font-semibold tracking-tight">My Space</h2>
        </div>

        <GlassCard className="p-6 hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Home className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-white/60 uppercase tracking-wider">Current Residence</span>
                </div>
                <h3 className="text-3xl font-light tracking-tight mb-2">{currentHome.unit}</h3>
                <p className="text-white/50 flex items-center gap-1.5 text-sm">
                  <MapPin className="w-4 h-4" />
                  {currentHome.location}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-transparent bg-clip-text mb-1" style={{ backgroundImage: theme.rentGrad }}>
                  Kes {currentHome.rentAmount.toLocaleString()}
                </div>
                <div className="text-xs text-white/50 bg-white/5 inline-block px-2 py-1 rounded-md">
                  Due in {currentHome.daysUntilDue} days
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickActions.map(({ label, icon: Icon, color, gradient, page }) => (
                <button
                  key={page}
                  onClick={() => onNav({ page })}
                  className={`group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.1] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${colorMap[color].split(" ").pop()}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className={`p-3 rounded-xl ${colorMap[color].split(" ").slice(0, 2).join(" ")} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium tracking-wide text-white/80 group-hover:text-white">{label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {maintenanceTickets.length > 0 && (
          <div className="rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] p-5 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium text-white/90 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                Active Maintenance
              </h3>
              <button onClick={() => onNav({ page: "report-issue" })} className="text-xs font-medium text-white/40 bg-white/5 px-2 py-1 rounded-md hover:bg-white/10 hover:text-white/70 transition-colors">
                {maintenanceTickets.length} tickets
              </button>
            </div>
            <div className="space-y-3">
              {maintenanceTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                      <StatusIcon status={ticket.status} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/90">{ticket.title}</p>
                      <p className="text-xs text-white/50 capitalize mt-0.5">{ticket.status.replace("-", " ")}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-white/40">{ticket.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      )}

      {/* DISCOVERY LAYER */}
      <section className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full" style={{ background: theme.bar2, boxShadow: `0 0 15px ${theme.glow2}` }} />
            <h2 className="text-2xl font-semibold tracking-tight">Find a Home</h2>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-colors shadow-lg"
          >
            <Filter className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>

        <div className="flex gap-2 p-1.5 rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] w-fit shadow-inner">
          {(["recommended", "sponsored"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === tab ? "text-white border border-white/10" : "text-white/50 hover:text-white hover:bg-white/5"}`}
              style={activeTab === tab ? { background: tab === "recommended" ? theme.ctaBlue : theme.ctaTeal } : {}}
            >
              <div className="flex items-center gap-2">
                {tab === "recommended" ? <TrendingUp className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </div>
            </button>
          ))}
        </div>

        {showFilters && (
          <div className="rounded-3xl bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-sm font-medium mb-4 text-white/80 block uppercase tracking-wider">Price Range</label>
                <div className="flex items-center gap-6">
                  <input
                    type="range"
                    min="20000"
                    max="120000"
                    step="1000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="flex-1 accent-teal-400"
                  />
                  <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-teal-400 min-w-[160px] text-center">
                    Kes {priceRange[0].toLocaleString()} – {priceRange[1].toLocaleString()}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-4 text-white/80 block uppercase tracking-wider">Bedrooms</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setSelectedBedrooms(selectedBedrooms === num ? null : num)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                        selectedBedrooms === num
                          ? "bg-teal-500/20 border-teal-500/50 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                          : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/10"
                      }`}
                    >
                      {num}+ Beds
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {displayedHouses.map((house) => (
            <div
              key={house.id}
              className="group relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] hover:border-white/[0.15] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
            >
              {house.isPromoted && (
                <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-lg flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-teal-400 fill-teal-400" />
                  Promoted
                </div>
              )}
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 z-10" style={{ backgroundImage: `linear-gradient(to top, ${theme.pageFade}, transparent, transparent)` }} />
                <ImageWithFallback
                  src={house.image}
                  alt={house.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {house.rating && (
                  <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">{house.rating}</span>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <h3 className="text-xl font-medium tracking-tight mb-1.5">{house.name}</h3>
                  <p className="text-sm text-white/50 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    {house.location} • <span className="text-white/30">{house.distance}</span>
                  </p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="p-1.5 rounded-md bg-white/5"><Bed className="w-4 h-4 text-blue-400" /></div>
                    {house.bedrooms} <span className="text-white/40">bed</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="p-1.5 rounded-md bg-white/5"><Bath className="w-4 h-4 text-teal-400" /></div>
                    {house.bathrooms} <span className="text-white/40">bath</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {house.amenities.slice(0, 4).map((amenity) => (
                    <div key={amenity} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-white/60 hover:bg-white/[0.08] hover:text-white transition-colors" title={amenity}>
                      <AmenityIcon amenity={amenity} />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-5 border-t border-white/[0.05]">
                  <div>
                    <div className="text-xs font-medium text-white/40 uppercase tracking-wider mb-1">Monthly</div>
                    <div className="text-2xl font-light text-transparent bg-clip-text" style={{ backgroundImage: theme.priceGrad }}>
                      Kes {house.price.toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => onNav({ page: "house-detail", houseId: house.id })}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] hover:border-teal-500/50 text-white text-sm font-medium transition-all duration-300 flex items-center gap-2 group/btn"
                  >
                    View <ChevronRight className="w-4 h-4 text-teal-400 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="text-xs font-medium text-center py-2 rounded-lg bg-white/[0.02] text-white/40 border border-white/[0.02]">
                  {house.availability}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTELLIGENCE LAYER (tenant only) */}
      {!guest && (
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 rounded-full" style={{ background: theme.bar3, boxShadow: `0 0 15px ${theme.glow3}` }} />
          <h2 className="text-2xl font-semibold tracking-tight">Reports</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payment History */}
          <GlassCard className="p-6 hover:bg-white/[0.04] transition-colors">
            <h3 className="font-medium mb-6 flex items-center gap-2 text-white/90">
              <div className="p-1.5 rounded-lg bg-teal-500/10"><Wallet className="w-4 h-4 text-teal-400" /></div>
              Payment History
            </h3>
            <div className="space-y-4">
              {["May 2026", "Apr 2026", "Mar 2026"].map((month) => (
                <div key={month} className="flex items-center justify-between text-sm p-3 rounded-xl bg-white/[0.02] border border-white/[0.02]">
                  <span className="text-white/60">{month}</span>
                  <span className="text-teal-400 font-medium px-2 py-1 rounded-md bg-teal-500/10">Paid</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-white/[0.05] text-center">
              <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                100% On-Time Record
              </p>
            </div>
          </GlassCard>

          {/* AI Suggestions */}
          <GlassCard className="p-6 hover:bg-white/[0.04] transition-colors">
            <h3 className="font-medium mb-6 flex items-center gap-2 text-white/90">
              <div className="p-1.5 rounded-lg bg-blue-500/10"><TrendingUp className="w-4 h-4 text-blue-400" /></div>
              AI Suggestions
            </h3>
            <div className="space-y-3">
              {([
                { type: "similar" as const, title: "Similar Properties", desc: "3 apartments match your style" },
                { type: "cheaper" as const, title: "Save Kes 10,000/month", desc: "5 cheaper alternatives nearby" },
                { type: "upgrade" as const, title: "Upgrade Available", desc: "2 higher-rated apartments" },
              ]).map(({ type, title, desc }) => (
                <button
                  key={type}
                  onClick={() => onNav({ page: "ai-suggestions", suggestionType: type })}
                  className="w-full text-left p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06] transition-colors group"
                >
                  <p className="text-sm font-medium mb-1 group-hover:text-blue-400 transition-colors">{title}</p>
                  <p className="text-xs text-white/40">{desc}</p>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Tenant Score */}
          <div className="rounded-3xl bg-gradient-to-br from-purple-500/10 to-blue-600/10 backdrop-blur-2xl border border-purple-500/20 p-6 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10">
              <h3 className="font-medium mb-6 flex items-center gap-2 text-white/90">
                <div className="p-1.5 rounded-lg bg-purple-500/20"><Shield className="w-4 h-4 text-purple-400" /></div>
                Tenant Score
              </h3>
              <div className="text-center mb-8 relative">
                <div className="absolute inset-0 bg-purple-500/20 blur-[30px] rounded-full" />
                <div className="relative">
                  <div className="text-6xl font-light text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-blue-400 mb-2 tracking-tighter">850</div>
                  <p className="text-sm font-medium text-purple-300/80 uppercase tracking-widest">Excellent Standing</p>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                {[
                  { label: "Payment History", value: "100%" },
                  { label: "Maintenance", value: "Low" },
                  { label: "Tenure", value: "2 years" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center p-2 rounded-lg bg-black/20">
                    <span className="text-white/60">{label}</span>
                    <span className="text-purple-400 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}
    </main>
  );
}
