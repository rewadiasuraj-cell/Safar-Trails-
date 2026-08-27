import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { Phone, FileText, Sparkles } from 'lucide-react';

interface StickyContactWidgetProps {
  onOpenQuoteModal: (summary?: string) => void;
}

export const StickyContactWidget: React.FC<StickyContactWidgetProps> = ({
  onOpenQuoteModal
}) => {
  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      "Hi SafarTrails! I am planning a holiday in India. Please assist me with customized itineraries, hotel recommendations, and cost estimates."
    );
    window.open(`https://wa.me/918076665782?text=${text}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+918076665782';
  };

  return (
    <div 
      id="sticky-contact-widget"
      className="fixed right-3 sm:right-4 bottom-20 lg:bottom-8 z-40 flex flex-col items-center gap-2.5 sm:gap-3 group select-none"
      aria-label="Quick contact and inquiry options"
    >
      {/* 1. Free Itinerary / Quote Form Trigger */}
      <button
        id="sticky-btn-quote-form"
        type="button"
        onClick={() => onOpenQuoteModal('Get Free Day-by-Day Itinerary & Itemized Price Estimate')}
        className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-900 hover:bg-black text-white shadow-xl hover:shadow-2xl border-2 border-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group/item"
        title="Get Free Itinerary & Quote"
        aria-label="Get Free Itinerary & Quote"
      >
        <FileText className="w-5 h-5 text-orange-400 group-hover/item:text-orange-300 transition-colors" />
        <span className="absolute right-full mr-2.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold whitespace-nowrap shadow-lg opacity-0 group-hover/item:opacity-100 pointer-events-none transition-opacity duration-200 hidden sm:block">
          Get Free Itinerary
        </span>
        {/* Pulsing indicator badge */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500 text-[8px] font-black text-white items-center justify-center">!</span>
        </span>
      </button>

      {/* 2. Direct Phone Call */}
      <button
        id="sticky-btn-call"
        type="button"
        onClick={handleCall}
        className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl border-2 border-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group/item"
        title="Call Travel Specialist (+91 80766 65782)"
        aria-label="Call Travel Specialist"
      >
        <Phone className="w-5 h-5 text-white" />
        <span className="absolute right-full mr-2.5 px-2.5 py-1 rounded-lg bg-blue-900 text-white text-[11px] font-bold whitespace-nowrap shadow-lg opacity-0 group-hover/item:opacity-100 pointer-events-none transition-opacity duration-200 hidden sm:block">
          Call +91 80766 65782
        </span>
      </button>

      {/* 3. Direct WhatsApp Chat */}
      <button
        id="sticky-btn-whatsapp"
        type="button"
        onClick={handleWhatsApp}
        className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl hover:shadow-2xl border-2 border-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group/item"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="w-6 h-6" />
        <span className="absolute right-full mr-2.5 px-2.5 py-1 rounded-lg bg-emerald-900 text-white text-[11px] font-bold whitespace-nowrap shadow-lg opacity-0 group-hover/item:opacity-100 pointer-events-none transition-opacity duration-200 hidden sm:block">
          WhatsApp Specialist
        </span>
      </button>
    </div>
  );
};
