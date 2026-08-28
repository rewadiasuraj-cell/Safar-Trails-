// Google Analytics 4 (gtag.js) integration.
//
// The gtag.js library is injected here (not in index.html) so the measurement
// ID reliably comes from an env var with a build-time-safe fallback - Vite's
// `%ENV_VAR%` HTML placeholder only substitutes when an actual `.env` file
// defines the var, so it silently breaks in environments that only ship
// `.env.example`. This module also fires a page_view on every route change,
// since gtag's default auto-pageview only fires once, on initial script load,
// which isn't enough for a client-side-routed SPA.

export const GA_MEASUREMENT_ID: string = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-0VMQX8NMJZ';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;

/** Loads gtag.js and configures it once, with automatic pageviews disabled (trackPageView sends them instead). */
export function initGA(): void {
  if (initialized || typeof window === 'undefined' || typeof document === 'undefined' || !GA_MEASUREMENT_ID) {
    return;
  }
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

/** Sends a GA4 page_view event for the given route. Call this on every React Router navigation, including the initial one. */
export function trackPageView(path: string, title?: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function' || !GA_MEASUREMENT_ID) {
    return;
  }
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
}
