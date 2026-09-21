import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onStartAIPlan: (promptText?: string) => void;
  onExplorePackages: () => void;
  onOpenQuoteModal: () => void;
}

/** Dal Lake at Nigeen — the shot the Kashmir package actually sells. */
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=2000&auto=format&fit=crop';
const HERO_ALT = 'Houseboats on Dal Lake, Kashmir, below the snow line';

/**
 * Full-bleed photograph, words over it, one call to action.
 *
 * The scrim is the whole problem with a hero like this, and this project has
 * got it wrong twice: first a near-opaque navy poured over two thirds of the
 * frame, so the photograph may as well not have been downloaded; then a split
 * layout that dodged the question by keeping text off the image entirely.
 *
 * This one is measured against the worst photograph that could ever load -
 * the test fills the img with pure white - and sampled from the pixels
 * actually painted behind the text, with the text hidden so the probe reads
 * the background and not the glyphs. White clears 9.04:1 at 1440px and
 * 9.78:1 at 390, 820 and 320; the sky-blue eyebrow clears 5.75:1 and 6.22:1.
 *
 * One image, not a carousel. A rotating background costs three more downloads
 * before the page can settle, and the timer used to move the picture out from
 * under a visitor mid-sentence.
 *
 * The three planner fields that used to sit under this hero moved into
 * AIPlannerTeaser, which is now a real search rather than a banner - the hero
 * had a "Where to?" bar and the section below it had a "Plan with AI" button
 * that did the same thing.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ onExplorePackages, onOpenQuoteModal }) => (
  <section
    id="hero-section"
    className="relative w-full min-h-[560px] sm:min-h-[620px] lg:min-h-[720px] flex items-center overflow-hidden bg-midnight-blue"
  >
    <img
      src={HERO_IMAGE}
      alt={HERO_ALT}
      className="absolute inset-0 w-full h-full object-cover object-center"
      fetchPriority="high"
      loading="eager"
    />
    {/* Two scrims, and which one runs depends on the width - the first attempt
        used the directional one everywhere and measured 1.67:1 on a 390px
        phone. A left-to-right gradient clearing to 20% assumes the text
        occupies the left third; on a phone the text block is the whole
        viewport, so its right-hand words sat on the part that was almost
        transparent. Phones get a flat scrim instead. */}
    <div className="absolute inset-0 bg-[#041D33]/82 lg:hidden" />
    <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-[#041D33]/94 via-[#041D33]/80 to-[#041D33]/25" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#041D33]/60 via-transparent to-[#041D33]/30" />

    <div className="relative z-10 w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20">
      <div className="max-w-2xl">
        {/* The eyebrow is inside the h1 so the page's only heading-level-1
            carries the head keyword. */}
        <h1 className="font-serif text-white tracking-tight">
          <span className="block text-[#93D7FB] text-[11px] sm:text-xs font-sans-ui font-extrabold uppercase tracking-[0.22em] mb-4">
            Custom India Tour Packages · AI Plans, Experts Perfect
          </span>
          <span className="block text-[44px] sm:text-6xl lg:text-7xl xl:text-[80px] font-bold leading-[1.02]">
            Your Journey.
            <br />
            Our Passion.
          </span>
        </h1>

        <p className="mt-5 sm:mt-6 text-base sm:text-lg lg:text-xl text-white leading-relaxed max-w-lg">
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
            className="inline-flex items-center justify-center gap-2 border border-white/45 hover:border-white hover:bg-white/10 text-white font-semibold text-[15px] sm:text-base px-7 py-3.5 sm:py-4 rounded-full transition-colors cursor-pointer backdrop-blur-xs"
          >
            <span>Explore Packages</span>
          </button>
        </div>
      </div>
    </div>
  </section>
);
