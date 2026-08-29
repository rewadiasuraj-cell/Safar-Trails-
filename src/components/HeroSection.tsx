import React, { useEffect, useState } from 'react';
import { Plane, ArrowRight } from 'lucide-react';
import { AIIcon } from './AIIcon';

interface HeroSectionProps {
  onStartAIPlan: (promptText?: string) => void;
  onExplorePackages: () => void;
}

const HERO_SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=75&w=1400&auto=format&fit=crop',
    alt: 'Scenic Kashmir Dal Lake Houseboats with Snow Mountains',
  },
  {
    src: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=75&w=1400&auto=format&fit=crop',
    alt: 'Kerala backwaters with palm-lined canals',
  },
  {
    src: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=75&w=1400&auto=format&fit=crop',
    alt: 'Rajasthan heritage forts and desert landscape',
  },
  {
    src: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=75&w=1400&auto=format&fit=crop',
    alt: 'Goa beach coastline at golden hour',
  },
];

const SLIDE_INTERVAL_MS = 5000;

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartAIPlan
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero-section" className="relative w-full pt-24 sm:pt-28 pb-16 sm:pb-20 lg:pt-32 lg:pb-24 overflow-hidden bg-[#0A1626] text-white">
      {/* Background Slider: full-bleed, edge-to-edge autoplay carousel */}
      <div className="absolute inset-0 z-0 w-full h-full">
        {HERO_SLIDES.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className={`absolute inset-0 w-full h-full object-cover object-right md:object-center transition-opacity duration-1000 ease-in-out ${
              i === activeSlide ? 'opacity-100' : 'opacity-0'
            }`}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'auto'}
          />
        ))}
        {/* Editorial Gradient Overlays for optimal text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071322]/95 via-[#071322]/75 to-transparent sm:w-3/4 lg:w-3/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071322] via-transparent to-[#071322]/30 lg:hidden" />
      </div>

      <div className="relative z-10 w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
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
              Our Passion.
            </span>
          </h1>

          {/* Primary line - shown first, most prominent */}
          <p className="text-base sm:text-lg lg:text-xl text-white font-medium leading-relaxed max-w-xl mb-2.5 text-shadow-xs">
            Tell us where you want to go, and we'll turn your travel dreams into a perfectly planned journey.
          </p>

          {/* Secondary line */}
          <p className="text-sm sm:text-base lg:text-[17px] text-gray-300 font-normal leading-relaxed max-w-xl mb-7 sm:mb-8 text-shadow-xs">
            Personalized travel planning powered by intelligent AI, refined and verified by seasoned human destination specialists.
          </p>

          {/* Plan with AI Card */}
          <div className="bg-[#FAF7F0] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-900 max-w-xl border border-white/10">
            <div className="inline-flex items-center gap-1.5 text-[#0F5132] text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.15em] mb-2.5">
              <Plane className="w-3.5 h-3.5" />
              <span>Let's Plan Your Next Adventure</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight mb-2">
              Where do you want to go?
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              Tell us your destination, number of travelers and duration. We'll craft the perfect travel plan for you.
            </p>

            <button
              id="hero-plan-with-ai-btn"
              type="button"
              onClick={() => onStartAIPlan()}
              className="w-full bg-[#0F5132] hover:bg-[#0B3D26] text-white px-5 sm:px-6 py-3.5 rounded-xl sm:rounded-2xl transition-all cursor-pointer active:scale-[0.98] shadow-xs flex items-center justify-between gap-3"
            >
              <span className="text-left min-w-0">
                <span className="flex items-center gap-2 font-bold text-sm sm:text-base">
                  <AIIcon className="w-4 h-4 text-white shrink-0" />
                  <span>Plan with AI</span>
                </span>
                <span className="block text-[11px] sm:text-xs font-normal text-white/75 mt-0.5 truncate">
                  Get a personalized itinerary in seconds
                </span>
              </span>
              <ArrowRight className="w-5 h-5 text-white shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
