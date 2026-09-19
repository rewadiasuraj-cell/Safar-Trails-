import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { packagesData } from '../data/packagesData';

/**
 * The dark banner near the foot of the page: photograph on one side, the
 * pitch and a single button on the other.
 *
 * The number in it is read from the content, not typed in, so it cannot drift
 * when a package is added or removed. And the wording is deliberately not
 * "special offer" or "limited time" - there is no discount running, and a
 * banner that invents urgency is the first thing that makes a small travel
 * agency look like every scam site in the category. It says what is actually
 * true: these are the trips, they are all customisable, nothing is locked in
 * until you confirm.
 */
export const SpecialOfferSection: React.FC = () => {
  const photo = packagesData[1]?.heroImage || packagesData[0]?.heroImage;

  return (
    <section id="special-offer" className="w-full bg-ivory py-10 sm:py-14">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="relative overflow-hidden rounded-3xl bg-midnight-blue grid grid-cols-1 lg:grid-cols-2 items-stretch">
          {/* Photo */}
          <div className="relative min-h-[200px] sm:min-h-[260px] lg:min-h-[320px] order-1">
            <img
              src={photo}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            {/* Fades the photo into the panel on desktop, where the two sit
                side by side; on phones the panel is below, so it fades down. */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-midnight-blue via-midnight-blue/25 to-transparent" />
          </div>

          {/* Words */}
          <div className="order-2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            <span className="block text-[11px] font-sans-ui font-extrabold uppercase tracking-[0.22em] text-luxury-gold mb-3">
              Your next trip
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-[36px] font-bold text-white tracking-tight leading-tight">
              Every itinerary here
              <br className="hidden sm:block" /> is yours to change
            </h2>
            <p className="mt-3.5 text-sm sm:text-[15px] text-stone-300 leading-relaxed max-w-md">
              {packagesData.length} ready trips across India — swap a hotel, add a day, move
              the dates. Prices include tax, and nothing is confirmed until you say so.
            </p>
            <Link
              to="/packages"
              className="mt-7 inline-flex w-fit items-center gap-2 bg-warm-orange hover:brightness-95 text-cta-ink font-bold text-sm px-6 py-3.5 rounded-full transition-all active:scale-[0.98]"
            >
              <span>Discover Packages</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
