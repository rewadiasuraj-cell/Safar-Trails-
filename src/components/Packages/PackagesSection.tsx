import React, { useState } from 'react';
import { packagesData } from '../../data/packagesData';
import { Package, TripType } from '../../types';
import { AIIcon } from '../AIIcon';
import { 
  Clock, 
  MapPin, 
  Star, 
  IndianRupee, 
  ArrowRight, 
  Filter, 
  Check, 
  ShieldCheck,
  Building2,
  Car,
  Utensils
} from 'lucide-react';

interface PackagesSectionProps {
  onSelectPackage: (pkg: Package) => void;
  onCustomizePackageWithAI: (packageTitle: string, destination: string) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  onSelectPackage,
  onCustomizePackageWithAI
}) => {
  const [selectedDestination, setSelectedDestination] = useState<string>('All');
  const [selectedTripType, setSelectedTripType] = useState<string>('All');
  const [selectedDuration, setSelectedDuration] = useState<string>('All');

  const destinationsList = ['All', 'Kashmir', 'Goa', 'Kerala', 'Rajasthan', 'Himachal Pradesh', 'Andaman', 'Meghalaya', 'Uttarakhand'];
  const tripTypesList = ['All', 'Couple', 'Honeymoon', 'Family', 'Friends', 'Solo', 'Adventure', 'Luxury'];
  const durationsList = ['All', 'Short (3-4 Days)', 'Classic (5-7 Days)', 'Grand (8+ Days)'];

  const filteredPackages = packagesData.filter((pkg) => {
    // Destination filter
    const matchesDest = selectedDestination === 'All' || pkg.destination.toLowerCase().includes(selectedDestination.toLowerCase());
    
    // Trip type filter
    const matchesType = selectedTripType === 'All' || pkg.tripType.some(t => t.toLowerCase() === selectedTripType.toLowerCase());

    // Duration filter
    let matchesDuration = true;
    if (selectedDuration === 'Short (3-4 Days)') {
      matchesDuration = pkg.durationDays <= 4;
    } else if (selectedDuration === 'Classic (5-7 Days)') {
      matchesDuration = pkg.durationDays >= 5 && pkg.durationDays <= 7;
    } else if (selectedDuration === 'Grand (8+ Days)') {
      matchesDuration = pkg.durationDays >= 8;
    }

    return matchesDest && matchesType && matchesDuration;
  });

  return (
    <section id="packages-section" className="py-16 lg:py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-widest mb-3">
              <AIIcon className="w-3.5 h-3.5 text-black" />
              <span>Curated Holiday Itineraries</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-black tracking-tight">
              Signature Holiday Packages
            </h2>
            <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-2xl font-normal">
              Carefully timed day-by-day journeys crafted with handpicked 4.5+ star stays, private sanitized cabs, and transparent pricing.
            </p>
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-200 self-start md:self-auto">
            Showing <strong className="text-black">{filteredPackages.length}</strong> available packages
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-gray-200/80 shadow-xs mb-8 space-y-4">
          {/* Destination Pills */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
              Destination:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {destinationsList.map((dest) => (
                <button
                  key={dest}
                  onClick={() => setSelectedDestination(dest)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    selectedDestination === dest
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>

          {/* Trip Type & Duration row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-200">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                Travel Style:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {tripTypesList.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedTripType(type)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedTripType === type
                        ? 'bg-black text-white font-bold'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                Duration:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {durationsList.map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setSelectedDuration(dur)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedDuration === dur
                        ? 'bg-black text-white font-bold'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-black/30 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Hero Image */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={pkg.heroImage}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-black shadow-xs">
                      {pkg.destination}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black text-white shadow-xs">
                      {pkg.durationDays}D / {pkg.durationNights}N
                    </span>
                  </div>

                  {/* Ratings & Best for */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md font-bold text-[11px]">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{pkg.ratings}</span>
                      <span className="text-[10px] text-gray-300">({pkg.reviewCount})</span>
                    </div>
                    <span className="text-[11px] text-gray-200 line-clamp-1 max-w-[170px]">
                      {pkg.bestFor}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-serif font-bold text-black group-hover:text-gray-700 transition-colors line-clamp-2 leading-snug">
                    {pkg.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {pkg.overview}
                  </p>

                  {/* Quick Feature Specs */}
                  <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-gray-600 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-gray-500" />
                      <span className="truncate">{pkg.hotelCategory}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-gray-500" />
                      <span className="truncate">Private Cab</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-gray-500" />
                      <span className="truncate">Breakfast+Dinner</span>
                    </div>
                  </div>

                  {/* Highlights Bullet snippet */}
                  <div className="space-y-1 pt-2">
                    {pkg.highlights.slice(0, 2).map((hl, i) => (
                      <div key={i} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="text-black font-bold text-xs mt-0.5">•</span>
                        <span className="line-clamp-1">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="p-5 pt-0 border-t border-gray-100 mt-2 space-y-3">
                <div className="flex items-baseline justify-between pt-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Indicative starting price</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-black">
                        ₹{pkg.startingPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-gray-500 font-normal">/ person</span>
                    </div>
                  </div>

                  {pkg.originalPrice && (
                    <div className="text-right">
                      <span className="text-xs text-gray-400 line-through">
                        ₹{pkg.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className="w-full h-10 min-h-[40px] px-1 sm:px-2.5 lg:px-3 rounded-xl border border-gray-200 hover:border-black hover:bg-gray-50 text-black font-bold text-[10px] min-[380px]:text-[11px] sm:text-[11.5px] lg:text-xs uppercase tracking-tight min-[380px]:tracking-wide lg:tracking-wider transition-colors inline-flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center whitespace-nowrap select-none"
                  >
                    <span>View Itinerary</span>
                    <ArrowRight className="w-3 h-3 min-[380px]:w-3.5 min-[380px]:h-3.5 shrink-0" />
                  </button>

                  <button
                    onClick={() => onCustomizePackageWithAI(pkg.title, pkg.destination)}
                    className="w-full h-10 min-h-[40px] px-1 sm:px-2.5 lg:px-3 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-[10px] min-[380px]:text-[11px] sm:text-[11.5px] lg:text-xs uppercase tracking-tight min-[380px]:tracking-wide lg:tracking-wider transition-all inline-flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center whitespace-nowrap select-none"
                  >
                    <AIIcon className="hidden lg:inline-block w-3.5 h-3.5 text-white shrink-0" />
                    <span>Customize</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
