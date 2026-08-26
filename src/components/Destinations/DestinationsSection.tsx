import React, { useState } from 'react';
import { destinationsData } from '../../data/destinationsData';
import { Destination } from '../../types';
import { AIIcon } from '../AIIcon';
import { 
  MapPin, 
  Calendar, 
  IndianRupee, 
  ArrowRight, 
  Search,
  Heart,
  Star,
  Flame
} from 'lucide-react';

/**
 * Formats season / month range for cards with full month names (e.g. "October to April", "April to October").
 * Strips secondary clauses, parenthetical notes like "(Flowers & Lush Green)", and descriptive text.
 */
const formatSeasonBadgeFull = (bestTimeStr: string): string => {
  if (!bestTimeStr) return '';
  const primary = bestTimeStr.split('|')[0].trim();
  const clean = primary.replace(/\(.*?\)/g, '').trim();
  return clean;
};

/**
 * Formats destination name for display.
 */
const formatDestinationName = (name: string): string => {
  if (!name) return '';
  return name.trim();
};

interface DestinationsSectionProps {
  onSelectDestination: (slug: string) => void;
  onPlanDestinationWithAI: (destinationName: string) => void;
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  onSelectDestination,
  onPlanDestinationWithAI
}) => {
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistedSlugs, setWishlistedSlugs] = useState<Record<string, boolean>>({});

  const toggleWishlist = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlistedSlugs(prev => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  const states = ['All', 'Jammu & Kashmir', 'Goa', 'Kerala', 'Rajasthan', 'Himachal Pradesh', 'Andaman & Nicobar', 'Meghalaya'];

  const filteredDestinations = destinationsData.filter((dest) => {
    const matchesState = selectedState === 'All' || dest.state.toLowerCase().includes(selectedState.toLowerCase());
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesSearch;
  });

  return (
    <section id="destinations-section" className="w-full py-16 lg:py-24 bg-[#FAF9F6]">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-widest mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Iconic Indian Destinations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-black tracking-tight">
              Where will your journey take you?
            </h2>
            <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-2xl font-normal">
              Handpicked domestic holiday hubs crafted with verified stays, expert local chauffeurs, and paced itineraries.
            </p>
          </div>

          {/* Search Box inside header */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destination..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black bg-white"
            />
          </div>
        </div>

        {/* State Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {states.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedState === st
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st === 'All' ? 'All Destinations' : st}
            </button>
          ))}
        </div>

        {/* Destination Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.slug}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-black/30 shadow-xs hover:shadow-2xl transition-all duration-300 ease-out flex flex-col justify-between hover:scale-[1.02] transform will-change-transform"
            >
              <div>
                {/* Image Container - Compact on mobile (h-48), full on sm+ (h-64) */}
                <div className="relative h-44 min-[400px]:h-48 sm:h-64 overflow-hidden">
                  <img
                    src={dest.cardImage || dest.heroImage}
                    alt={dest.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (dest.slug === 'uttarakhand') {
                        target.src = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop';
                      } else {
                        target.src = 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=1200&auto=format&fit=crop';
                      }
                    }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3.5 sm:left-3.5 sm:right-3.5 flex items-center justify-between gap-2 z-10">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {dest.isTrending && (
                        <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider bg-[#FF6B00] text-white shadow-md border border-orange-400/80 whitespace-nowrap leading-none shrink-0 inline-flex items-center gap-1">
                          <Flame className="w-3 h-3 text-white fill-white shrink-0" />
                          <span>Trending</span>
                        </span>
                      )}
                      <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-white/95 text-black shadow-xs whitespace-nowrap leading-none shrink-0 inline-flex items-center gap-1.5 border border-white/30">
                        <Calendar className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                        <span>{formatSeasonBadgeFull(dest.bestTime)}</span>
                      </span>
                    </div>
                    <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-white text-gray-900 border border-white/90 shadow-md whitespace-nowrap leading-none shrink-0 inline-flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                      <span className="text-black font-extrabold">{dest.rating ? dest.rating.toFixed(1) : '4.9'}</span>
                      <span className="text-[9px] font-bold text-gray-500">/5.0</span>
                    </span>
                  </div>

                  {/* Bottom Image Info & Heart Button */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3.5 sm:left-3.5 sm:right-3.5 flex items-end justify-between z-10 text-white gap-2">
                    <div className="flex-1 pr-1.5 sm:pr-2 min-w-0">
                      <h3 className="text-lg min-[380px]:text-xl sm:text-2xl font-serif font-bold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                        {formatDestinationName(dest.name)}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-300 line-clamp-1 mt-0.5">
                        {dest.tagline}
                      </p>
                    </div>

                    {/* Interactive Heart Wishlist Toggle Button */}
                    <button
                      type="button"
                      id={`destination-heart-${dest.slug}`}
                      onClick={(e) => toggleWishlist(dest.slug, e)}
                      aria-label={`Save ${dest.name} to wishlist`}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/60 hover:bg-slate-900/85 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-md cursor-pointer transition-all active:scale-90 hover:scale-105 flex-shrink-0"
                      title={wishlistedSlugs[dest.slug] ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 sm:w-5 sm:h-5 transition-colors ${
                          wishlistedSlugs[dest.slug]
                            ? 'fill-rose-500 text-rose-500'
                            : 'text-white stroke-[2]'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Card Body - Tightened vertical spacing on mobile */}
                <div className="p-3.5 sm:p-5">
                  <p className="text-xs sm:text-sm text-gray-600 leading-snug sm:leading-relaxed mb-2.5 sm:mb-4">
                    {dest.shortDescription}
                  </p>

                  {/* Highlights Tags */}
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2.5 sm:mb-4">
                    {dest.topAttractions.slice(0, 3).map((att, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-gray-100 text-gray-700 text-[10px] min-[380px]:text-[11px] font-medium"
                      >
                        {att.name}
                      </span>
                    ))}
                  </div>

                  {/* Duration & Price Row */}
                  <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-500 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-gray-700" />
                      <span className="text-[11px] sm:text-xs">{dest.idealDays}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] min-[380px]:text-[10px] uppercase tracking-wider text-gray-400 block font-bold">Est. starting price</span>
                      <span className="text-xs min-[380px]:text-sm font-extrabold text-black">
                        ₹{dest.startingPrice.toLocaleString('en-IN')} <span className="text-[9px] min-[380px]:text-[10px] font-normal text-gray-500">/ person</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3.5 pt-0 sm:p-5 sm:pt-0 grid grid-cols-2 gap-1.5 sm:gap-2">
                <button
                  id={`explore-dest-${dest.slug}`}
                  onClick={() => onSelectDestination(dest.slug)}
                  className="w-full h-9 min-[380px]:h-9.5 sm:h-10 min-h-[36px] sm:min-h-[40px] px-1 sm:px-2.5 lg:px-3 rounded-xl border border-gray-200 hover:border-black hover:bg-gray-50 text-black font-bold text-[10px] min-[380px]:text-[11px] sm:text-[11.5px] lg:text-xs uppercase tracking-tight min-[380px]:tracking-wide lg:tracking-wider transition-colors inline-flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center whitespace-nowrap select-none"
                >
                  <span>Explore Guide</span>
                  <ArrowRight className="w-3 h-3 min-[380px]:w-3.5 min-[380px]:h-3.5 shrink-0" />
                </button>

                <button
                  id={`ai-plan-dest-${dest.slug}`}
                  onClick={() => onPlanDestinationWithAI(dest.name)}
                  className="w-full h-9 min-[380px]:h-9.5 sm:h-10 min-h-[36px] sm:min-h-[40px] px-1 sm:px-2.5 lg:px-3 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-[10px] min-[380px]:text-[11px] sm:text-[11.5px] lg:text-xs uppercase tracking-tight min-[380px]:tracking-wide lg:tracking-wider transition-all inline-flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center whitespace-nowrap select-none"
                >
                  <AIIcon className="hidden lg:inline-block w-3.5 h-3.5 text-white shrink-0" />
                  <span>Custom Itinerary</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

