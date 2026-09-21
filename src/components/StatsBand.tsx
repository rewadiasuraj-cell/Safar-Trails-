import React from 'react';
import { MapPin, Briefcase, IndianRupee, Clock } from 'lucide-react';
import { destinationsData } from '../data/destinationsData';
import { packagesData } from '../data/packagesData';

/**
 * A short band of numbers just above the footer — the last thing read before
 * the page ends.
 *
 * Two of the four are counted from the content at build time rather than typed
 * in, so they cannot drift out of date the way a hardcoded "100+ destinations"
 * does the moment someone adds or removes one.
 *
 * The other two are not counts, deliberately. The obvious fourth stat on a
 * travel site is an average star rating, and the obvious third is travellers
 * served — but destinationsData carries placeholder reviewCounts totalling
 * over ten thousand against a business with four real reviews, which is
 * exactly why structuredData.ts refuses to mark them up (see the note above
 * touristTripSchema). Printing those numbers here would be the same claim in
 * a bigger font. "Including tax" and "24x7" are things the site can actually
 * be held to, so those are what this band says instead.
 */
export const StatsBand: React.FC = () => {
  const stats = [
    {
      icon: MapPin,
      value: `${destinationsData.length}`,
      label: 'Destination guides',
    },
    {
      icon: Briefcase,
      value: `${packagesData.length}`,
      label: 'Ready itineraries',
    },
    {
      icon: IndianRupee,
      value: 'Incl. tax',
      label: 'No hidden costs',
    },
    {
      icon: Clock,
      value: '24x7',
      label: 'On-trip support',
    },
  ];

  return (
    <section
      id="stats-band"
      aria-label="Safar Trails at a glance"
      className="w-full bg-ivory border-t border-[#D9E6F0]"
    >
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 sm:py-10">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
          {stats.map(({ icon: Icon, value, label }) => (
            <li key={label} className="flex items-center gap-3">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-[#D9E6F0] flex items-center justify-center">
                <Icon className="w-[18px] h-[18px] text-forest-green" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-none">
                  {value}
                </div>
                <div className="mt-1 text-[11.5px] sm:text-xs text-[#475569] leading-snug">
                  {label}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
