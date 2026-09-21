import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { Phone, FileText } from 'lucide-react';
import { callPhone, enquiryMessage, openWhatsApp } from '../lib/contact';
import { PRIMARY_PHONE_DISPLAY } from '../lib/seo/siteConfig';

interface StickyContactWidgetProps {
  onOpenQuoteModal: (summary?: string) => void;
}

/**
 * Three floating buttons on the right edge.
 *
 * Two things were wrong on phones. The column started at bottom-20, which is
 * only just above the bottom nav, so the stack ran up the right-hand side of
 * whatever section was on screen - it sat across the last column of the trust
 * strip and the corner of every card row. And the bottom one was WhatsApp,
 * which the bottom nav already carries, so a phone showed the same button
 * twice within 80px of itself.
 *
 * So: on phones it is two buttons, not three, sitting lower and smaller, with
 * the duplicate WhatsApp dropped. All three stay on desktop, where there is
 * no bottom nav and nothing to collide with.
 */
export const StickyContactWidget: React.FC<StickyContactWidgetProps> = ({
  onOpenQuoteModal
}) => {
  const handleWhatsApp = () => openWhatsApp(enquiryMessage(), 'sticky_widget');
  const handleCall = () => callPhone('sticky_widget');

  return (
    <div 
      id="sticky-contact-widget"
      className="fixed right-2.5 sm:right-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] lg:bottom-8 z-30 flex flex-col items-center gap-2 sm:gap-3 group select-none"
      aria-label="Quick contact and inquiry options"
    >
      {/* 1. Free Itinerary / Quote Form Trigger */}
      <button
        id="sticky-btn-quote-form"
        type="button"
        onClick={() => onOpenQuoteModal('Get Free Day-by-Day Itinerary & Itemized Price Estimate')}
        className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-stone-900 hover:bg-black text-white shadow-xl hover:shadow-2xl border-2 border-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group/item focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink"
        title="Get Free Itinerary & Quote"
        aria-label="Get Free Itinerary & Quote"
      >
        <FileText className="w-5 h-5 text-warm-orange group-hover/item:text-[#FFA766] transition-colors" aria-hidden="true" />
        <span className="absolute right-full mr-2.5 px-2.5 py-1 rounded-lg bg-stone-900 text-white text-[11px] font-bold whitespace-nowrap shadow-lg opacity-0 group-hover/item:opacity-100 pointer-events-none transition-opacity duration-200 hidden sm:block">
          Get Free Itinerary
        </span>
        {/* Pulsing indicator badge */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warm-orange opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-warm-orange text-[8px] font-black text-cta-ink items-center justify-center">!</span>
        </span>
      </button>

      {/* 2. Direct Phone Call */}
      <button
        id="sticky-btn-call"
        type="button"
        onClick={handleCall}
        className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-warm-orange hover:brightness-95 text-cta-ink shadow-xl hover:shadow-2xl border-2 border-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group/item focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
        title={`Call a travel specialist (${PRIMARY_PHONE_DISPLAY})`}
        aria-label={`Call a travel specialist on ${PRIMARY_PHONE_DISPLAY}`}
      >
        <Phone className="w-5 h-5 text-cta-ink" aria-hidden="true" />
        <span className="absolute right-full mr-2.5 px-2.5 py-1 rounded-lg bg-stone-900 text-white text-[11px] font-bold whitespace-nowrap shadow-lg opacity-0 group-hover/item:opacity-100 pointer-events-none transition-opacity duration-200 hidden sm:block">
          Call {PRIMARY_PHONE_DISPLAY}
        </span>
      </button>

      {/* 3. WhatsApp, desktop only. MobileBottomNav carries it below lg. */}
      <button
        id="sticky-btn-whatsapp"
        type="button"
        onClick={handleWhatsApp}
        className="relative hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-whatsapp hover:bg-whatsapp-hover text-white shadow-xl hover:shadow-2xl border-2 border-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group/item focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="w-6 h-6" aria-hidden="true" />
        <span className="absolute right-full mr-2.5 px-2.5 py-1 rounded-lg bg-midnight-blue text-white text-[11px] font-bold whitespace-nowrap shadow-lg opacity-0 group-hover/item:opacity-100 pointer-events-none transition-opacity duration-200 hidden sm:block">
          WhatsApp Specialist
        </span>
      </button>
    </div>
  );
};
