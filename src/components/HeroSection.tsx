import React, { useEffect, useState } from 'react';
import { ArrowRight, MapPin, Users, Calendar, ChevronDown, ShieldCheck, BadgeCheck } from 'lucide-react';
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

const DURATION_OPTIONS = ['Trip duration', '3-4 Days', '5-7 Days', '8-10 Days', '10+ Days'];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartAIPlan
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [destination, setDestination] = useState('');
  const [travelers, setTravelers] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const handlePlanWithAI = () => {
    if (!destination && !travelers && !duration) {
      onStartAIPlan();
      return;
    }
    const parts: string[] = [];
    parts.push(`Plan a trip${destination ? ` to ${destination}` : ''}`);
    if (travelers) parts.push(`for ${travelers} traveler${travelers === '1' ? '' : 's'}`);
    if (duration && duration !== 'Trip duration') parts.push(`for ${duration}`);
    onStartAIPlan(parts.join(' '));
  };

  return (
    <section id="hero-section" className="relative w-full pt-24 sm:pt-28 pb-16 sm:pb-20 lg:pt-32 lg:pb-24 overflow-hidden bg-midnight-blue text-white">
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
        <div className="absolute inset-0 bg-gradient-to-r from-midnight-blue/95 via-midnight-blue/75 to-transparent sm:w-3/4 lg:w-3/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-blue via-transparent to-midnight-blue/30 lg:hidden" />
      </div>

      <div className="relative z-10 w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Eyebrow: AI PLANS. EXPERTS PERFECT. */}
          <div className="mb-3">
            <span className="text-luxury-gold text-xs sm:text-[13px] font-extrabold uppercase tracking-[0.25em]">
              AI PLANS. EXPERTS PERFECT.
            </span>
          </div>

          {/* Main Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-serif text-white tracking-tight leading-[1.08] mb-4">
            <span>Your Journey.</span>
            <br />
            <span className="text-luxury-gold italic font-serif">
              Our Passion.
            </span>
          </h1>

          {/* Secondary line */}
          <p className="text-sm sm:text-base lg:text-[17px] text-gray-300 font-normal leading-relaxed max-w-xl mb-5 text-shadow-xs">
            Personalized travel planning powered by intelligent AI, refined and verified by seasoned human destination specialists.
          </p>

          {/* Trust Badges Row */}
          <div className="flex items-center gap-6 sm:gap-8 mb-7 sm:mb-8">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                <AIIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-gray-300 whitespace-nowrap">AI Powered</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                <BadgeCheck className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-gray-300 whitespace-nowrap">Expert Verified</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-gray-300 whitespace-nowrap">Trusted</span>
            </div>
          </div>

          {/* Plan with AI Card */}
          <div className="bg-ivory rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-900 max-w-xl border border-luxury-gold/30">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight mb-2">
              Where do you want to go?
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              Share a few details and we'll create the perfect travel plan for you.
            </p>

            {/* Destination Input */}
            <div className="relative mb-3">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where do you want to go?"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-gray-200 bg-white text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none focus:border-deep-emerald"
              />
            </div>

            {/* Travelers & Duration Row */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="number"
                  min={1}
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  placeholder="Number of travelers"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 bg-white text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none focus:border-deep-emerald"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 rounded-xl border border-gray-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-deep-emerald appearance-none cursor-pointer"
                >
                  {DURATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt === 'Trip duration' ? '' : opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <button
              id="hero-plan-with-ai-btn"
              type="button"
              onClick={handlePlanWithAI}
              className="w-full bg-deep-emerald hover:bg-forest-green text-white px-5 sm:px-6 py-3.5 rounded-xl sm:rounded-2xl transition-all cursor-pointer active:scale-[0.98] shadow-xs flex items-center justify-center gap-2"
            >
              <AIIcon className="w-4 h-4 text-white shrink-0" />
              <span className="font-bold text-sm sm:text-base">Plan with AI</span>
              <ArrowRight className="w-5 h-5 text-white shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
