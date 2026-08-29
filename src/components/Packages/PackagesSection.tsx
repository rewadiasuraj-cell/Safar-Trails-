import React, { useState } from 'react';
import { packagesData } from '../../data/packagesData';
import { Package } from '../../types';
import {
  Building2,
  Car,
  Utensils,
  Info,
  Send
} from 'lucide-react';

interface PackagesSectionProps {
  onSelectPackage: (pkg: Package) => void;
  onCustomizePackageWithAI?: (packageTitle: string, destination: string) => void;
  onOpenQuoteModal?: (summary?: string, destinationName?: string) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  onSelectPackage,
  onCustomizePackageWithAI,
  onOpenQuoteModal
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

  const handleBookNow = (pkg: Package) => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal(`Booking Request: ${pkg.title} (${pkg.durationDays}D/${pkg.durationNights}N - ₹${pkg.startingPrice})`, pkg.destination);
    } else {
      onSelectPackage(pkg);
    }
  };

  return (
    <section id="packages-section" className="w-full py-14 lg:py-20 bg-white border-t border-gray-100">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Single Clean Section Heading - No Redundant Subheaders */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              Tour Packages
            </h1>
            <p className="mt-1.5 text-slate-500 text-sm max-w-xl font-normal">
              Expertly curated itineraries, trusted stays, private cabs, and 24/7 travel support.
            </p>
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-200 self-start sm:self-auto">
            <strong className="text-slate-900">{filteredPackages.length}</strong> Packages Available
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#FAF9F6] p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-2xs mb-8 space-y-3.5">
          {/* Destination Pills */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
              Destination:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {destinationsList.map((dest) => (
                <button
                  key={dest}
                  onClick={() => setSelectedDestination(dest)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    selectedDestination === dest
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>

          {/* Trip Type & Duration row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-200">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                Travel Style:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {tripTypesList.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedTripType(type)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedTripType === type
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-white text-slate-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                Duration:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {durationsList.map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setSelectedDuration(dur)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedDuration === dur
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-white text-slate-600 hover:bg-gray-100 border border-gray-200'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#FF6B00] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Hero Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={pkg.heroImage}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-slate-900 shadow-xs">
                      {pkg.destination}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white shadow-xs">
                      {pkg.durationDays}D / {pkg.durationNights}N
                    </span>
                  </div>

                  {/* Best for */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center text-white text-xs">
                    <span className="text-[11px] text-gray-200 line-clamp-1">
                      {pkg.bestFor}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 space-y-3">
                  <h2 className="text-lg font-serif font-bold text-slate-900 group-hover:text-[#FF6B00] transition-colors line-clamp-2 leading-snug">
                    {pkg.title}
                  </h2>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {pkg.overview}
                  </p>

                  {/* Quick Feature Specs */}
                  <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-600 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{pkg.hotelCategory}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">Private Cab</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">Meals Incl.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & 2-Button Action Row (More Info & Book Now) */}
              <div className="p-5 pt-0 border-t border-gray-100 mt-2 space-y-3">
                <div className="flex items-baseline justify-between pt-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Starting from</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-slate-900">
                        ₹{pkg.startingPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500 font-normal">/ person</span>
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

                {/* 2 CTA Buttons: More Info & Book Now */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className="w-full h-10 rounded-xl border border-gray-200 hover:border-slate-900 hover:bg-gray-50 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer text-center whitespace-nowrap"
                  >
                    <Info className="w-3.5 h-3.5 text-slate-600" />
                    <span>More Info</span>
                  </button>

                  <button
                    onClick={() => handleBookNow(pkg)}
                    className="w-full h-10 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer text-center whitespace-nowrap shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                    <span>Book Now</span>
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
