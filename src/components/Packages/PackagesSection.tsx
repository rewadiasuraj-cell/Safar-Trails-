import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { packagesData } from '../../data/packagesData';
import { GST_NOTE } from '../../lib/seo/siteConfig';
import { Package } from '../../types';
import {
  Building2,
  Car,
  Utensils,
  Info,
  Send
} from 'lucide-react';

interface PackagesSectionProps {
  /**
   * True when this renders as the standalone /packages page rather than a
   * homepage section: the heading becomes the page's only h1 and carries the
   * page-level copy, matching the prerendered H1 in src/lib/seo/routes.ts.
   */
  asPage?: boolean;
  onSelectPackage: (pkg: Package) => void;
  onCustomizePackageWithAI?: (packageTitle: string, destination: string) => void;
  onOpenQuoteModal?: (summary?: string, destinationName?: string) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  asPage = false,
  onSelectPackage,
  onCustomizePackageWithAI,
  onOpenQuoteModal
}) => {
  /* The travel-style strip on the homepage links here as /packages?style=Family.
     Without this the chips would land on an unfiltered list and quietly do
     nothing, which is worse than not having them. Read once, as the initial
     filter value, so a visitor can still change it from the controls below. */
  const [searchParams] = useSearchParams();
  const styleParam = searchParams.get('style');

  const [selectedDestination, setSelectedDestination] = useState<string>('All');
  const [selectedTripType, setSelectedTripType] = useState<string>(styleParam || 'All');
  const [selectedDuration, setSelectedDuration] = useState<string>('All');

  const destinationsList = ['All', 'Kashmir', 'Goa', 'Kerala', 'Rajasthan', 'Himachal Pradesh', 'Andaman', 'Meghalaya', 'Uttarakhand'];
  /* These are the tripType values that actually occur in the content, with the
     count each covers: Couple 16, Family 15, Adventure 9, Honeymoon 8,
     Group 7, Luxury 5, Nature 4. "Solo" and "Friends" used to be listed here
     and Solo matches nothing at all - a filter chip that always returns an
     empty grid. */
  const tripTypesList = ['All', 'Couple', 'Family', 'Adventure', 'Honeymoon', 'Group', 'Luxury', 'Nature'];
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

  /**
   * The homepage used to render all 21 package cards - 11,884px of a 35,592px
   * page, and the same catalogue /packages already carries. It shows a handful
   * and links onward; the standalone page is unchanged.
   */
  /* The full-card grid below only ever renders on /packages now; the homepage
     has its own compact grid of four. */
  const visiblePackages = asPage ? filteredPackages : [];

  const handleBookNow = (pkg: Package) => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal(`Booking Request: ${pkg.title} (${pkg.durationDays}D/${pkg.durationNights}N - ₹${pkg.startingPrice})`, pkg.destination);
    } else {
      onSelectPackage(pkg);
    }
  };

  return (
    <section id="packages-section" className="w-full py-14 lg:py-20 bg-light-blue border-t border-stone-100">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Single Clean Section Heading - No Redundant Subheaders */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            {asPage ? (
              <>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                  India Holiday Packages
                </h1>
                <p className="mt-1.5 text-stone-600 text-sm max-w-xl font-normal">
                  Each package is a starting point, not a fixed menu. Tell us your dates and we will
                  send a revised day-wise itinerary with transparent pricing.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                  India Tour Packages
                </h2>
                <p className="mt-1.5 text-stone-600 text-sm max-w-xl font-normal">
                  Expertly curated itineraries, trusted stays, private cabs, and 24/7 travel support.
                </p>
              </>
            )}
          </div>

          {asPage ? (
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 bg-stone-50 px-3.5 py-1.5 rounded-full border border-stone-200 self-start sm:self-auto">
              <strong className="text-stone-900">{filteredPackages.length}</strong> Packages Available
            </div>
          ) : (
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-deep-emerald hover:bg-forest-green text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-[0_8px_22px_-10px_rgba(3,105,161,0.8)] transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
            >
              <span>{`View all ${packagesData.length}`}</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>

        {/* Homepage grid: four photo cards, one row.
         *
         * Same reasoning as the destinations grid above it. The full card
         * carries an overview, four spec rows, a price block and two buttons;
         * four of them made this section 1527px. Here the card answers "which
         * trip do I want to open" - photo, nights, title, price - and the
         * whole tile is one link to the package page, where every CTA lives.
         *
         * The three filter rows below are for /packages. Filtering a list of
         * four was three rows of controls over one row of results. */}
        {!asPage && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {filteredPackages.slice(0, 4).map((pkg) => (
              <Link
                key={pkg.id}
                to={`/tour-packages/${pkg.slug}`}
                className="group relative block rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[4/5] shadow-[0_10px_30px_-12px_rgba(15,23,42,0.35)] hover:shadow-[0_22px_48px_-14px_rgba(15,23,42,0.45)] hover:-translate-y-1 transition-all duration-300"
              >
                <img
                  src={pkg.heroImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />

                <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/95 text-stone-900 leading-none">
                  {pkg.durationDays}D / {pkg.durationNights}N
                </span>

                <div className="absolute inset-x-2.5 bottom-2.5 sm:inset-x-4 sm:bottom-4">
                  <h3 className="font-serif text-[13px] sm:text-base font-bold text-white tracking-tight leading-snug line-clamp-2">
                    {pkg.title}
                  </h3>
                  <p className="mt-2 text-[15px] sm:text-lg font-black text-luxury-gold tracking-tight">
                    ₹{pkg.startingPrice.toLocaleString('en-IN')}
                    <span className="text-[10px] sm:text-[11px] font-semibold text-white/75"> / person {GST_NOTE}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Filter Controls Bar */}
        {asPage && (
        <div className="bg-[#F2F8FC] p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-2xs mb-8 space-y-3.5">
          {/* Destination Pills */}
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1.5">
              Destination:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {destinationsList.map((dest) => (
                <button
                  key={dest}
                  onClick={() => setSelectedDestination(dest)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    selectedDestination === dest
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>

          {/* Trip Type & Duration row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-stone-200">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1.5">
                Travel Style:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {tripTypesList.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedTripType(type)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedTripType === type
                        ? 'bg-stone-900 text-white font-bold'
                        : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1.5">
                Duration:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {durationsList.map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setSelectedDuration(dur)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedDuration === dur
                        ? 'bg-stone-900 text-white font-bold'
                        : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Packages Grid — /packages only; the homepage grid is above. */}
        {asPage && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {visiblePackages.map((pkg) => (
            <div
              key={pkg.id}
              className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-luxury-gold shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative">
                {/*
                  Clicking the photo or the details opens the package, the same
                  as More Info below.

                  Only this upper block, not the whole card: the card's footer
                  carries Book Now as well, and a full-card overlay would
                  swallow it.

                  aria-hidden and tabIndex -1 because this is a mouse
                  convenience, not a second control. More Info below is the real
                  one - keeping this out of the tab order avoids a duplicate
                  stop on every card and a screen reader announcing the same
                  action twice.
                */}
                <button
                  type="button"
                  aria-hidden="true"
                  tabIndex={-1}
                  onClick={() => onSelectPackage(pkg)}
                  className="absolute inset-0 z-10 cursor-pointer"
                />

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
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-stone-900 shadow-xs">
                      {pkg.destination}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-900 text-white shadow-xs">
                      {pkg.durationDays}D / {pkg.durationNights}N
                    </span>
                  </div>

                  {/* Best for */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center text-white text-xs">
                    <span className="text-[11px] text-stone-200 line-clamp-1">
                      {pkg.bestFor}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-serif font-bold text-stone-900 group-hover:text-gold-ink transition-colors line-clamp-2 leading-snug">
                    {pkg.title}
                  </h3>

                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {pkg.overview}
                  </p>

                  {/* Quick Feature Specs */}
                  <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-stone-600 border-t border-stone-100">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-stone-400" />
                      <span className="truncate">{pkg.hotelCategory}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-stone-400" />
                      <span className="truncate">Private Cab</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-stone-400" />
                      <span className="truncate">Meals Incl.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & 2-Button Action Row (More Info & Book Now) */}
              <div className="p-5 pt-0 border-t border-stone-100 mt-2 space-y-3">
                <div className="flex items-baseline justify-between pt-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Starting from</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-stone-900">
                        ₹{pkg.startingPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-stone-500 font-normal">/ person {GST_NOTE}</span>
                    </div>
                  </div>

                  {pkg.originalPrice && (
                    <div className="text-right">
                      <span className="text-xs text-stone-400 line-through">
                        ₹{pkg.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>

                {/* 2 CTA Buttons: More Info & Book Now */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className="w-full h-10 rounded-xl border border-stone-200 hover:border-stone-900 hover:bg-stone-50 text-stone-800 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer text-center whitespace-nowrap"
                  >
                    <Info className="w-3.5 h-3.5 text-stone-600" />
                    <span>More Info</span>
                  </button>

                  <button
                    onClick={() => handleBookNow(pkg)}
                    className="w-full h-10 rounded-xl bg-warm-orange hover:brightness-95 text-cta-ink font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer text-center whitespace-nowrap shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {/* "View all" moved into the section header, top right. */}
        </div>
        )}
      </div>
    </section>
  );
};
