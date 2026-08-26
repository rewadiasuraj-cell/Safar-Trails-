import React, { useState } from 'react';
import { 
  MapPin, 
  Users, 
  Award, 
  ShieldCheck, 
  Headphones 
} from 'lucide-react';
import { AIIcon } from './AIIcon';

interface HeroSectionProps {
  onStartAIPlan: (promptText?: string) => void;
  onExplorePackages: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartAIPlan
}) => {
  const [promptInput, setPromptInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptInput.trim()) {
      onStartAIPlan(promptInput.trim());
    } else {
      onStartAIPlan('4 people, Kashmir, 6 days, ₹80,000 budget');
    }
  };

  return (
    <section id="hero-section" className="relative pt-24 sm:pt-28 pb-14 sm:pb-18 lg:pt-32 lg:pb-20 overflow-hidden bg-[#0A1626] text-white">
      {/* Background Image: Stunning Kashmir Dal Lake Shikara Houseboat with Snow Mountains */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=85&w=2600&auto=format&fit=crop"
          alt="Scenic Kashmir Dal Lake Houseboats with Snow Mountains"
          className="w-full h-full object-cover object-right md:object-center transform scale-100 transition-transform duration-1000"
          loading="eager"
        />
        {/* Editorial Gradient Overlays for optimal text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071322]/95 via-[#071322]/75 to-transparent sm:w-3/4 lg:w-3/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071322] via-transparent to-[#071322]/30 lg:hidden" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Eyebrow: AI PLANS. EXPERTS PERFECT. */}
          <div className="mb-3">
            <span className="text-[#FF6B00] text-xs sm:text-[13px] font-extrabold uppercase tracking-[0.25em]">
              AI PLANS. EXPERTS PERFECT.
            </span>
          </div>

          {/* Main Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-serif text-white tracking-tight leading-[1.08] mb-4">
            <span>Your Journey.</span>
            <br />
            <span className="text-[#FF6B00] italic font-serif">
              Your Way.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base lg:text-[17px] text-gray-200 font-normal leading-relaxed max-w-xl mb-7 sm:mb-8 text-shadow-xs">
            Personalized travel planning powered by intelligent AI, refined and verified by seasoned human destination specialists.
          </p>

          {/* Floating Search Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl text-slate-900 max-w-xl border border-gray-100/90">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
              {/* Input Area */}
              <div className="flex items-center gap-3 flex-1 w-full pl-1 sm:pl-2">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#FF6B00]" />
                </div>
                <div className="flex-1 w-full min-w-0">
                  <label htmlFor="hero-destination-input" className="block text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                    Where do you want to go?
                  </label>
                  <input
                    id="hero-destination-input"
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="Try: 4 people, Kashmir, 6 days, ₹80k"
                    className="w-full text-xs sm:text-sm text-slate-700 placeholder:text-gray-400 focus:outline-none bg-transparent pt-0.5"
                  />
                </div>
              </div>

              {/* Plan with AI Action Button */}
              <button
                id="hero-plan-with-ai-btn"
                type="submit"
                className="w-full sm:w-auto bg-[#0B1E36] hover:bg-black text-white px-5 sm:px-6 py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all flex-shrink-0 cursor-pointer shadow-xs active:scale-95 text-center"
              >
                <span className="whitespace-nowrap">Plan with AI</span>
                <AIIcon className="w-3.5 h-3.5 text-white shrink-0" />
              </button>
            </form>
          </div>
        </div>

        {/* Hero Bottom Trust Indicators Bar */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/15 grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {/* Trust Item 1 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center flex-shrink-0 bg-black/20 backdrop-blur-xs">
              <Users className="w-4 h-4 text-white stroke-[1.8]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white tracking-wide">100% Custom</div>
              <div className="text-[11px] text-gray-300">Trips tailored for you</div>
            </div>
          </div>

          {/* Trust Item 2 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center flex-shrink-0 bg-black/20 backdrop-blur-xs">
              <Award className="w-4 h-4 text-white stroke-[1.8]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white tracking-wide">Verified Partners</div>
              <div className="text-[11px] text-gray-300">Handpicked stays & cabs</div>
            </div>
          </div>

          {/* Trust Item 3 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center flex-shrink-0 bg-black/20 backdrop-blur-xs">
              <ShieldCheck className="w-4 h-4 text-white stroke-[1.8]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white tracking-wide">Transparent Quotes</div>
              <div className="text-[11px] text-gray-300">Zero hidden charges</div>
            </div>
          </div>

          {/* Trust Item 4 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center flex-shrink-0 bg-black/20 backdrop-blur-xs">
              <Headphones className="w-4 h-4 text-white stroke-[1.8]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white tracking-wide">24/7 Concierge</div>
              <div className="text-[11px] text-gray-300">Dedicated on-trip specialist</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

