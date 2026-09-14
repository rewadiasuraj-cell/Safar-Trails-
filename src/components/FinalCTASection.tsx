import React from 'react';
import { 
  ArrowRight, 
  Users, 
  Award, 
  ShieldCheck, 
  Headphones 
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { AIIcon } from './AIIcon';
import { enquiryMessage, openWhatsApp } from '../lib/contact';

interface FinalCTASectionProps {
  onStartAIPlan: () => void;
  onOpenQuoteModal: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  onStartAIPlan,
  onOpenQuoteModal
}) => {
  const handleWhatsApp = () => openWhatsApp(enquiryMessage(), 'final_cta');

  return (
    <section id="final-cta-section" className="w-full bg-midnight-blue text-white relative overflow-hidden border-t border-luxury-gold/30">
      {/* Top Trust Indicators Bar */}
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-12 sm:pt-14 pb-10 sm:pb-12 border-b border-white/10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Trust Item 1 */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full border border-luxury-gold/40 bg-white/5 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-luxury-gold stroke-[1.8]" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wide">Fully Customized</div>
              <div className="text-xs text-gray-400">Packages</div>
            </div>
          </div>

          {/* Trust Item 2 */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full border border-luxury-gold/40 bg-white/5 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5 text-luxury-gold stroke-[1.8]" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wide">Trusted</div>
              <div className="text-xs text-gray-400">Travel Partners</div>
            </div>
          </div>

          {/* Trust Item 3 */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full border border-luxury-gold/40 bg-white/5 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-luxury-gold stroke-[1.8]" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wide">Clear</div>
              <div className="text-xs text-gray-400">Pricing</div>
            </div>
          </div>

          {/* Trust Item 4 */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full border border-luxury-gold/40 bg-white/5 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-5 h-5 text-luxury-gold stroke-[1.8]" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wide">24/7</div>
              <div className="text-xs text-gray-400">Travel Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main CTA Section */}
      <div className="py-16 lg:py-20">
        <div className="relative z-10 w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-luxury-gold/30 text-luxury-gold text-xs font-bold uppercase tracking-widest backdrop-blur-xs">
            <AIIcon className="w-3.5 h-3.5 text-luxury-gold" />
            <span>Design Your Journey, with Safar Trails</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight max-w-3xl mx-auto">
            Let's Plan Your Perfect Journey
          </h2>

          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            Smart AI planning, expert refinement, and personalized travel—crafted for your perfect journey.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onStartAIPlan}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-deep-emerald hover:bg-forest-green text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all inline-flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <AIIcon className="w-4 h-4 text-white shrink-0" />
              <span className="whitespace-nowrap">Create Customized Itinerary</span>
              <ArrowRight className="w-4 h-4 ml-1 shrink-0" />
            </button>

            <button
              onClick={handleWhatsApp}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-whatsapp hover:bg-whatsapp-hover text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <WhatsAppIcon className="w-4.5 h-4.5" />
              <span>Chat on WhatsApp</span>
            </button>

            <button
              onClick={onOpenQuoteModal}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-warm-orange hover:brightness-95 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              Request Custom Package
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
