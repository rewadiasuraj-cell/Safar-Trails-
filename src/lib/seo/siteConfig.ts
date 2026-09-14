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
 * Branded email. The audit recommended moving off info.safartrails@gmail.com;
 * until the mailbox exists, PRIMARY_EMAIL_FALLBACK is what the site displays.
 */
export const PRIMARY_EMAIL = 'info.safartrails@gmail.com';

/**
 * The website footer and the Google Business Profile listing disagreed on the
 * street line ("Dwarka Mor" on site, "Nawada" on GBP). This is the site's own,
 * fuller version and is now used by the footer, the JSON-LD and anywhere else
 * the address appears.
 *
 * ACTION FOR THE OWNER: make the Google Business Profile address match this
 * string character for character. NAP consistency is a direct local-ranking
 * factor, and a listing that disagrees with the site weakens both.
 */
export const POSTAL_ADDRESS = {
  streetAddress:
    'First Floor, Plot No. 02, Jai Bharat Enclave, Bhagwati Garden, Metro Pillar No. 786, Dwarka Mor',
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
export const GOOGLE_REVIEW_URL = '';

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

/** Absolute-URL helper that tolerates paths with or without a leading slash. */
export function absoluteUrl(pathname: string): string {
  if (/^https?:\/\//i.test(pathname)) return pathname;
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}
