/**
 * One GSAP instance, loaded once, off the critical path.
 *
 * GSAP plus ScrollTrigger is about 45 KB gzipped. The homepage's largest
 * contentful paint is the hero photograph, and nothing about a scroll reveal
 * needs to be decided before that paints - so this is a dynamic import. The
 * first component that wants it starts the download; everyone after gets the
 * same promise.
 *
 * It never rejects. If the chunk fails, callers get null and simply do not
 * animate, which is the correct failure mode for decoration.
 */

type GsapApi = {
  gsap: typeof import('gsap').gsap;
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
};

let pending: Promise<GsapApi | null> | null = null;

export function loadGsap(): Promise<GsapApi | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (pending) return pending;

  pending = Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
    .then(([core, plugin]) => {
      const gsap = core.gsap;
      const ScrollTrigger = plugin.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    })
    .catch(() => null);

  return pending;
}

/**
 * A visitor who asked their operating system to reduce motion has asked for
 * exactly this: things that move on their own as the page scrolls. Checked at
 * call time rather than cached, because the setting can be changed while the
 * tab is open.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
