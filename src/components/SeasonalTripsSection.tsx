import React from 'react';
import { seasonalTripsData } from '../data/reviewsAndTrustData';
import { Calendar } from 'lucide-react';
import { AIIcon } from './AIIcon';

interface SeasonalTripsSectionProps {
  onSelectDestinationSlug: (slug: string) => void;
  onStartAIPlan: (promptText?: string) => void;
}

export const SeasonalTripsSection: React.FC<SeasonalTripsSectionProps> = ({
  onSelectDestinationSlug,
  onStartAIPlan
}) => {
  return (
    <section id="seasonal-trips-section" className="py-16 lg:py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-widest mb-3">
              <Calendar className="w-3.5 h-3.5 text-[#FF6B00] stroke-[2.2]" />
              <span>Timely Domestic Escapes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-black tracking-tight">
              Seasonal Travel Hub
            </h2>
            <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-2xl font-normal">
              Travel when the weather is at its magical best — from blooming tulip seasons to golden winter deserts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {seasonalTripsData.map((season) => (
            <div
              key={season.id}
              className="bg-[#FAF9F6] rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={season.image}
                    alt={season.seasonName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black text-white shadow-xs">
                    {season.badge}
                  </span>
                  <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                    <h3 className="text-lg font-serif font-bold">
                      {season.seasonName}
                    </h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                    {season.subtitle}
                  </p>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                      Recommended Destinations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {season.destinations.map((d, i) => (
                        <button
                          key={i}
                          onClick={() => onSelectDestinationSlug(d.toLowerCase().replace(/\s+/g, '-'))}
                          className="px-2.5 py-1 rounded-md bg-white hover:bg-black hover:text-white text-gray-800 text-xs font-semibold border border-gray-200 transition-colors cursor-pointer"
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 pt-0">
                <button
                  onClick={() => onStartAIPlan(`Plan a trip for ${season.seasonName}`)}
                  className="w-full h-10 min-h-[40px] px-2.5 sm:px-3 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wide sm:tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer text-center whitespace-nowrap select-none"
                >
                  <AIIcon className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Plan {season.seasonName.split(' ')[0]} Trip</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
