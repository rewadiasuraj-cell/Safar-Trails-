import React, { useEffect, useState } from 'react';
import { ArrowRight, MapPin, Calendar, Clock, Users } from 'lucide-react';
import { trackAIPlanRequested } from '../lib/analytics';

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

const DURATION_OPTIONS = ['3-4 Days', '5-7 Days', '8-10 Days', '10+ Days'];

/**
 * The hero, rebuilt to the reference: one rounded photo card inset from the
 * page edge, the headline left-aligned over it, and the trip search floating
 * across the bottom of the card.
 *
 * WHY THE SEARCH MOVED HERE. These four fields were a section of their own one
 * scroll down. That section is gone from the homepage rather than duplicated:
 * two identical search bars on one page is two chances to start the same
 * journey and one more thing to maintain. The reference puts the search in the
 * hero, and it belongs there - it is the first question the business asks.
 *
 * SCRIM. The reference has none, because its photograph happens to be dark
 * where its words sit. Four photographs rotate here, so that cannot be relied
 * on, and white type over a bright sky is unreadable rather than airy. The
 * scrim is therefore as light as the measurements allow and no lighter:
 *
 *   >=1280px  heavy on the left where the words are, clearing to nothing on
 *             the right, so most of the frame is the photograph at full strength
 *   <1280px   one flat veil, because the text spans the width and there is no
 *             clear side to give away
 *
 * The boundary is xl and not lg for a geometric reason. The clearing stop is a
 * percentage of the card's width, but the text column is a fixed 672px. At
 * 1440px the words end around 54% of the card and the gradient is still near
 * full strength there; at 1024px the same column reaches 69%, well into the
 * clear, and the last words of the headline measured 3.01:1. Below 1280px the
 * flat veil takes over. The stop sits at 62% rather than 52% because the photo
 * is now an inset card with its own padding, which pushes the text column
 * further across as a fraction of the card's width.
 *
 * The floor is not a matter of taste. Against a pure-white photograph - the
 * worst thing that could ever load, and with four slides rotating, something
 * close to it eventually will - white text falls below 4.5:1 at about 60%
 * scrim. Everything here is measured against that worst case with the text
 * hidden, so the probe reads the background rather than the glyphs.
 *
 * ENTRANCE. Plain CSS keyframes, not GSAP. The hero is the largest contentful
 * paint; making the first thing a visitor sees wait for a 45 KB JavaScript
 * chunk to download would trade a real number for a decorative one. GSAP runs
 * the scroll reveals further down the page, where the wait costs nothing.
 *
 * AUTOPLAY. Four slides crossfading every six seconds. Only the first is eager
 * and high-priority; the rest load lazily, so the extra three cost nothing
 * before the page can paint. The timer stops while the tab is hidden and never
 * starts for a visitor who asked for reduced motion - a background that changes
 * under you is exactly the vestibular trigger that setting is for. The dots are
 * real buttons, so the carousel is operable without waiting for the timer.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ onStartAIPlan, onExplorePackages }) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const [destination, setDestination] = useState('');
  const [departure, setDeparture] = useState('');
  const [duration, setDuration] = useState('');
  const [guests, setGuests] = useState('');
  const [showExtras, setShowExtras] = useState(false);
  const [dateActive, setDateActive] = useState(false);

  const extras = showExtras ? 'block' : 'hidden';

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || paused) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % HERO_SLIDES.length);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const handleExplore = (e: React.FormEvent) => {
    e.preventDefault();
    trackAIPlanRequested(destination || 'unspecified');

    // Nothing filled in is not an error. It means "show me what you have",
    // which is what the packages grid is for.
    if (!destination && !departure && !duration && !guests) {
      onExplorePackages();
      return;
    }

    const parts: string[] = [`Plan a trip${destination ? ` to ${destination}` : ''}`];
    if (departure) parts.push(`departing ${departure}`);
    if (duration) parts.push(`for ${duration}`);
    if (guests) parts.push(`for ${guests} traveller${guests === '1' ? '' : 's'}`);
    onStartAIPlan(parts.join(' '));
  };

  return (
    <section id="hero-section" className="w-full bg-white pt-[76px] sm:pt-[84px] lg:pt-[92px] pb-2 sm:pb-4">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div
          className="relative overflow-hidden rounded-[20px] sm:rounded-[28px] lg:rounded-[32px] bg-midnight-blue min-h-[540px] sm:min-h-[580px] lg:min-h-[640px] flex flex-col justify-center"
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
          <div className="absolute inset-0 hidden xl:block bg-gradient-to-r from-[#041D33]/92 from-10% via-[#041D33]/72 via-62% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041D33]/45 via-transparent to-[#041D33]/20" />

          <div className="relative z-10 w-full px-5 sm:px-8 lg:px-12 xl:px-14 pt-12 pb-8 sm:pt-16 sm:pb-10 lg:pt-20 lg:pb-12">
            <div className="max-w-2xl">
              {/* The eyebrow is inside the h1 so the page's only heading-level-1
                  carries the head keyword. It is white rather than the sky blue:
                  sky needs a darker scrim than white does to clear 4.5:1, and it
                  was the single thing capping how much photograph could show. */}
              <h1 className="font-serif text-white tracking-tight">
                <span className="hero-in hero-in-1 block text-white text-[11px] sm:text-xs font-sans-ui font-extrabold uppercase tracking-[0.22em] mb-4">
                  Custom India Tour Packages · AI Plans, Experts Perfect
                </span>
                {/* The reference's own headline is not borrowed. The layout is
                    what was asked for; the words are this business's tagline,
                    and the head keyword stays in the eyebrow above, where it
                    was put deliberately. */}
                <span className="hero-in hero-in-2 block text-[40px] sm:text-6xl lg:text-7xl xl:text-[76px] font-bold leading-[1.03] drop-shadow-[0_2px_18px_rgba(4,29,51,0.55)]">
                  Your Journey.
                  <br />
                  Our Passion.
                </span>
              </h1>

              <p className="hero-in hero-in-3 mt-5 sm:mt-6 text-base sm:text-lg text-white leading-relaxed max-w-lg drop-shadow-[0_1px_10px_rgba(4,29,51,0.6)]">
                Personalized travel powered by AI, refined by experts.
              </p>
            </div>

            <form onSubmit={handleExplore} className="hero-in hero-in-4 mt-9 sm:mt-12 lg:mt-16">
              {/* inline-block, not a full-width block. As a block its box ran the
                  whole width of the card and out into the side the gradient
                  clears, so the label was sitting over bare photograph at
                  1.65:1 on a bright slide. */}
              <p className="inline-block text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.18em] text-white mb-3 drop-shadow-[0_1px_10px_rgba(4,29,51,0.6)]">
                Where would you like to go?
              </p>

              <div className="bg-white rounded-2xl sm:rounded-[22px] shadow-[0_18px_50px_-18px_rgba(4,29,51,0.55)] p-2.5 sm:p-2">
                <div id="hero-search-extras" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.9fr_auto] gap-2 lg:gap-0 lg:divide-x lg:divide-[#E2EAF2]">
                  <div className="relative lg:px-4">
                    <label htmlFor="hero-destination" className="sr-only">Destination</label>
                    <MapPin className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" aria-hidden="true" />
                    <input
                      id="hero-destination"
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Type destination"
                      className="w-full pl-9 lg:pl-10 pr-3 py-3 bg-transparent text-sm text-stone-900 placeholder:text-stone-500 focus:outline-none focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-emerald"
                    />
                  </div>

                  <div className={`relative lg:px-4 ${extras} sm:block`}>
                    <label htmlFor="hero-departure" className="sr-only">Departure date</label>
                    <Calendar className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none z-10" aria-hidden="true" />
                    {/* An empty type="date" renders the browser's own format hint -
                        "mm/dd/yyyy" - which is both noise and, for an Indian
                        audience, the wrong order. It stays a text box showing
                        "Departure date" until it is focused, and only then becomes
                        a real date picker. */}
                    <input
                      id="hero-departure"
                      type={dateActive || departure ? 'date' : 'text'}
                      value={departure}
                      onFocus={() => setDateActive(true)}
                      onBlur={() => setDateActive(false)}
                      onChange={(e) => setDeparture(e.target.value)}
                      placeholder="Departure date"
                      aria-label="Departure date"
                      className="w-full pl-9 lg:pl-10 pr-3 py-3 bg-transparent text-sm text-stone-900 placeholder:text-stone-500 focus:outline-none focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-emerald"
                    />
                  </div>

                  <div className={`relative lg:px-4 ${extras} sm:block`}>
                    <label htmlFor="hero-duration" className="sr-only">Trip duration</label>
                    <Clock className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none z-10" aria-hidden="true" />
                    <select
                      id="hero-duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className={`w-full pl-9 lg:pl-10 pr-3 py-3 bg-transparent text-sm focus:outline-none appearance-none cursor-pointer focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-emerald ${duration ? 'text-stone-900' : 'text-stone-500'}`}
                    >
                      <option value="">Duration</option>
                      {DURATION_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className={`relative lg:px-4 ${extras} sm:block`}>
                    <label htmlFor="hero-guests" className="sr-only">Number of travellers</label>
                    <Users className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" aria-hidden="true" />
                    <input
                      id="hero-guests"
                      type="number"
                      min={1}
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      placeholder="Guests"
                      className="w-full pl-9 lg:pl-10 pr-3 py-3 bg-transparent text-sm text-stone-900 placeholder:text-stone-500 focus:outline-none focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-emerald"
                    />
                  </div>

                  {/* Phones only. Four stacked fields made the hero 1300px tall
                      and asked for three answers nobody has yet; on a phone the
                      only question that has to be on screen is where. The rest
                      are one tap away and always present from 640px up, so
                      nothing is hidden on the layout the reference is drawn
                      for. */}
                  <button
                    type="button"
                    onClick={() => setShowExtras((v) => !v)}
                    aria-expanded={showExtras}
                    aria-controls="hero-search-extras"
                    className="sm:hidden text-left px-3 pb-1 pt-1 text-[13px] font-semibold text-gold-ink underline underline-offset-4 cursor-pointer"
                  >
                    {showExtras ? 'Hide dates & travellers' : 'Add dates, duration & travellers'}
                  </button>

                  {/* The glow is a coloured box-shadow rather than a filter: no
                      extra compositing layer, and it scales with the button. */}
                  <button
                    id="hero-plan-trip-cta"
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 bg-warm-orange hover:brightness-105 text-cta-ink font-bold text-[15px] px-7 py-3.5 rounded-xl sm:rounded-2xl transition-all active:scale-[0.98] cursor-pointer shadow-[0_8px_26px_-8px_rgba(255,133,52,0.85)] whitespace-nowrap"
                  >
                    <span>Explore Now</span>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Slide position, and the only way back to a photo you liked. */}
          <div className="absolute top-5 right-5 sm:top-7 sm:right-8 lg:right-12 z-10 flex items-center gap-2">
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
        </div>
      </div>
    </section>
  );
};
