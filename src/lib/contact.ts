/**
 * One place for "contact us" actions.
 *
 * Previously the WhatsApp number was hardcoded in eleven components and the
 * phone number in three more, which is how the site ended up advertising a
 * different number from the one on the social profiles - the NAP inconsistency
 * the audit flagged. Every enquiry action now reads the number from
 * siteConfig and reports a GA4 conversion event on the way out, so WhatsApp
 * and call volume are measurable before any Ads budget is spent.
 */

import { trackPhoneCallClick, trackWhatsAppClick } from './analytics';
import { PRIMARY_PHONE, WHATSAPP_NUMBER } from './seo/siteConfig';

/**
 * Opens a WhatsApp chat with a prefilled message.
 *
 * @param message  Plain text; encoded here, so callers must not pre-encode.
 * @param source   Where the click came from (e.g. 'sticky_widget'). Becomes the
 *                 GA4 event's `source` param, which is what makes it possible
 *                 to tell which CTA actually drives enquiries.
 */
export function openWhatsApp(message: string, source: string, destination?: string): void {
  trackWhatsAppClick(source, destination);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function callPhone(source: string): void {
  trackPhoneCallClick(source);
  window.location.href = `tel:${PRIMARY_PHONE}`;
}

/** Same message shape everywhere, so the inbox reads consistently. */
export function enquiryMessage(destination?: string): string {
  return destination
    ? `Hi Safar Trails! I am planning a trip to ${destination}. Please share a custom itinerary, stay options and cost estimate.`
    : 'Hi Safar Trails! I am planning a holiday in India. Please share a custom itinerary, stay options and cost estimate.';
}
