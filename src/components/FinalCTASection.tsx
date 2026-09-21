import React from 'react';
import { ArrowRight, Sliders, BadgeCheck, ReceiptIndianRupee, Headphones } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { AIIcon } from './AIIcon';
import { enquiryMessage, openWhatsApp } from '../lib/contact';

interface FinalCTASectionProps {
  onStartAIPlan: () => void;
  onOpenQuoteModal: () => void;
}

/* Four promises, each a thing the business can be held to rather than an
   adjective. The icons are single-weight line marks at one size, so the row
   reads as one set instead of four decorations. */
const PILLARS = [
  {
    icon: Sliders,
    title: 'Fully Customized Packages',
    description: 'Swap a hotel, add a day, move the dates — no itinerary here is fixed.',
  },
  {
    icon: BadgeCheck,
    title: 'Trusted Travel Partners',
    description: 'Hotels we have checked ourselves and trained local drivers on every route.',
  },
  {
    icon: ReceiptIndianRupee,
    title: 'Clear Pricing',
    description: 'Prices include tax, inclusions written out in full, nothing added later.',
  },
  {
    icon: Headphones,
    title: '24/7 Travel Support',
    description: 'A real coordinator on WhatsApp for the whole trip, not a ticket queue.',
  },
];

/**
 * Was a dark block: four trust items in a row across the top, then a centred
 * heading and three buttons, all on midnight-blue.
 *
 * It is light now, which matters more than it sounds - this sits directly
 * above the footer, which is the darkest thing on the page, and two dark
 * bands stacked made the bottom third of the site read as one unbroken slab.
 *
 * The three buttons were equal weight, so nothing led. "Create Customized
 * Itinerary" is the primary now and is the only one on a filled blue; the
 * orange "Request Custom Package" keeps the CTA colour, and WhatsApp stays
 * outlined so the row does not turn into three competing blocks.
 */
export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  onStartAIPlan,
  onOpenQuoteModal,
}) => {
  const handleWhatsApp = () => openWhatsApp(enquiryMessage(), 'final_cta');

  return (
    <section id="final-cta-section" className="w-full bg-light-blue border-t border-[#D9E6F0]">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-14 sm:py-16 lg:py-20">

        {/* ---- Four pillars ---- */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="bg-white rounded-2xl border border-[#D9E6F0] p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <span className="inline-flex w-11 h-11 rounded-xl bg-light-blue border border-[#D9E6F0] items-center justify-center">
                <Icon className="w-5 h-5 text-deep-emerald" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-sans-ui text-[15px] font-bold text-stone-900 leading-snug">
                {title}
              </h3>
              <p className="mt-1.5 text-[13px] text-stone-700 leading-relaxed">
                {description}
              </p>
            </li>
          ))}
        </ul>

        {/* ---- The ask ---- */}
        <div className="mt-12 sm:mt-14 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#D9E6F0] text-[10px] font-extrabold uppercase tracking-widest text-gold-ink">
            <AIIcon className="w-3.5 h-3.5 text-deep-emerald" aria-hidden="true" />
            <span>Design your journey, with Safar Trails</span>
          </span>

          <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold text-stone-900 tracking-tight leading-tight">
            Let's Plan Your Perfect Journey
          </h2>

          <p className="mt-3 text-sm sm:text-base text-stone-700 leading-relaxed max-w-xl mx-auto">
            Smart AI planning, expert refinement, and a person on WhatsApp for the
            whole trip — crafted around your dates and your budget.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <button
              id="final-cta-ai-itinerary"
              onClick={onStartAIPlan}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-deep-emerald hover:bg-forest-green text-white font-bold text-sm shadow-[0_8px_24px_-8px_rgba(3,105,161,0.6)] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <AIIcon className="w-4 h-4 text-white shrink-0" aria-hidden="true" />
              <span>Create Customized Itinerary</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>

            <button
              id="final-cta-request-package"
              onClick={onOpenQuoteModal}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-warm-orange hover:brightness-105 text-cta-ink font-bold text-sm shadow-[0_8px_24px_-8px_rgba(255,133,52,0.7)] transition-all cursor-pointer"
            >
              Request Custom Package
            </button>

            <button
              id="final-cta-whatsapp"
              onClick={handleWhatsApp}
              className="w-full sm:w-auto px-6 py-4 rounded-full border border-[#D9E6F0] bg-white hover:bg-light-blue text-stone-900 font-bold text-sm transition-colors flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <WhatsAppIcon className="w-[18px] h-[18px]" aria-hidden="true" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
