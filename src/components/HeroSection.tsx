import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onStartAIPlan: (promptText?: string) => void;
  onExplorePackages: () => void;
  onOpenQuoteModal: () => void;
}

const HERO_SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=2000&auto=format&fit=crop',
    alt: 'Houseboats on Dal Lake, Kashmir, below the snow line',
  },
  {
    src: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2000&auto=format&fit=crop',
    alt: 'Kerala backwaters, a canal lined with coconut palms',
  },
  {
    src: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2000&auto=format&fit=crop',
    alt: 'Rajasthan — desert dunes and a heritage fort at dusk',
  },
  {
    src: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2000&auto=format&fit=crop',
    alt: 'A Goa beach at golden hour',
  },
];

const SLIDE_MS = 6000;

/**
 * Full-bleed photograph, words over it, one call to action.
 *
 * SCRIM. This is the whole difficulty with a hero like this, and the project
 * has been round it three times: a near-opaque navy that hid the photo; a
 * split layout that dodged the question; and one directional gradient used at
 * every width, which measured 1.67:1 on a 390px phone because it clears to
 * 20% on the right and on a phone the text block IS the viewport.
 *
 * The scrim is now as light as the numbers allow, so the photographs carry
 * the page:
 *
 *   >=1280px  the left stays heavy where the words are and the right clears to
 *             nothing, so most of the frame is the photograph at full strength
 *   <1280px   one flat veil, because the text spans the width and there is no
 *             clear side to give away
 *
 * The boundary is xl and not lg for a geometric reason. The clearing stop is a
 * percentage of the viewport, but the text column is a fixed 672px. At 1440px
 * the words end around 56% of the width and the gradient is still near full
 * strength there; at 1024px the same column reaches 69%, well into the clear,
 * and the last words of the headline measured 3.01:1. Below 1280px there is no
 * width to give away, so the flat veil takes over.
 *
 * The floor is not a matter of taste. Against a pure-white photograph - the
 * worst thing that could ever load, and with four slides rotating, something
 * close to it eventually will - white text falls below 4.5:1 at about 60%
 * scrim. Everything here is measured against that worst case with the text
 * hidden, so the probe reads the background rather than the glyphs.
 *
 * AUTOPLAY. Four slides crossfading every six seconds. Only the first is
 * eager and high-priority; the rest load lazily, so the extra three cost
 * nothing before the page can paint. The timer stops while the tab is hidden
 * and never starts for a visitor who asked for reduced motion - a background
 * that changes under you is exactly the vestibular trigger that setting is
 * for. The dots are real buttons, so the carousel is operable without waiting
 * for the timer.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ onExplorePackages, onOpenQuoteModal }) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || paused) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % HERO_SLIDES.length);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section
      id="hero-section"
      className="relative w-full min-h-[560px] sm:min-h-[620px] lg:min-h-[720px] flex items-center overflow-hidden bg-midnight-blue"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {HERO_SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={i === 0 ? slide.alt : ''}
          aria-hidden={i !== 0}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[1200ms] ease-in-out ${
            i === active ? 'opacity-100' : 'opacity-0'
          }`}
          fetchPriority={i === 0 ? 'high' : 'auto'}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}

      <div className="absolute inset-0 bg-[#041D33]/68 xl:hidden" />
      <div className="absolute inset-0 hidden xl:block bg-gradient-to-r from-[#041D33]/92 from-10% via-[#041D33]/72 via-52% to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#041D33]/45 via-transparent to-[#041D33]/20" />

      <div className="relative z-10 w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20">
        <div className="max-w-2xl">
          {/* The eyebrow is inside the h1 so the page's only heading-level-1
              carries the head keyword. It is white rather than the sky blue:
              sky needs a darker scrim than white does to clear 4.5:1, and it
              was the single thing capping how much photograph could show. */}
          <h1 className="font-serif text-white tracking-tight">
            <span className="block text-white text-[11px] sm:text-xs font-sans-ui font-extrabold uppercase tracking-[0.22em] mb-4">
              Custom India Tour Packages · AI Plans, Experts Perfect
            </span>
            <span className="block text-[44px] sm:text-6xl lg:text-7xl xl:text-[80px] font-bold leading-[1.02] drop-shadow-[0_2px_18px_rgba(4,29,51,0.55)]">
              Your Journey.
              <br />
              Our Passion.
            </span>
          </h1>

          <p className="mt-5 sm:mt-6 text-base sm:text-lg lg:text-xl text-white leading-relaxed max-w-lg drop-shadow-[0_1px_10px_rgba(4,29,51,0.6)]">
            Personalized travel powered by AI, refined by experts.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* The glow is a coloured box-shadow rather than a filter: no extra
                compositing layer, and it scales with the button. */}
            <button
              id="hero-plan-trip-cta"
              type="button"
              onClick={onOpenQuoteModal}
              className="inline-flex items-center justify-center gap-2 bg-warm-orange hover:brightness-105 text-cta-ink font-bold text-[15px] sm:text-base px-7 sm:px-9 py-3.5 sm:py-4 rounded-full transition-all active:scale-[0.98] cursor-pointer shadow-[0_8px_30px_-6px_rgba(255,133,52,0.75)] hover:shadow-[0_10px_38px_-6px_rgba(255,133,52,0.9)]"
            >
              <span>Plan My Trip</span>
              <ArrowRight className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" aria-hidden="true" />
            </button>

            <button
              id="hero-explore-packages-btn"
              type="button"
              onClick={onExplorePackages}
              className="inline-flex items-center justify-center gap-2 border border-white/60 hover:border-white bg-[#041D33]/35 hover:bg-[#041D33]/55 text-white font-semibold text-[15px] sm:text-base px-7 py-3.5 sm:py-4 rounded-full transition-colors cursor-pointer backdrop-blur-xs"
            >
              <span>Explore Packages</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide position, and the only way back to a photo you liked. */}
      <div className="absolute bottom-5 sm:bottom-7 left-4 sm:left-6 lg:left-8 xl:left-12 2xl:left-16 z-10 flex items-center gap-2">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show photo ${i + 1} of ${HERO_SLIDES.length}: ${slide.alt}`}
            aria-current={i === active}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              i === active ? 'w-7 bg-white' : 'w-1.5 bg-white/55 hover:bg-white/85'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
