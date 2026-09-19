import React, { useEffect, useState } from 'react';
import { ArrowRight, MapPin, Users, Calendar, ChevronDown } from 'lucide-react';
import { AIIcon } from './AIIcon';
import { trackAIPlanRequested } from '../lib/analytics';

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

/**
 * Split hero: words on cream to the left, photograph to the right.
 *
 * This used to be a full-bleed dark photo with a near-opaque navy gradient
 * poured over the whole left two-thirds so white text would sit on it. That
 * made the first screen a solid dark block - and it meant the photograph,
 * the one thing actually selling a holiday, was only visible in the corner
 * the text did not reach.
 *
 * Now the copy sits on the page's own cream with no scrim at all, and the
 * photograph gets its own half at full strength. Contrast stops depending on
 * how bright a given slide happens to be, which is the bug that scrim existed
 * to paper over: measured on ivory, the headline is 16.38:1, the green second
 * line 9.41:1, the body 9.62:1 and the eyebrow 4.71:1.
 *
 * On phones there is no room for two columns, so the photo sits above the
 * copy rather than behind it - still no text over an image.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartAIPlan,
  onExplorePackages
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
    trackAIPlanRequested(destination || 'unspecified');
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
    <section id="hero-section" className="relative w-full bg-ivory overflow-hidden">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-20 sm:pt-24 lg:pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-8 lg:gap-12 items-center">

          {/* ---- Words ---- */}
          <div className="order-2 lg:order-1 pb-2 lg:pb-10">
            {/* The eyebrow is inside the h1 so the page's only heading-level-1
                carries the head keyword. */}
            <h1 className="font-serif text-stone-900 tracking-tight mb-4">
              <span className="block text-gold-ink text-[11px] sm:text-xs font-sans-ui font-extrabold uppercase tracking-[0.22em] mb-3">
                Custom India Tour Packages · AI Plans, Experts Perfect
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-[58px] xl:text-[64px] leading-[1.06] font-bold">
                Your Journey.
                <br />
                {/* Green, not gold-on-dark: gold needs a dark surface to be
                    readable and this one is cream. Not italic either - Outfit
                    ships no true italic, so the browser fakes one by slanting
                    the upright. */}
                <span className="text-deep-emerald">Our Passion.</span>
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-[17px] text-[#44403C] leading-relaxed max-w-lg mb-7">
              Personalized travel planning powered by intelligent AI, refined and
              verified by seasoned human destination specialists.
            </p>

            {/* onExplorePackages was passed in by App.tsx and never destructured,
                so this hero had no button at all - only the planner form. */}
            <button
              id="hero-explore-packages-btn"
              type="button"
              onClick={onExplorePackages}
              className="inline-flex items-center gap-2 bg-warm-orange hover:brightness-95 text-cta-ink font-bold text-sm sm:text-[15px] px-6 sm:px-7 py-3 sm:py-3.5 rounded-full transition-all active:scale-[0.98] shadow-xs cursor-pointer"
            >
              <span>Explore Packages</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
          </div>

          {/* ---- Photograph ---- */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3.4] rounded-3xl lg:rounded-[2rem] overflow-hidden shadow-xl">
              {HERO_SLIDES.map((slide, i) => (
                <img
                  key={slide.src}
                  src={slide.src}
                  alt={slide.alt}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                    i === activeSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                />
              ))}
            </div>

            {/* Slide position. Buttons, not dots: a carousel that only advances
                on a timer gives a visitor no way back to a photo they liked. */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-black/45 backdrop-blur-xs">
              {HERO_SLIDES.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => setActiveSlide(i)}
                  aria-label={`Show photo ${i + 1} of ${HERO_SLIDES.length}: ${slide.alt}`}
                  aria-current={i === activeSlide}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    i === activeSlide ? 'w-5 bg-white' : 'w-1.5 bg-white/55 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ---- Search bar, spanning both columns ----
            One row on desktop, stacked on phones, the way the reference lays
            it out. Same three fields and the same handler as before; only the
            arrangement changed. */}
        <div className="relative mt-8 lg:-mt-4 mb-12 sm:mb-14 lg:mb-16 bg-white rounded-2xl sm:rounded-[1.75rem] border border-[#E7E2DA] shadow-lg p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] gap-2.5 lg:gap-0 lg:divide-x lg:divide-[#E7E2DA]">
            <div className="relative lg:pr-4">
              <label htmlFor="hero-destination" className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1 pl-10 lg:pl-9">
                Where to?
              </label>
              <MapPin className="absolute left-3.5 lg:left-3 bottom-2.5 w-4 h-4 text-stone-400 pointer-events-none" aria-hidden="true" />
              <input
                id="hero-destination"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Any destination"
                className="w-full pl-10 lg:pl-9 pr-3 py-1.5 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
              />
            </div>

            <div className="relative lg:px-4">
              <label htmlFor="hero-travelers" className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1 pl-10 lg:pl-11">
                Travellers
              </label>
              <Users className="absolute left-3.5 lg:left-7 bottom-2.5 w-4 h-4 text-stone-400 pointer-events-none" aria-hidden="true" />
              <input
                id="hero-travelers"
                type="number"
                min={1}
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                placeholder="Add guests"
                className="w-full pl-10 lg:pl-11 pr-3 py-1.5 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
              />
            </div>

            <div className="relative lg:px-4">
              <label htmlFor="hero-duration" className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1 pl-10 lg:pl-11">
                Duration
              </label>
              <Calendar className="absolute left-3.5 lg:left-7 bottom-2.5 w-4 h-4 text-stone-400 pointer-events-none z-10" aria-hidden="true" />
              <select
                id="hero-duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full pl-10 lg:pl-11 pr-8 py-1.5 bg-transparent text-sm text-stone-900 focus:outline-none appearance-none cursor-pointer"
              >
                {DURATION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt === 'Trip duration' ? '' : opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 bottom-2.5 w-4 h-4 text-stone-400 pointer-events-none" aria-hidden="true" />
            </div>

            <div className="lg:pl-4 flex items-end">
              <button
                id="hero-plan-with-ai-btn"
                type="button"
                onClick={handlePlanWithAI}
                className="w-full lg:w-auto bg-deep-emerald hover:bg-forest-green text-white px-6 py-3 rounded-xl sm:rounded-2xl lg:rounded-full transition-all cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <AIIcon className="w-4 h-4 text-white shrink-0" aria-hidden="true" />
                <span className="font-bold text-sm">Plan with AI</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
