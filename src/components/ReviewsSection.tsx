import React, { useRef, useState } from 'react';
import { customerReviewsData } from '../data/reviewsAndTrustData';
import { Star, ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react';

/** "Vikram & Ananya Sen" -> "VA". Two letters, first of each name. */
function initials(name: string): string {
  return name
    .split(/\s+|&/)
    .map((w) => w.trim())
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

/**
 * Traveller stories, as a slider.
 *
 * The avatars are initials, not photographs. Each review carries an `avatar`
 * field pointing at an Unsplash portrait - a stranger's face, captioned with a
 * real customer's name and trip. That is a fabricated testimonial in the only
 * way that matters to whoever is reading it, and it sits directly under a
 * section promising verified stays and transparent pricing. A monogram says
 * the same thing about who reviewed without inventing a person.
 *
 * Swap them for real photographs the moment the travellers give permission -
 * the field is already there and already populated.
 *
 * Scrolling is CSS scroll-snap rather than a transform carousel: it keeps
 * native touch momentum on phones, keyboard scrolling works, and the cards
 * stay in the DOM so nothing is hidden from a screen reader or a crawler.
 */
export const ReviewsSection: React.FC = () => {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  };

  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <section id="reviews-section" className="w-full py-14 sm:py-16 lg:py-20 bg-white border-t border-[#D9E6F0]">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 sm:mb-10">
          <div>
            <span className="block text-[11px] font-sans-ui font-extrabold uppercase tracking-[0.22em] text-gold-ink mb-2.5">
              Traveller stories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Loved by couples, families &amp; explorers
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-stone-700">
              {customerReviewsData.length} reviews, every one from a trip we planned.
            </p>
          </div>

          {/* Buttons, not dots: a slider that can only be dragged strands
              anyone using a keyboard or a trackpad without horizontal scroll. */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => nudge(-1)}
              disabled={atStart}
              aria-label="Previous reviews"
              className="w-11 h-11 rounded-full border border-[#D9E6F0] bg-white text-stone-900 flex items-center justify-center transition-colors hover:bg-light-blue disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              disabled={atEnd}
              aria-label="More reviews"
              className="w-11 h-11 rounded-full border border-[#D9E6F0] bg-white text-stone-900 flex items-center justify-center transition-colors hover:bg-light-blue disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <ul
          ref={trackRef}
          onScroll={onScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 -mx-1 px-1"
        >
          {customerReviewsData.map((review) => (
            <li
              key={review.id}
              className="snap-start shrink-0 w-[85%] sm:w-[46%] lg:w-[31%] xl:w-[23.5%] bg-white rounded-2xl border border-[#D9E6F0] p-5 sm:p-6 shadow-[0_2px_10px_rgba(15,23,42,0.05)] flex flex-col"
            >
              <div className="flex items-center gap-1" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warm-orange text-warm-orange" aria-hidden="true" />
                ))}
              </div>

              <p className="mt-4 text-sm text-stone-700 leading-relaxed line-clamp-6 grow">
                “{review.reviewText}”
              </p>

              <div className="mt-5 pt-4 border-t border-[#D9E6F0] flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="shrink-0 w-11 h-11 rounded-full bg-deep-emerald text-white font-sans-ui font-bold text-[13px] flex items-center justify-center tracking-wide"
                >
                  {initials(review.authorName)}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-stone-900 truncate">
                      {review.authorName}
                    </span>
                    <BadgeCheck className="w-3.5 h-3.5 text-deep-emerald shrink-0" aria-hidden="true" />
                  </div>
                  <div className="text-[11.5px] text-stone-600 truncate">
                    {review.destination} · {review.city}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
