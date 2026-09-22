import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { Shot } from '../../lib/packageMedia';

interface PackageGalleryProps {
  shots: Shot[];
  /** Used in the "photos of X" line under the strip. */
  destination: string;
}

/**
 * The photographs for a package page.
 *
 * A package page was one hero image followed by three tabs of text, which is
 * what buyers were reacting to. Everything here was already in the repo and
 * rendered nowhere: `galleryImages` on all 23 packages, and 47 captioned
 * photographs of named attractions across the destinations.
 *
 * It renders nothing below three photographs. Two pictures in a grid built for
 * five looks like a page that failed to load, and six of the 23 packages
 * genuinely do not have three distinct images yet - the honest answer there is
 * for the operator to send real ones, not for this component to pad.
 *
 * The caption under each photo is the place, and it is only shown where the
 * site already states what the picture is; see packageMedia.ts for why an
 * unrecognised photograph stays uncaptioned.
 *
 * The lightbox is a real <dialog> opened with showModal(). That buys the focus
 * trap, the Escape key, inert background and the top layer from the platform
 * rather than from three hundred lines of React that get it subtly wrong.
 */
export const PackageGallery: React.FC<PackageGalleryProps> = ({ shots, destination }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  const show = useCallback((i: number) => {
    setOpen(i);
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
    setOpen(null);
  }, []);

  const step = useCallback(
    (delta: number) => setOpen((i) => (i === null ? null : (i + delta + shots.length) % shots.length)),
    [shots.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, step]);

  if (shots.length < 3) return null;

  const [lead, ...rest] = shots;
  const tiles = rest.slice(0, 4);
  const current = open === null ? null : shots[open];

  return (
    <section aria-labelledby="package-gallery-heading" className="w-full bg-white border-b border-stone-200">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h2 id="package-gallery-heading" className="sr-only">
          Photos from this trip
        </h2>

        {/* One tall photo and a grid of the rest, which is the shape that works
            when the count varies between three and eight. Below sm it is a
            scroll-snap strip: four tiles stacked on a phone is a screen and a
            half of pictures before the itinerary starts. */}
        <div className="sm:grid sm:grid-cols-4 sm:grid-rows-2 sm:gap-2.5 sm:h-[420px] flex gap-2.5 overflow-x-auto scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
          <button
            type="button"
            onClick={() => show(0)}
            className="group relative shrink-0 w-[78vw] h-56 sm:w-auto sm:h-auto sm:col-span-2 sm:row-span-2 rounded-2xl overflow-hidden snap-start cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-emerald"
          >
            <img
              src={lead.src}
              alt={lead.alt}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-[#041D33]/55 via-transparent to-transparent" />
            {/* A plate behind the words, not a gradient under them. The
                gradient was sized as a percentage of the tile, so the same
                caption measured 5.18:1 on the tall tile and 3.84:1 on a short
                one against a bright photograph - a fail that moved with the
                breakpoint. A fixed plate is the same everywhere: white on
                #041D33 at 80% is 9.2:1 over the worst photo there is. */}
            {lead.caption && (
              <span className="absolute left-3 bottom-3 max-w-[calc(100%-1.5rem)] px-2.5 py-1.5 rounded-lg bg-[#041D33]/80 text-left text-sm font-bold text-white">
                {lead.caption}
              </span>
            )}
            <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Expand className="w-4 h-4 text-stone-900" aria-hidden="true" />
            </span>
          </button>

          {tiles.map((shot, i) => (
            <button
              key={shot.src}
              type="button"
              onClick={() => show(i + 1)}
              className="group relative shrink-0 w-[62vw] h-56 sm:w-auto sm:h-auto rounded-2xl overflow-hidden snap-start cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-emerald"
            >
              <img
                src={shot.src}
                alt={shot.alt}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-[#041D33]/45 via-transparent to-transparent" />
              {/* The last tile says how many more there are rather than
                  silently swallowing them - and then it is the count that is
                  the label, so the caption stands down instead of sitting
                  under it. */}
              {i === tiles.length - 1 && shots.length > 5 ? (
                <span className="absolute inset-0 bg-[#041D33]/75 flex items-center justify-center text-white font-bold text-base">
                  +{shots.length - 5} more
                </span>
              ) : (
                shot.caption && (
                  <span className="absolute left-2.5 bottom-2.5 max-w-[calc(100%-1.25rem)] px-2 py-1 rounded-lg bg-[#041D33]/80 text-left text-[11px] font-bold text-white leading-tight">
                    {shot.caption}
                  </span>
                )
              )}
            </button>
          ))}
        </div>

        {/* Said plainly, because it is what these are. They are photographs of
            the places on this itinerary, not of the hotel you will be given. */}
        <p className="mt-3 text-[11px] sm:text-xs text-stone-500">
          Photos of places on this itinerary in {destination}. Your exact hotel and room
          photos come with the quote.
        </p>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(null)}
        onClick={(e) => { if (e.target === dialogRef.current) close(); }}
        aria-label="Trip photos"
        className="backdrop:bg-[#041D33]/85 bg-transparent p-0 max-w-none max-h-none w-full h-full"
      >
        {current && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-4 py-6">
            <img
              src={current.src}
              alt={current.alt}
              className="max-w-[min(1100px,92vw)] max-h-[74vh] w-auto h-auto object-contain rounded-xl"
            />
            <p className="text-sm text-white text-center max-w-xl">
              {current.caption || current.alt}
              <span className="block mt-1 text-xs text-white/70">
                {(open ?? 0) + 1} of {shots.length}
              </span>
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 border border-white/40 flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 text-white" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={close}
                className="px-5 h-11 rounded-full bg-white text-stone-900 font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
                <span>Close</span>
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 border border-white/40 flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
};
