import { Bath, Bed, ChevronRight, MapPin, Navigation, Search, Sparkles, Star } from "lucide-react";
import { AmenityIcon, BackButton, ImageWithFallback, PageHeader } from "@/app/components";
import { currentHome, vacantHouses } from "@/app/data/mock-data";
import { useTheme } from "@/app/theme";
import type { NavState, VacantHouse } from "@/app/types";

export function AiSuggestions({ suggestionType, onNav }: { suggestionType: "similar" | "cheaper" | "upgrade"; onNav: (nav: NavState) => void }) {
  const theme = useTheme();
  const config = {
    similar: { title: "Similar Properties", subtitle: "Based on your current home profile", accent: "blue" as const, filter: (h: VacantHouse) => h.bedrooms === 2, badge: "Match", badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    cheaper: { title: "Save More Every Month", subtitle: "Cheaper alternatives within 10km", accent: "teal" as const, filter: (h: VacantHouse) => h.price < currentHome.rentAmount, badge: "Cheaper", badgeColor: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
    upgrade: { title: "Level Up Your Living", subtitle: "Higher-rated premium apartments", accent: "purple" as const, filter: (h: VacantHouse) => (h.rating ?? 0) >= 4.8 && h.price > currentHome.rentAmount, badge: "Premium", badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  }[suggestionType];

  const filtered = vacantHouses.filter(config.filter);

  const savings = (house: VacantHouse) => currentHome.rentAmount - house.price;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <BackButton onBack={() => onNav({ page: "dashboard" })} />
      <PageHeader title={config.title} subtitle={config.subtitle} accent={config.accent} />

      {/* AI Insight Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 p-5 mb-8 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-blue-500/20">
          <Sparkles className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white/90 mb-1">AI Analysis</p>
          <p className="text-xs text-white/50 leading-relaxed">
            {suggestionType === "similar" && "Based on your 2-bedroom preference, payment history, and location in Nairobi, we found 3 apartments that match your living style."}
            {suggestionType === "cheaper" && `You're currently spending Kes ${currentHome.rentAmount.toLocaleString()}/month. These alternatives could save you up to Kes ${(currentHome.rentAmount - Math.min(...filtered.map((h) => h.price))).toLocaleString()}/month without compromising quality.`}
            {suggestionType === "upgrade" && "Given your excellent tenant score of 850, you qualify for premium properties. These high-rated apartments offer significantly better amenities and living standards."}
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No properties found matching this criteria.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((house) => (
            <div key={house.id} className="group rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.12] transition-all duration-300 overflow-hidden flex flex-col sm:flex-row">
              <div className="relative h-48 sm:h-auto sm:w-48 flex-shrink-0 overflow-hidden">
                <ImageWithFallback src={house.image} alt={house.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, transparent, ${theme.pageFade}99)` }} />
                {house.rating && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 backdrop-blur-md text-xs">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {house.rating}
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{house.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${config.badgeColor}`}>{config.badge}</span>
                      </div>
                      <p className="text-sm text-white/50 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-purple-400" />{house.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-light text-transparent bg-clip-text" style={{ backgroundImage: theme.priceGrad }}>
                        Kes {house.price.toLocaleString()}
                      </div>
                      {suggestionType === "cheaper" && savings(house) > 0 && (
                        <p className="text-xs text-teal-400 mt-0.5">Save Kes {savings(house).toLocaleString()}/mo</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/50 mb-4">
                    <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5 text-blue-400" />{house.bedrooms} bed</span>
                    <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-teal-400" />{house.bathrooms} bath</span>
                    <span className="flex items-center gap-1"><Navigation className="w-3.5 h-3.5 text-purple-400" />{house.distance}</span>
                  </div>
                  <div className="flex gap-2">
                    {house.amenities.slice(0, 4).map((a) => (
                      <div key={a} className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.04] text-white/50">
                        <AmenityIcon amenity={a} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.05] mt-4">
                  <span className="text-xs text-white/30">{house.availability}</span>
                  <button
                    onClick={() => onNav({ page: "house-detail", houseId: house.id })}
                    className="px-5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] hover:border-teal-500/40 text-white text-sm font-medium transition-all flex items-center gap-1.5 group/btn"
                  >
                    View Details <ChevronRight className="w-4 h-4 text-teal-400 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
