import { useState } from "react";
import {
  ArrowRight,
  Bath,
  Bed,
  Building,
  Calendar,
  CheckCircle2,
  Heart,
  Lock,
  MapPin,
  Share2,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { AmenityIcon, BackButton, GlassCard, ImageWithFallback } from "@/app/components";
import { vacantHouses } from "@/app/data/mock-data";
import { useTheme } from "@/app/theme";
import type { NavState } from "@/app/types";

export function HouseDetail({ houseId, onNav, guest = false, onAuth = () => {} }: { houseId: string; onNav: (nav: NavState) => void; guest?: boolean; onAuth?: () => void }) {
  const theme = useTheme();
  const house = vacantHouses.find((h) => h.id === houseId) ?? vacantHouses[0];
  const [saved, setSaved] = useState(false);
  const [schedulingView, setSchedulingView] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [viewingBooked, setViewingBooked] = useState(false);

  const times = ["9:00 AM", "10:30 AM", "12:00 PM", "2:00 PM", "3:30 PM", "5:00 PM"];

  const handleBook = () => {
    if (!selectedDate || !selectedTime) return;
    setViewingBooked(true);
    setTimeout(() => setSchedulingView(false), 2000);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <BackButton onBack={() => onNav({ page: "dashboard" })} label="Back to listings" />

      {/* Hero Image */}
      <div className="relative h-72 rounded-3xl overflow-hidden mb-6 shadow-2xl">
        <div className="absolute inset-0 z-10" style={{ backgroundImage: `linear-gradient(to top, ${theme.pageFade}, ${theme.pageFade}4d 40%, transparent)` }} />
        <ImageWithFallback src={house.image} alt={house.name} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button onClick={() => (guest ? onAuth() : setSaved(!saved))} className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
            <Heart className={`w-4 h-4 ${saved ? "text-red-400 fill-red-400" : "text-white/70"}`} />
          </button>
          <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
            <Share2 className="w-4 h-4 text-white/70" />
          </button>
        </div>
        {house.isPromoted && (
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5">
            <Star className="w-3 h-3 text-teal-400 fill-teal-400" /> Promoted
          </div>
        )}
        <div className="absolute bottom-6 left-6 z-20">
          <h2 className="text-3xl font-semibold tracking-tight mb-1">{house.name}</h2>
          <p className="text-white/70 flex items-center gap-1.5 text-sm"><MapPin className="w-4 h-4 text-purple-400" />{house.location}</p>
        </div>
      </div>

      {/* Price + Availability */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Monthly Rent</p>
          <div className="text-4xl font-light text-transparent bg-clip-text" style={{ backgroundImage: theme.priceGrad }}>
            Kes {house.price.toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-2 ${house.availability === "Available Now" ? "bg-teal-500/10 border border-teal-500/20 text-teal-400" : "bg-orange-500/10 border border-orange-500/20 text-orange-400"}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${house.availability === "Available Now" ? "bg-teal-400" : "bg-orange-400"}`} />
            {house.availability}
          </div>
          {house.rating && (
            <div className="flex items-center gap-1 justify-end">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">{house.rating}</span>
              <span className="text-xs text-white/30">/ 5.0</span>
            </div>
          )}
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Bedrooms", value: `${house.bedrooms} Bed`, icon: Bed, color: "text-blue-400" },
          { label: "Bathrooms", value: `${house.bathrooms} Bath`, icon: Bath, color: "text-teal-400" },
          { label: "Size", value: `${house.sqft} sqft`, icon: Building, color: "text-purple-400" },
          { label: "Floor", value: `${house.floor}/${house.totalFloors}`, icon: TrendingUp, color: "text-indigo-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <GlassCard key={label} className="p-4 text-center">
            <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
            <p className="text-sm font-medium text-white/90">{value}</p>
            <p className="text-xs text-white/40 mt-0.5">{label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Description */}
      <GlassCard className="p-6 mb-5">
        <h3 className="font-semibold text-white/90 mb-4">About This Property</h3>
        <p className="text-sm text-white/60 leading-relaxed">{house.description}</p>
      </GlassCard>

      {/* Amenities */}
      <GlassCard className="p-6 mb-5">
        <h3 className="font-semibold text-white/90 mb-4">Amenities</h3>
        <div className="grid grid-cols-2 gap-3">
          {house.amenities.map((amenity) => (
            <div key={amenity} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <AmenityIcon amenity={amenity} />
              </div>
              <span className="text-sm capitalize text-white/70">{amenity === "wifi" ? "High-Speed WiFi" : amenity === "gym" ? "Fitness Center" : amenity === "parking" ? "Secure Parking" : "24/7 Security"}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Costs */}
      <GlassCard className="p-6 mb-5">
        <h3 className="font-semibold text-white/90 mb-4">Cost Breakdown</h3>
        <div className="space-y-3">
          {[
            { label: "Monthly Rent", value: `Kes ${house.price.toLocaleString()}` },
            { label: "Security Deposit", value: `Kes ${house.deposit?.toLocaleString()}` },
            { label: "Agency Fee", value: "Kes 5,000 (one-time)" },
            { label: "Service Charge", value: "Kes 2,500 / mo" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-white/50">{label}</span>
              <span className="text-white/90">{value}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 border-t border-white/[0.05]">
            <span className="text-sm font-medium text-white/80">Move-In Total</span>
            <span className="text-sm font-medium text-teal-400">Kes {((house.deposit ?? 0) + house.price + 5000 + 2500).toLocaleString()}</span>
          </div>
        </div>
      </GlassCard>

      {/* Agent */}
      {house.agent && (
        <GlassCard className="p-5 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
            {house.agent.avatar}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white/90">{house.agent.name}</p>
            <p className="text-xs text-white/40">{house.agent.phone}</p>
          </div>
          <button onClick={() => (guest ? onAuth() : onNav({ page: "contact-agent" }))} className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors">
            Message
          </button>
        </GlassCard>
      )}

      {/* Schedule Viewing Modal */}
      {schedulingView && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSchedulingView(false)} />
          <div className="relative z-10 w-full max-w-md border border-white/[0.1] rounded-3xl p-6 shadow-2xl" style={{ backgroundColor: theme.modalBg }}>
            {viewingBooked ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Viewing Scheduled!</h3>
                <p className="text-white/50 text-sm">{selectedDate} at {selectedTime}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Schedule Viewing</h3>
                  <button onClick={() => setSchedulingView(false)} className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-colors">
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>
                <div className="mb-5">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider block mb-3">Preferred Date</label>
                  <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min="2026-07-05" className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50 transition-all [color-scheme:dark]" />
                </div>
                <div className="mb-6">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider block mb-3">Preferred Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {times.map((t) => (
                      <button key={t} onClick={() => setSelectedTime(t)} className={`py-2.5 rounded-xl text-xs font-medium border transition-all ${selectedTime === t ? "bg-teal-500/20 border-teal-500/50 text-teal-300" : "bg-white/[0.02] border-white/[0.05] text-white/50 hover:bg-white/[0.05]"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={handleBook} disabled={!selectedDate || !selectedTime} className="w-full py-3.5 rounded-2xl text-white font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100" style={{ background: theme.ctaTeal, boxShadow: `0 0 20px ${theme.glow2}` }}>
                  Confirm Viewing
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex gap-3 sticky bottom-6">
        <button onClick={() => (guest ? onAuth() : setSchedulingView(true))} className="flex-1 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.08] text-white font-medium transition-all flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4 text-teal-400" /> Schedule Viewing
        </button>
        <button onClick={() => guest && onAuth()} className="flex-[1.5] py-4 rounded-2xl text-white font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2" style={{ background: theme.ctaTeal, boxShadow: `0 0 30px ${theme.glow2}` }}>
          {guest ? <><Lock className="w-4 h-4" /> Sign in to Apply</> : <>Apply Now <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    </main>
  );
}
