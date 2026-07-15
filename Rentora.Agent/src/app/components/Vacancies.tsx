import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Bed, 
  Bath, 
  Square,
  Sparkles,
  Award,
  Video,
  Heart,
  CalendarPlus,
  Plus
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const listings = [
  {
    id: 1,
    property: "The Skyline Residences",
    unit: "Unit 402",
    type: "2B/2B",
    price: "$2,650",
    location: "Downtown Metropolis",
    available: "Immediate",
    beds: 2,
    baths: 2,
    sqft: 1150,
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25kbyUyMGludGVyaW9yJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3ODA1NjgxMjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    sponsored: true,
    hasVideo: true,
  },
  {
    id: 2,
    property: "Riverfront Lofts",
    unit: "Unit 2B",
    type: "Studio Loft",
    price: "$1,950",
    location: "Westside Arts District",
    available: "Nov 1, 2023",
    beds: 1,
    baths: 1,
    sqft: 850,
    image: "https://images.unsplash.com/photo-1778375744848-e7757f0254e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0b3duaG91c2UlMjBleHRlcmlvcnxlbnwxfHx8fDE3ODAzNzY0NTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    sponsored: false,
    hasVideo: false,
  },
  {
    id: 3,
    property: "Oakwood Townhomes",
    unit: "Unit 14",
    type: "3B/2.5B",
    price: "$4,200",
    location: "Suburban Heights",
    available: "Dec 15, 2023",
    beds: 3,
    baths: 2.5,
    sqft: 1850,
    image: "https://images.unsplash.com/photo-1758448617677-2f8bebc56d9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yJTIwbmlnaHR8ZW58MXx8fHwxNzgwNTY4MTIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    sponsored: false,
    hasVideo: true,
  }
];

export function Vacancies() {
  const [feedMode, setFeedMode] = useState<"recommended" | "sponsored">("recommended");
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="flex h-full relative overflow-hidden">
      
      {/* Left Sidebar Filters */}
      <div className="w-72 border-r border-zinc-800/80 bg-[#09090b] p-6 overflow-y-auto custom-scrollbar hidden md:block shrink-0">
        <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider mb-6 flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filters
        </h2>
        
        <div className="space-y-6">
          {/* Location */}
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-2 block">Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="text" placeholder="Neighborhood or zip..." className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-9 pr-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:ring-1 focus:ring-indigo-500/50" />
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-zinc-400">Price Range</label>
              <span className="text-xs text-indigo-400">$1k - $5k+</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full w-full relative mb-2">
              <div className="absolute left-1/4 right-1/4 h-full bg-indigo-500 rounded-full"></div>
              <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow border border-zinc-300"></div>
              <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow border border-zinc-300"></div>
            </div>
          </div>

          {/* Rooms */}
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-2 block">Bedrooms</label>
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-md p-1">
              {['Any', '1', '2', '3+'].map((num, i) => (
                <button key={i} className={cn("flex-1 py-1 text-sm rounded", i === 1 ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200")}>
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-2 block">Availability Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="date" className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-9 pr-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:ring-1 focus:ring-indigo-500/50 [color-scheme:dark]" />
            </div>
          </div>

          {/* Amenities */}
          <div>
             <label className="text-xs font-medium text-zinc-400 mb-2 block">Must Have Amenities</label>
             <div className="space-y-2">
               {['In-unit Washer/Dryer', 'Parking', 'Gym Access', 'Pet Friendly'].map((amenity, i) => (
                 <label key={i} className="flex items-center gap-2 cursor-pointer group">
                   <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors", i === 0 ? "bg-indigo-500 border-indigo-500" : "border-zinc-700 group-hover:border-zinc-500")}>
                     {i === 0 && <Sparkles className="w-3 h-3 text-white" />}
                   </div>
                   <span className="text-sm text-zinc-300 group-hover:text-zinc-100">{amenity}</span>
                 </label>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-8 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Marketplace Operations</h1>
            <p className="text-zinc-400 text-sm">Distribute and promote vacant inventory.</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          >
            <Plus className="w-4 h-4" />
            Create Listing
          </button>
        </div>

        {/* Feed Modes */}
        <div className="flex border-b border-zinc-800 mb-6">
          <button 
            onClick={() => setFeedMode("recommended")}
            className={cn("px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors", feedMode === "recommended" ? "border-indigo-500 text-indigo-400" : "border-transparent text-zinc-400 hover:text-zinc-200")}
          >
            <Sparkles className="w-4 h-4" />
            Recommended Feed (AI)
          </button>
          <button 
             onClick={() => setFeedMode("sponsored")}
             className={cn("px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors", feedMode === "sponsored" ? "border-purple-500 text-purple-400" : "border-transparent text-zinc-400 hover:text-zinc-200")}
          >
            <Award className="w-4 h-4" />
            Sponsored Feed
          </button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {listings.map((listing) => (
             <div key={listing.id} className="bg-[#18181b] border border-zinc-800/80 rounded-xl overflow-hidden flex flex-col sm:flex-row group hover:border-zinc-700 transition-colors">
                
                {/* Image Section */}
                <div className="sm:w-64 h-56 sm:h-auto relative shrink-0 overflow-hidden bg-zinc-900">
                   <img src={listing.image} alt={listing.property} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                   {listing.sponsored && (
                     <div className="absolute top-3 left-3 bg-purple-500/90 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-lg">
                       <Award className="w-3 h-3" /> Sponsored
                     </div>
                   )}
                   {listing.hasVideo && (
                     <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
                       <Video className="w-3 h-3" /> Walkthrough
                     </div>
                   )}
                   <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-rose-500 hover:text-white transition-colors">
                     <Heart className="w-4 h-4" />
                   </button>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                   <div className="flex justify-between items-start mb-2">
                     <div>
                       <h3 className="text-xl font-bold text-white tracking-tight">{listing.price}<span className="text-sm font-normal text-zinc-500">/mo</span></h3>
                       <p className="text-sm text-zinc-300 font-medium">{listing.property} — {listing.unit}</p>
                     </div>
                   </div>
                   
                   <p className="text-xs text-zinc-500 flex items-center gap-1 mb-4">
                     <MapPin className="w-3 h-3" /> {listing.location}
                   </p>

                   <div className="flex items-center gap-4 text-sm text-zinc-300 mb-6 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50">
                     <div className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-zinc-500"/> {listing.beds} Bed</div>
                     <div className="w-px h-4 bg-zinc-700"></div>
                     <div className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-zinc-500"/> {listing.baths} Bath</div>
                     <div className="w-px h-4 bg-zinc-700"></div>
                     <div className="flex items-center gap-1.5"><Square className="w-4 h-4 text-zinc-500"/> {listing.sqft} sqft</div>
                   </div>

                   <div className="mt-auto flex flex-col gap-3">
                      <div className="flex items-center justify-between text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-md">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Available</span>
                        <span>{listing.available}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                          <CalendarPlus className="w-4 h-4" /> Book Viewing
                        </button>
                        <button className="px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2 rounded-md text-sm font-medium transition-colors border border-zinc-700">
                          Details
                        </button>
                      </div>
                   </div>
                </div>

             </div>
          ))}
        </div>
      </div>

    </div>
  );
}
