import React from 'react';
import { ShieldCheck, IndianRupee, Clock, CheckCircle2 } from 'lucide-react';

/**
 * Four promises, one line each, directly under the hero.
 *
 * TrustSection makes the same case at length — six pillars, a paragraph each,
 * a whole dark screen of it — and sat seventh on the homepage, about six
 * scrolls down. By the time a first-time visitor reached it they had already
 * decided whether this looked like a real business.
 *
 * So this is the same claims at a glance, placed where the decision is
 * actually made. TrustSection keeps the long version and still runs on
 * /about-us, where someone who wants the detail has gone looking for it.
 *
 * Every line here is a promise the site keeps elsewhere: "including tax" is
 * what every price on the site now says (GST_NOTE in siteConfig), the
 * specialist review is the process described on /about-us, and the WhatsApp
 * number in the header and footer is the 24x7 channel. Nothing here is a
 * number we cannot stand behind — which is why there is no star rating in
 * this row, unlike most travel sites.
 */
const PILLARS = [
  {
    icon: CheckCircle2,
    title: 'Handpicked Itineraries',
    description: 'Every trip is checked by a destination specialist before it reaches you.',
  },
  {
    icon: IndianRupee,
    title: 'Transparent Pricing',
    description: 'Prices include tax. Inclusions written out in full, no surprises on the ground.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Stays & Drivers',
    description: 'Hotels we have checked ourselves, and trained local drivers on every route.',
  },
  {
    icon: Clock,
    title: '24x7 On-Trip Support',
    description: 'A real coordinator on WhatsApp for the whole journey, not a ticket queue.',
  },
];

export const TrustStrip: React.FC = () => (
  <section
    id="trust-strip"
    aria-label="Why travellers book with Safar Trails"
    className="w-full bg-ivory"
  >
    <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8">
      <ul className="bg-white rounded-2xl sm:rounded-3xl border border-[#E7E2DA] shadow-xs grid grid-cols-2 lg:grid-cols-4 divide-y divide-x divide-[#E7E2DA] [&>li:nth-child(-n+2)]:border-t-0 lg:[&>li]:border-t-0">
        {PILLARS.map(({ icon: Icon, title, description }) => (
          <li key={title} className="flex items-center sm:items-start gap-3 p-3.5 sm:p-5 lg:p-6">
            <span className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-light-blue border border-[#E7E2DA] flex items-center justify-center">
              <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-forest-green" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="font-sans-ui text-[13px] sm:text-sm font-bold text-stone-900 leading-snug">
                {title}
              </h3>
              {/* Titles only on phones.
                  At 390px the four descriptions turned this band into 401px of
                  six-word lines, and the three floating contact widgets sit on
                  top of the right-hand column and cover the last one. The
                  headings alone are the scannable version, and the full
                  wording is still on /about-us in TrustSection. */}
              <p className="hidden sm:block mt-1 text-[11.5px] sm:text-xs text-[#57534E] leading-relaxed">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
