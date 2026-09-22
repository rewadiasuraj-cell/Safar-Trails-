import React, { useEffect, useRef } from 'react';
import { loadGsap, prefersReducedMotion } from '../lib/animate/gsap';

interface RevealProps {
  children: React.ReactNode;
  /** How far the element travels on the way in, in pixels. */
  y?: number;
  /** Seconds before it starts, once its trigger fires. */
  delay?: number;
  /**
   * Animate the direct children one after another instead of the wrapper as a
   * whole. Use it on card grids; the value is the gap between each child.
   */
  stagger?: number;
  /** CSS selector for what to stagger, when the direct children are wrappers. */
  selector?: string;
  className?: string;
}

/**
 * Scroll reveal, the version that cannot hide the page.
 *
 * The obvious implementation - `opacity: 0` in CSS, GSAP fades it back - breaks
 * three things this site has spent real effort on. The prerendered HTML exists
 * so a crawler and a no-JS visitor get the full text of every page; starting at
 * zero opacity hands them a blank one. And because GSAP is loaded
 * asynchronously, anything above the fold would be blank from first paint until
 * the chunk arrives, which is a flash rather than an animation.
 *
 * So nothing is hidden by CSS and nothing is hidden before GSAP is in hand.
 * When it arrives, each element is measured: if it is already on screen it is
 * left exactly as it is, and only what is still below the fold is set up to
 * animate. The result is that the top of the page is fully painted and readable
 * from the first frame, and the reveal happens where a reveal can actually be
 * seen - as you scroll into it.
 *
 * `prefers-reduced-motion` skips the whole thing. Nothing is ever hidden, so
 * there is nothing to restore.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  y = 28,
  delay = 0,
  stagger = 0,
  selector,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    loadGsap().then((api) => {
      if (!api || cancelled || !ref.current) return;
      const { gsap, ScrollTrigger } = api;

      // Already on screen: leave it alone. Fading in something the visitor is
      // looking at is a flicker, not a reveal.
      const box = ref.current.getBoundingClientRect();
      if (box.top < window.innerHeight * 0.92) return;

      ctx = gsap.context(() => {
        const targets = stagger
          ? Array.from(
              ref.current!.querySelectorAll<HTMLElement>(selector || ':scope > *'),
            )
          : [ref.current!];
        if (!targets.length) return;

        gsap.set(targets, { opacity: 0, y });
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay,
          ease: 'power2.out',
          stagger,
          // Clear the inline transform afterwards: leaving one behind creates a
          // containing block, which quietly breaks any `position: fixed` child.
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: ref.current!,
            start: 'top 88%',
            once: true,
          },
        });
      }, ref.current);

      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [y, delay, stagger, selector]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
