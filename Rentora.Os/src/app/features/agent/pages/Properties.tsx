import { 
  Building2, 
  MapPin, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  MoreVertical,
  Filter,
  Plus
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const propertiesData = [
  {
    id: 1,
    name: "The Skyline Residences",
    location: "Downtown Metropolis",
    image: "https://images.unsplash.com/photo-1758448617677-2f8bebc56d9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yJTIwbmlnaHR8ZW58MXx8fHwxNzgwNTY4MTIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    units: 120,
    occupancy: 96,
    revenue: "$245,000",
    issues: 3,
    status: "healthy"
  },
  {
    id: 2,
    name: "Riverfront Lofts",
    location: "Westside Arts District",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25kbyUyMGludGVyaW9yJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3ODA1NjgxMjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    units: 85,
    occupancy: 88,
    revenue: "$180,500",
    issues: 8,
    status: "warning"
  },
  {
    id: 3,
    name: "Oakwood Townhomes",
    location: "Suburban Heights",
    image: "https://images.unsplash.com/photo-1778375744848-e7757f0254e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0b3duaG91c2UlMjBleHRlcmlvcnxlbnwxfHx8fDE3ODAzNzY0NTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    units: 43,
    occupancy: 100,
    revenue: "$59,700",
    issues: 1,
    status: "excellent"
  }
];

export function Properties() {

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Properties</h1>
          <p className="text-zinc-400 text-sm">Manage your buildings and structural assets.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {propertiesData.map((property) => (
          <div key={property.id} className="bg-[#18181b] border border-zinc-800/80 rounded-xl overflow-hidden flex flex-col group hover:border-zinc-700 transition-colors">
            {/* Image Header */}
            <div className="h-48 relative overflow-hidden">
              <img 
                src={property.image} 
                alt={property.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] to-transparent"></div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-bold text-white tracking-tight">{property.name}</h3>
                <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-medium mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {property.location}
                </div>
              </div>
            </div>

            {/* Content Stats */}
            <div className="p-5 flex-1 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> Units
                  </span>
                  <span className="text-lg font-semibold text-zinc-100">{property.units}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Occupancy
                  </span>
                  <span className="text-lg font-semibold text-zinc-100 flex items-baseline gap-1">
                    {property.occupancy}%
                  </span>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-1">
                    <div className={cn("h-1.5 rounded-full", property.occupancy > 90 ? "bg-emerald-500" : property.occupancy > 80 ? "bg-indigo-500" : "bg-orange-500")} style={{ width: `${property.occupancy}%` }}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" /> Est. Rev
                  </span>
                  <span className="text-lg font-semibold text-emerald-400">{property.revenue}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Issues
                  </span>
                  <span className={cn("text-lg font-semibold", property.issues > 5 ? "text-rose-400" : property.issues > 0 ? "text-orange-400" : "text-zinc-100")}>
                    {property.issues} active
                  </span>
                </div>
              </div>

              {/* Fake Tabs for UI representation */}
              <div className="mt-auto pt-4 border-t border-zinc-800/80">
                <div className="flex justify-between items-center text-xs font-medium text-zinc-400">
                  <button className="hover:text-white transition-colors">Overview</button>
                  <button className="hover:text-white transition-colors">Units</button>
                  <button className="hover:text-white transition-colors">Tenants</button>
                  <button className="hover:text-white transition-colors">Reports</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
