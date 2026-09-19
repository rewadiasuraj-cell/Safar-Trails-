import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Heart, Users, Leaf, Gem, UsersRound } from 'lucide-react';
import { packagesData } from '../data/packagesData';

/**
 * One row of travel styles between the destinations and packages grids.
 *
 * A previous TravelStylesSection was removed from this page for good reason:
 * it was a full card grid over the same 21 trips the two grids around it
 * already showed. This is not that. It is a single row of links, and each one
 * carries a real filter - /packages?style=Family, which PackagesSection reads
 * as its initial trip-type - so a chip narrows the catalogue instead of
 * dropping the visitor on the same unfiltered list.
 *
 * Every style below is a tripType that occurs in the content, and the count
 * beside it is counted at build time. Nothing here can point at an empty
 * result: "Solo", which the old filter offered, matches no package at all.
 */
const STYLES = [
  { label: 'Couple', tripType: 'Couple', icon: Heart },
  { label: 'Family', tripType: 'Family', icon: Users },
  { label: 'Adventure', tripType: 'Adventure', icon: Mountain },
  { label: 'Honeymoon', tripType: 'Honeymoon', icon: Gem },
  { label: 'Group', tripType: 'Group', icon: UsersRound },
  { label: 'Nature', tripType: 'Nature', icon: Leaf },
];

export const TravelStylesStrip: React.FC = () => {
  const countFor = (tripType: string) =>
    packagesData.filter((p) => p.tripType.some((t) => t.toLowerCase() === tripType.toLowerCase())).length;

  return (
    <section id="travel-styles" aria-label="Browse packages by travel style" className="w-full bg-ivory py-6 sm:py-8">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <ul className="flex items-center gap-2.5 sm:gap-4 overflow-x-auto scrollbar-none pb-1 lg:justify-center">
          {STYLES.map(({ label, tripType, icon: Icon }) => (
            <li key={tripType} className="shrink-0">
              <Link
                to={`/packages?style=${encodeURIComponent(tripType)}`}
                className="group inline-flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-full bg-white border border-[#E7E2DA] hover:border-forest-green shadow-xs transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-light-blue flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-forest-green" aria-hidden="true" />
                </span>
                <span className="text-[13px] font-bold text-stone-900 whitespace-nowrap">
                  {label}
                </span>
                <span className="text-[11px] font-semibold text-[#57534E] whitespace-nowrap">
                  {countFor(tripType)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
