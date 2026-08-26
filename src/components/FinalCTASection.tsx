import React from 'react';
import { ArrowRight, Phone, MessageSquareQuote } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { AIIcon } from './AIIcon';

interface FinalCTASectionProps {
  onStartAIPlan: () => void;
  onOpenQuoteModal: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  onStartAIPlan,
  onOpenQuoteModal
}) => {
  const handleWhatsApp = () => {
    const text = encodeURIComponent("Hi SafarTrails! I'm planning an upcoming holiday in India and would like to speak with a travel specialist.");
    window.open(`https://wa.me/918076665782?text=${text}`, '_blank');
  };

  return (
    <section id="final-cta-section" className="w-full py-16 lg:py-24 bg-[#0A0A0A] text-white relative overflow-hidden border-t border-gray-800">
      <div className="relative z-10 w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-gray-300 text-xs font-bold uppercase tracking-widest backdrop-blur-xs">
          <AIIcon className="w-3.5 h-3.5 text-white" />
          <span>Start Your Bespoke Journey</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight max-w-3xl mx-auto">
          Ready to Explore India Your Way?
        </h2>

        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
          From snowy Himalayan passes to tropical palm-fringed backwaters, let SafarTrails design your unforgettable escape.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onStartAIPlan}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-gray-200 text-black font-bold text-xs uppercase tracking-wider shadow-lg transition-all inline-flex items-center justify-center gap-2 cursor-pointer text-center"
          >
            <AIIcon className="w-4 h-4 text-black shrink-0" />
            <span className="whitespace-nowrap">Launch Itinerary Studio</span>
            <ArrowRight className="w-4 h-4 ml-1 shrink-0" />
          </button>

          <button
            onClick={handleWhatsApp}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <WhatsAppIcon className="w-4.5 h-4.5" />
            <span>Chat on WhatsApp</span>
          </button>

          <button
            onClick={onOpenQuoteModal}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-transparent hover:bg-gray-900 text-white font-bold text-xs uppercase tracking-wider border border-gray-700 hover:border-gray-500 transition-all cursor-pointer"
          >
            Request Custom Quote
          </button>
        </div>
      </div>
    </section>
  );
};
