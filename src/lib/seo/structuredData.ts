/**
 * JSON-LD builders.
 *
 * The audit found only two site-wide blocks (TravelAgency + WebSite) and no
 * per-page markup at all, so no destination, package or guide page could
 * qualify for a rich result. Each builder below returns a plain object that
 * either the <Seo> component (client) or the prerender script (build time)
 * serialises into a <script type="application/ld+json"> tag.
 */

import { Destination, Package, TravelGuide } from '../../types';
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  DEFAULT_OG_IMAGE,
  GEO,
  ORGANIZATION_RATING,
  ORGANIZATION_RATING_ENABLED,
  POSTAL_ADDRESS,
  PRIMARY_EMAIL,
  PRIMARY_PHONE,
  GOOGLE_MAPS_URL,
  SITE_URL,
  SOCIAL_PROFILES,
  absoluteUrl,
} from './siteConfig';

export type JsonLd = Record<string, unknown>;

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** TravelAgency is a LocalBusiness subtype, so it carries the full NAP block. */
export function travelAgencySchema(): JsonLd {
  const schema: JsonLd = {
    '@type': 'TravelAgency',
    '@id': ORGANIZATION_ID,
    name: BRAND_NAME,
    alternateName: 'SafarTrails',
    slogan: BRAND_TAGLINE,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    image: DEFAULT_OG_IMAGE,
    description:
      'Indian travel agency crafting custom tour packages across India and abroad — hand-planned itineraries, verified stays, transparent pricing and 24x7 on-trip support.',
    telephone: PRIMARY_PHONE,
    email: PRIMARY_EMAIL,
    priceRange: '₹₹ - ₹₹₹₹',
    address: { '@type': 'PostalAddress', ...POSTAL_ADDRESS },
    geo: { '@type': 'GeoCoordinates', latitude: GEO.latitude, longitude: GEO.longitude },
    areaServed: { '@type': 'Country', name: 'India' },
    // Ties the site to the Google Business Profile listing, so Google reads the
    // two as one entity rather than two businesses with the same name.
    hasMap: GOOGLE_MAPS_URL,
    sameAs: SOCIAL_PROFILES,
  };

  if (ORGANIZATION_RATING_ENABLED) {
    schema.aggregateRating = { '@type': 'AggregateRating', ...ORGANIZATION_RATING };
  }

  return schema;
}

export function webSiteSchema(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: `${BRAND_NAME} — Holiday Packages & AI Trip Planner`,
    publisher: { '@id': ORGANIZATION_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?search={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]): JsonLd | null {
  if (!faqs.length) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/**
 * TouristDestination for a destination hub page.
 *
 * No aggregateRating — see the note above touristTripSchema.
 */
export function touristDestinationSchema(destination: Destination): JsonLd {
  const url = absoluteUrl(`/destinations/${destination.slug}`);
  const schema: JsonLd = {
    '@type': 'TouristDestination',
    '@id': `${url}#destination`,
    name: destination.name,
    description: destination.shortDescription,
    url,
    image: destination.heroImage,
    touristType: 'Leisure and pilgrimage travellers from India',
    includesAttraction: destination.topAttractions.map((attraction) => ({
      '@type': 'TouristAttraction',
      name: attraction.name,
      description: attraction.description,
      image: attraction.image,
    })),
    address: {
      '@type': 'PostalAddress',
      addressRegion: destination.state,
      addressCountry: 'IN',
    },
  };

  return schema;
}

/**
 * TouristTrip for a package page, with one subTrip per itinerary day — the
 * schema.org-sanctioned way to express a multi-day itinerary.
 *
 * NO aggregateRating, deliberately, for two independent reasons:
 *
 * 1. Policy. The rating and reviewCount fields in destinationsData and
 *    packagesData are placeholder values from when the site was built — they
 *    total well over ten thousand reviews, against a business with a handful of
 *    real ones. Google's review-snippet policy requires ratings genuinely
 *    collected from users; marking up invented counts is spammy structured data
 *    and risks a manual action against the whole site.
 * 2. It buys nothing anyway. Review snippets are only supported on a fixed list
 *    of types (Book, Course, Event, HowTo, LocalBusiness, Movie, Product,
 *    Recipe, SoftwareApplication and a few others). Neither TouristTrip nor
 *    TouristDestination is on it, so Google would ignore the field even if the
 *    numbers were real.
 *
 * To turn ratings on later: collect genuine reviews, display them on the page,
 * and mark them up on a type Google actually supports — the TravelAgency
 * (LocalBusiness) block, via ORGANIZATION_RATING_ENABLED in siteConfig.ts.
 */
export function touristTripSchema(pkg: Package, canonicalPath: string): JsonLd {
  const url = absoluteUrl(canonicalPath);
  const schema: JsonLd = {
    '@type': 'TouristTrip',
    '@id': `${url}#trip`,
    name: pkg.title,
    description: pkg.overview,
    url,
    image: pkg.heroImage,
    touristType: pkg.tripType,
    provider: { '@id': ORGANIZATION_ID },
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: pkg.itinerary.length,
      itemListElement: pkg.itinerary.map((day) => ({
        '@type': 'ListItem',
        position: day.dayNumber,
        item: {
          '@type': 'TouristTrip',
          name: `Day ${day.dayNumber}: ${day.title}`,
          description: day.description,
        },
      })),
    },
    subTrip: pkg.itinerary.map((day) => ({
      '@type': 'TouristTrip',
      name: `Day ${day.dayNumber}: ${day.title}`,
      description: day.description,
    })),
    offers: {
      '@type': 'Offer',
      price: String(pkg.startingPrice),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url,
      description: `Starting price per person for a ${pkg.durationNights}N/${pkg.durationDays}D ${pkg.destination} package.`,
    },
  };

  return schema;
}

export function guideArticleSchema(guide: TravelGuide): JsonLd {
  const url = absoluteUrl(`/guides/${guide.slug}`);
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: guide.title,
    description: guide.excerpt,
    url,
    image: guide.heroImage,
    datePublished: parsePublishedDate(guide.publishedDate),
    author: { '@type': 'Person', name: guide.author.name, jobTitle: guide.author.role },
    publisher: { '@id': ORGANIZATION_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    about: guide.destinationName,
  };
}

/**
 * Guide data stores human dates like "August 2026". Schema.org wants ISO-8601,
 * so month-year strings become the first of that month; anything unparseable is
 * dropped rather than guessed.
 */
function parsePublishedDate(raw: string): string | undefined {
  const parsed = new Date(`1 ${raw}`);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  const direct = new Date(raw);
  return Number.isNaN(direct.getTime()) ? undefined : direct.toISOString().slice(0, 10);
}

/** Wraps the page's blocks into one @graph document, the form Google prefers. */
export function buildGraph(blocks: (JsonLd | null | undefined)[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': blocks.filter(Boolean),
  });
}
