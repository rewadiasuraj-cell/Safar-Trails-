/**
 * Single source of truth for brand-level NAP (Name, Address, Phone) and social
 * identity.
 *
 * The September 2026 audit flagged NAP inconsistency as a HIGH priority issue:
 * the website footer advertised +91 80766 65782 while social profiles used
 * +91 85008 19000. Google needs one identical phone/address/name across the
 * website, Google Business Profile, Facebook and Instagram, so every surface in
 * this codebase now reads those values from here. Changing the number in this
 * file changes it everywhere on the site at once.
 */

export const SITE_URL = 'https://safartrails.co.in';

export const BRAND_NAME = 'Safar Trails';

/** Legacy one-word spelling still used in body copy; kept so both are searchable. */
export const BRAND_NAME_COMPACT = 'SafarTrails';

export const BRAND_TAGLINE = 'Travel with Trust';

/**
 * The one primary phone number. Must match Google Business Profile, Facebook
 * and Instagram exactly.
 */
export const PRIMARY_PHONE = '+918076665782';
export const PRIMARY_PHONE_DISPLAY = '+91 80766 65782';

/** Digits only, no '+', for wa.me links. */
export const WHATSAPP_NUMBER = '918076665782';

/**
 * The address the site SHOWS - footer, contact page, Organization schema.
 *
 * The audit recommended moving off the Gmail address: on a business taking
 * ₹25,000+ bookings it costs trust at exactly the moment someone is deciding
 * whether to send money. Switching is one edit here once info@safartrails.co.in
 * exists and receives mail - not before, or every enquiry sent to it bounces.
 */
export const PRIMARY_EMAIL = 'info@safartrails.co.in';

/**
 * Where quote enquiries are DELIVERED. Separate from PRIMARY_EMAIL on purpose:
 * the displayed address is branding, this one is the inbox a lead lands in, and
 * they can safely differ (a branded address forwarding to a mailbox someone
 * actually reads is the normal setup).
 *
 * This was hardcoded in three places - server.ts, functions/api/quotes.ts and
 * functions/api/send-quote-email.ts - so changing it meant finding all three, and
 * missing one meant silently dropping leads down a mailbox nobody checks.
 *
 * Deliberately still the Gmail address, even though the site now DISPLAYS
 * info@safartrails.co.in. That address is a Cloudflare Email Routing forward,
 * not a mailbox - mail to it takes an extra hop before landing in the same
 * Gmail. Pointing leads through that hop adds a place for them to go missing and
 * a second chance to be marked spam, for no gain: the destination is identical.
 *
 * Change this ONLY to an address that is confirmed to receive mail. Send a test
 * enquiry through the form afterwards and make sure it arrives.
 */
export const LEAD_NOTIFICATION_EMAIL = 'info.safartrails@gmail.com';

/**
 * The website footer and the Google Business Profile listing disagreed on the
 * street line: the site said "Dwarka Mor", the profile said "Nawada". Same
 * building, but Google reads two descriptions as two signals and trusts neither
 * fully, which costs local ranking.
 *
 * The owner confirmed the PROFILE is the correct one, so the site now matches
 * it. The verified listing is the authority here: it is the record Google ranks
 * in the Maps pack, so the website moves to it rather than the other way round.
 *
 * Every surface reads from this one object - footer, JSON-LD PostalAddress,
 * contact page - so the site cannot drift out of agreement with the profile
 * again from a single forgotten edit.
 *
 * If this is ever changed, the Google Business Profile must be changed to match
 * in the same sitting, character for character.
 */
export const POSTAL_ADDRESS = {
  streetAddress:
    'First Floor, Plot No. 02, Pillar No. 786, Jai Bharat Enclave, Bhagwati Garden, Nawada',
  addressLocality: 'New Delhi',
  addressRegion: 'Delhi',
  postalCode: '110059',
  addressCountry: 'IN',
} as const;

/** The same address as one display string, so the footer cannot drift from the schema. */
export const DISPLAY_ADDRESS = `${POSTAL_ADDRESS.streetAddress}, ${POSTAL_ADDRESS.addressLocality} ${POSTAL_ADDRESS.postalCode}`;

export const GEO = {
  latitude: 28.6139,
  longitude: 77.0421,
} as const;

/**
 * Google Business Profile links.
 *
 * GOOGLE_REVIEW_URL should be the short "write a review" link from the profile
 * (Business Profile → Ask for reviews → copy link). It looks like
 * https://g.page/r/XXXXXXXXXXXX/review. Until that is pasted in, the site links
 * to the Maps listing instead, which still lets people read and leave reviews -
 * it is just one extra tap.
 *
 * This is the ONLY review claim the site should make: a link to the real
 * profile, where the rating can be verified. See docs/README.md on why the
 * hardcoded review counts were removed.
 */
export const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/Safar+Trails+Jai+Bharat+Encl+Nawada+New+Delhi';
export const GOOGLE_REVIEW_URL = 'https://g.page/r/CTW1s_2ahEdtEBM/review';

/** Falls back to the Maps listing until the short review link is filled in. */
export const reviewLink = (): string => GOOGLE_REVIEW_URL || GOOGLE_MAPS_URL;

export const SOCIAL_PROFILES = [
  'https://www.facebook.com/safartrails/',
  'https://www.instagram.com/safartrails.in/',
];

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/**
 * Organization-level aggregateRating in JSON-LD.
 *
 * Deliberately disabled. Google's review-snippet policy only allows ratings
 * that are collected and displayed by the site itself, and the homepage shows
 * four on-site testimonials - not a statistically meaningful aggregate. Turning
 * this on with numbers copied from Google Business Profile would be a policy
 * violation (Google's own reviews may not be re-marked-up as your own).
 *
 * Enable it only once genuine, on-site, user-submitted reviews are collected
 * and rendered on the page, and set the counts to the real totals.
 */
export const ORGANIZATION_RATING_ENABLED = false;
export const ORGANIZATION_RATING = { ratingValue: '4.9', reviewCount: '127' };

/**
 * Tax, and how the site says so.
 *
 * Prices in content/ are what the customer pays. Tax is inside the number, not
 * added at the quote, and every price on the site carries this note so that is
 * unambiguous.
 *
 * It used to be the other way round - prices were pre-tax and the site added
 * "+5% GST" next to them. Changed on the owner's instruction, and it matches
 * how the packages are briefed: the Manali brief lists "Applicable taxes" under
 * inclusions and quotes one all-in figure.
 *
 * Whatever this says, the number beside it and the figures written into FAQs
 * and package copy have to agree. The pre-tax version drifted exactly there,
 * which is why the note is one constant rather than a phrase typed per page.
 *
 * Prices on the Google Business Profile are entered tax-inclusive too, because
 * Google's Activities editor asks for the total - so those now match the site
 * directly and need no conversion.
 */
export const GST_NOTE = 'including tax';

/** Absolute-URL helper that tolerates paths with or without a leading slash. */
export function absoluteUrl(pathname: string): string {
  if (/^https?:\/\//i.test(pathname)) return pathname;
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}
