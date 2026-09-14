// Google Analytics 4 (gtag.js) integration.
//
// The gtag.js library is injected here (not in index.html) so the measurement
// ID reliably comes from an env var with a build-time-safe fallback - Vite's
// `%ENV_VAR%` HTML placeholder only substitutes when an actual `.env` file
// defines the var, so it silently breaks in environments that only ship
// `.env.example`. This module also fires a page_view on every route change,
// since gtag's default auto-pageview only fires once, on initial script load,
// which isn't enough for a client-side-routed SPA.
//
// The audit flagged that no GA4 tag was visible in the served HTML and that no
// conversion events existed at all - which would have made any Google Ads spend
// unmeasurable. The trackXxx helpers below are the conversion surface: every
// lead-generating interaction on the site funnels through one of them, so the
// same event names can be imported into Google Ads as conversion actions.

export const GA_MEASUREMENT_ID: string = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-0VMQX8NMJZ';

/**
 * Google Ads conversion ID (AW-XXXXXXXXX). Optional: when set, gtag is also
 * configured for Ads so imported GA4 conversions and remarketing audiences work
 * without a second tag. Leave unset until the Ads account exists.
 */
export const GOOGLE_ADS_ID: string = import.meta.env.VITE_GOOGLE_ADS_ID || '';

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

  if (GOOGLE_ADS_ID) {
    window.gtag('config', GOOGLE_ADS_ID);
  }

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

/** Low-level event sender. Safe to call before gtag loads - the call is simply dropped. */
export function trackEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, {
    ...params,
    page_path: window.location.pathname,
  });
}

/* ------------------------------------------------------------------ *
 * Conversion events
 *
 * Import these four as conversion actions in Google Ads:
 *   whatsapp_click, phone_call_click, quote_submitted, ai_plan_generated
 * ------------------------------------------------------------------ */

/** WhatsApp is the #1 travel enquiry channel in India - this is the primary micro-conversion. */
export function trackWhatsAppClick(source: string, destination?: string): void {
  trackEvent('whatsapp_click', { source, destination: destination || 'unspecified' });
}

export function trackPhoneCallClick(source: string): void {
  trackEvent('phone_call_click', { source });
}

/** Fired when the enquiry form is submitted, before the network round-trip. */
export function trackQuoteFormSubmit(destination: string, source: string): void {
  trackEvent('quote_submitted', { destination, source, currency: 'INR' });
}

/** Fired only after the server confirms the lead, so it can be counted as the hard conversion. */
export function trackQuoteFormSuccess(destination: string, leadId?: string): void {
  trackEvent('generate_lead', { destination, lead_id: leadId || '', currency: 'INR' });
}

export function trackAIPlanGenerated(destination: string, days?: number): void {
  trackEvent('ai_plan_generated', { destination, trip_days: days ?? 0 });
}

export function trackAIPlanRequested(destination: string): void {
  trackEvent('ai_plan_requested', { destination });
}

/** Engagement signals - useful for remarketing audiences, not as conversions. */
export function trackPackageView(packageSlug: string, destination: string): void {
  trackEvent('view_package', { package_slug: packageSlug, destination });
}

export function trackSearch(searchTerm: string): void {
  trackEvent('search', { search_term: searchTerm });
}
