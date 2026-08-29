import React, { useMemo, useState } from 'react';
import { MapPin, Search, ArrowRight } from 'lucide-react';
import { useSanityQuery } from '../../lib/sanity/useSanityQuery';
import { urlFor } from '../../lib/sanity/image';
import { DESTINATIONS_QUERY } from '../../lib/sanity/queries';
import { SanityDestination } from '../../lib/sanity/types';
import { SanityLoadingState, SanityErrorState, SanityEmptyState } from './SanityStateViews';

interface DestinationsPageProps {
  onSelectDestination: (slug: string) => void;
  onPlanDestinationWithAI: (destinationName: string) => void;
  onOpenQuoteModal?: (summary?: string, destinationName?: string) => void;
}

export const DestinationsPage: React.FC<DestinationsPageProps> = ({
  onSelectDestination,
  onPlanDestinationWithAI,
  onOpenQuoteModal,
}) => {
  const { data, loading, error } = useSanityQuery<SanityDestination[]>(DESTINATIONS_QUERY);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDestinations = useMemo(() => {
    const destinations = data || [];
    if (!searchQuery.trim()) return destinations;
    const q = searchQuery.toLowerCase();
    return destinations.filter(
      (d) => d.title.toLowerCase().includes(q) || (d.description || '').toLowerCase().includes(q)
    );
  }, [data, searchQuery]);

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
              Handpicked domestic holiday hubs, managed from our Sanity Studio.
            </p>
          </div>

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

        {loading && <SanityLoadingState label="Loading destinations…" />}
        {!loading && error && <SanityErrorState message={error} />}
        {!loading && !error && filteredDestinations.length === 0 && (
          <SanityEmptyState
            title="No destinations yet"
            description="Add a Destination document in the Sanity Studio and it will show up here automatically."
          />
        )}

        {!loading && !error && filteredDestinations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {filteredDestinations.map((dest) => (
              <div
                key={dest._id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-black/30 shadow-xs hover:shadow-2xl transition-all duration-300 ease-out flex flex-col justify-between"
              >
                <button
                  type="button"
                  onClick={() => onSelectDestination(dest.slug)}
                  className="block text-left cursor-pointer"
                >
                  <div className="relative h-48 sm:h-64 overflow-hidden bg-gray-100">
                    {dest.heroImage && (
                      <img
                        src={urlFor(dest.heroImage).width(800).height(600).fit('crop').url()}
                        alt={dest.heroImage.alt || dest.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <h3 className="absolute bottom-3.5 left-3.5 right-3.5 text-2xl font-serif font-bold tracking-tight text-white drop-shadow-sm">
                      {dest.title}
                    </h3>
                  </div>

                  <div className="p-5">
                    {dest.description && (
                      <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {dest.description}
                      </p>
                    )}
                    {dest.highlights && dest.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {dest.highlights.slice(0, 3).map((h, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-[11px] font-medium"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>

                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectDestination(dest.slug)}
                    className="w-full h-9.5 px-2 rounded-xl border border-gray-200 hover:border-black hover:bg-gray-50 text-black font-bold text-[11px] uppercase tracking-wide transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      onOpenQuoteModal
                        ? onOpenQuoteModal(`I'd like a custom quote for ${dest.title}.`, dest.title)
                        : onPlanDestinationWithAI(dest.title)
                    }
                    className="w-full h-9.5 px-2 rounded-xl bg-[#FF6B00] hover:bg-[#E55F00] text-white font-bold text-[11px] uppercase tracking-wide transition-all cursor-pointer"
                  >
                    Get a Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
