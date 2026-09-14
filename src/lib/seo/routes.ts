/**
 * Per-route SEO resolution.
 *
 * Audit finding #1 was that all 32 URLs shipped the same <title>, the same
 * meta description and - worst of all - the same canonical
 * (https://safartrails.co.in/). A canonical pointing at the homepage tells
 * Google every destination and guide page *is* the homepage, which is why none
 * of them could rank for their own keyword.
 *
 * resolveRouteSeo() is the single resolver used by both runtimes:
 *   - the browser, via the <Seo> component mounted in App.tsx
 *   - the build, via scripts/prerender.ts, which writes the same tags into
 *     static HTML so crawlers never depend on JavaScript
 */

import { destinationsData } from '../../data/destinationsData';
import { guidesData } from '../../data/guidesData';
import { packagesData } from '../../data/packagesData';
import { Destination, Package, TravelGuide } from '../../types';
import { BRAND_NAME, BRAND_TAGLINE, DEFAULT_OG_IMAGE, absoluteUrl } from './siteConfig';
import {
  breadcrumbSchema,
  buildGraph,
  faqSchema,
  guideArticleSchema,
  JsonLd,
  touristDestinationSchema,
  touristTripSchema,
  travelAgencySchema,
  webSiteSchema,
} from './structuredData';
import { fitDescription, fitTitle } from './textUtils';

export interface ContentSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface RouteSeo {
  /** Canonical path, always with a leading slash and no trailing slash (except '/'). */
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogType: 'website' | 'article';
  robots: string;
  /** Serialised @graph, ready to drop into a ld+json script tag. */
  jsonLd: string;
  /** The single H1 the page must render. */
  h1: string;
  /** Lead paragraph, reused as the prerendered intro. */
  intro: string;
  /** Body content emitted into the prerendered HTML so crawlers see real text. */
  sections: ContentSection[];
  faqs: { question: string; answer: string }[];
  /** Internal links emitted into the prerendered HTML for crawl paths. */
  relatedLinks: { label: string; href: string }[];
  /** Sitemap hints. */
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly';
}

const INDEX_FOLLOW = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const NOINDEX = 'noindex, follow';

const HOME_CRUMB = { name: 'Home', path: '/' };

function organizationGraph(extra: (JsonLd | null)[] = []): string {
  return buildGraph([travelAgencySchema(), webSiteSchema(), ...extra]);
}

/* ------------------------------------------------------------------ *
 * Static pages
 * ------------------------------------------------------------------ */

interface StaticPageSpec {
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections?: ContentSection[];
  priority: number;
  changefreq: RouteSeo['changefreq'];
  robots?: string;
  relatedLinks?: { label: string; href: string }[];
}

const topDestinationLinks = () =>
  destinationsData.map((destination) => ({
    label: `${destination.name} tour packages`,
    href: `/destinations/${destination.slug}`,
  }));

const STATIC_PAGES: StaticPageSpec[] = [
  {
    path: '/',
    title: 'Custom India Tour Packages – AI Trip Planner | Safar Trails',
    description:
      'Custom Kashmir, Kerala, Himachal & Rajasthan tour packages, planned by AI and refined by real travel experts. 24x7 support, transparent pricing. Get a free itinerary!',
    h1: 'Custom India Tour Packages · AI Plans, Experts Perfect — Your Journey. Our Passion.',
    intro:
      'Safar Trails builds hand-planned holiday packages across India — Kashmir houseboats, Kerala backwaters, Himachal road trips, Rajasthan forts, Andaman beaches and the Chardham Yatra. Every itinerary starts from your dates, budget and travel style, is checked by a destination specialist, and comes with verified stays, trained drivers and 24x7 on-trip support. Travel with Trust.',
    sections: [
      {
        heading: 'Why travellers book with Safar Trails',
        bullets: [
          'Hand-planned itineraries — an AI first draft in minutes, refined by a destination specialist before it reaches you.',
          'Transparent pricing with inclusions and exclusions written out in full, so there are no surprises at check-in.',
          'Verified hotels, houseboats and homestays, plus trained local drivers on every route.',
          '24x7 on-trip support on WhatsApp, with an average response time under three minutes.',
          'Visa assistance, air ticketing and airport transfers arranged alongside the trip itself.',
        ],
      },
      {
        heading: 'Popular travel styles',
        bullets: [
          'Honeymoon and couple trips — Kashmir, Kerala, Goa, Andaman.',
          'Family holidays with comfortable pacing and child-friendly stays.',
          'Group and corporate tours with tempo travellers and block hotel bookings.',
          'Pilgrimage journeys including the full Chardham Yatra circuit.',
          'Adventure and road trips across Himachal, Ladakh and the Northeast.',
        ],
      },
      {
        heading: 'Where we plan trips',
        paragraphs: [
          'Each destination below has its own guide covering the best season to travel, realistic costs, where to stay and how to get there — plus ready itineraries you can customise.',
        ],
        bullets: destinationsData.map(
          (destination) =>
            `${destination.name} (${destination.state}) — ${destination.tagline}. From ₹${destination.startingPrice.toLocaleString('en-IN')} per person, ideal for ${destination.idealDays}.`,
        ),
      },
      {
        heading: 'How booking with Safar Trails works',
        bullets: [
          'Share your destination, dates, group size and budget — by form, call or WhatsApp.',
          'Receive a custom day-wise itinerary with itemised pricing, usually within 30 minutes.',
          'Revise it as many times as you need; nothing is locked until you confirm.',
          'Pay a booking advance, receive confirmed hotel and transport vouchers.',
          'Travel with a specialist reachable on WhatsApp for the whole trip.',
        ],
      },
    ],
    priority: 1.0,
    changefreq: 'daily',
  },
  {
    path: '/destinations',
    title: 'India Tour Packages by Destination | Safar Trails',
    description:
      'Browse Safar Trails destinations across India — Kashmir, Kerala, Goa, Rajasthan, Himachal, Uttarakhand, Northeast & Andaman. Costs, best seasons and custom itineraries.',
    h1: 'India Travel Destinations',
    intro:
      'Every Safar Trails destination page carries the same practical detail: when to go, what a trip actually costs, where to stay, how to reach, and the attractions worth the detour. Pick a destination to see its full guide and ready-to-customise packages.',
    priority: 0.9,
    changefreq: 'weekly',
  },
  {
    path: '/packages',
    title: 'India Holiday Packages – Curated Tours | Safar Trails',
    description:
      'Curated India holiday packages with day-wise itineraries, verified stays and clear inclusions. Customise any package to your dates and budget with Safar Trails.',
    h1: 'India Holiday Packages',
    intro:
      'Each package below is a starting point, not a fixed menu. Day counts, hotel categories, transport and add-ons can all be adjusted — tell us your dates and we will send a revised itinerary with pricing.',
    priority: 0.9,
    changefreq: 'weekly',
  },
  {
    path: '/ai-planner',
    title: 'AI Trip Planner India – Free Custom Itinerary | Safar Trails',
    description:
      'Tell us your destination, dates and stay style — get a day-by-day India itinerary with realistic cost estimates in minutes. AI plans, Safar Trails experts perfect.',
    h1: 'Free AI Trip Planner for India Holidays',
    intro:
      'Describe the trip you want in plain language — "7 days in Kashmir in December for two, mid-range hotels" — and the planner returns a day-by-day itinerary with stays, travel time and an honest cost estimate. A Safar Trails specialist then reviews it before you book anything.',
    sections: [
      {
        heading: 'How the AI trip planner works',
        bullets: [
          'Step 1 — Enter your destination, travel dates, group size and budget band.',
          'Step 2 — The planner drafts a day-wise itinerary with stays, activities and travel times.',
          'Step 3 — A destination specialist checks feasibility, distances and seasonal conditions.',
          'Step 4 — You receive the final itinerary with transparent, itemised pricing.',
        ],
      },
    ],
    priority: 0.9,
    changefreq: 'weekly',
  },
  {
    path: '/guides',
    title: 'India Travel Guides – Costs, Seasons & Tips | Safar Trails',
    description:
      'Month-by-month travel guides, realistic trip cost breakdowns and first-timer itineraries for Kashmir, Kerala, Goa, Rajasthan, Himachal, Andaman and the Northeast.',
    h1: 'India Travel Guides',
    intro:
      'Written by the specialists who plan these trips every week: when to visit, what a trip really costs, how many days each region deserves, and the mistakes first-timers make.',
    priority: 0.8,
    changefreq: 'weekly',
  },
  {
    path: '/about-us',
    title: 'About Safar Trails – Travel with Trust',
    description:
      'Who we are: a travel agency building hand-planned India itineraries with verified stays, transparent pricing, trained drivers and 24x7 on-trip support. Travel with Trust.',
    h1: 'About Safar Trails — Travel with Trust',
    intro:
      'Safar Trails is a New Delhi-based travel agency planning custom holidays across India and abroad. "Travel with Trust" is not a tagline we print and forget: it means written inclusions and exclusions, hotels we have actually verified, drivers we know by name, and a human reachable on WhatsApp for the entire length of your trip.',
    sections: [
      {
        heading: 'What Travel with Trust means in practice',
        bullets: [
          'Transparent pricing — every inclusion and exclusion is written down before you pay.',
          'Verified stays — we check hotels, houseboats and homestays rather than reselling blind inventory.',
          'Trained local drivers and guides on every route, briefed on your specific itinerary.',
          '24x7 on-trip support, with an average WhatsApp response time under three minutes.',
          'A simple, plainly worded refund and cancellation policy.',
        ],
      },
    ],
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/contact-us',
    title: 'Contact Safar Trails – Free Itinerary in 30 Mins',
    description:
      'Talk to a Safar Trails destination specialist. Call, WhatsApp or send your dates and get a custom India itinerary with pricing back within 30 minutes.',
    h1: 'Contact Safar Trails',
    intro:
      'Send your destination, travel dates and group size and a destination specialist will come back with a custom itinerary and transparent pricing — usually within 30 minutes during working hours.',
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/404',
    title: 'Page Not Found | Safar Trails',
    description:
      'This page could not be found. Browse Safar Trails destinations, holiday packages and travel guides, or talk to a destination specialist.',
    h1: 'This page could not be found',
    intro:
      'The link may be out of date. Start from our destinations, packages or travel guides below — or send us your dates and we will build the itinerary for you.',
    priority: 0.0,
    changefreq: 'monthly',
    robots: NOINDEX,
  },
];

/* ------------------------------------------------------------------ *
 * Per-destination title overrides
 * ------------------------------------------------------------------ */

/**
 * The seoTitle values stored in destinationsData are 70+ characters, which
 * Google truncates. These overrides carry the same head keyword in a length
 * that actually renders.
 */
const DESTINATION_TITLE_OVERRIDES: Record<string, string> = {
  kashmir: 'Kashmir Tour Packages – Houseboat & Gulmarg | Safar Trails',
  kerala: 'Kerala Tour Packages – Munnar & Alleppey | Safar Trails',
  'chardham-yatra': 'Chardham Yatra Package 2026 – Custom & Group | Safar Trails',
  goa: 'Goa Tour Packages – Beaches & Boutique Stays | Safar Trails',
  rajasthan: 'Rajasthan Tour Packages – Forts & Desert | Safar Trails',
  'himachal-pradesh': 'Himachal Tour Packages – Manali & Shimla | Safar Trails',
  uttarakhand: 'Uttarakhand Packages – Hills & Rishikesh | Safar Trails',
  'northeast-india': 'Northeast India Tours – Meghalaya & Assam | Safar Trails',
  andaman: 'Andaman Tour Packages – Havelock & Scuba | Safar Trails',
  ladakh: 'Ladakh Tour Packages – Pangong & Nubra | Safar Trails',
};

/* ------------------------------------------------------------------ *
 * Builders
 * ------------------------------------------------------------------ */

function staticRoute(spec: StaticPageSpec): RouteSeo {
  const isHome = spec.path === '/';
  return {
    path: spec.path,
    title: spec.title,
    description: fitDescription(spec.description),
    canonical: absoluteUrl(spec.path),
    ogImage: DEFAULT_OG_IMAGE,
    ogType: 'website',
    robots: spec.robots ?? INDEX_FOLLOW,
    jsonLd: organizationGraph(
      isHome
        ? []
        : [breadcrumbSchema([HOME_CRUMB, { name: spec.h1, path: spec.path }])],
    ),
    h1: spec.h1,
    intro: spec.intro,
    sections: spec.sections ?? [],
    faqs: [],
    relatedLinks: spec.relatedLinks ?? topDestinationLinks(),
    priority: spec.priority,
    changefreq: spec.changefreq,
  };
}

function destinationRoute(destination: Destination): RouteSeo {
  const path = `/destinations/${destination.slug}`;
  const relatedPackages = packagesData.filter(
    (pkg) => pkg.destination.toLowerCase() === destination.name.toLowerCase(),
  );
  const relatedGuides = guidesData.filter((guide) => guide.destinationSlug === destination.slug);

  const highlightText = destination.highlights.map((highlight) =>
    typeof highlight === 'string' ? highlight : highlight.title,
  );

  return {
    path,
    title:
      DESTINATION_TITLE_OVERRIDES[destination.slug] ??
      fitTitle(`${destination.name} Tour Packages`),
    description: fitDescription(destination.seoDescription || destination.shortDescription),
    canonical: absoluteUrl(path),
    ogImage: destination.heroImage,
    ogType: 'website',
    robots: INDEX_FOLLOW,
    jsonLd: organizationGraph([
      touristDestinationSchema(destination),
      breadcrumbSchema([
        HOME_CRUMB,
        { name: 'Destinations', path: '/destinations' },
        { name: destination.name, path },
      ]),
      faqSchema(destination.faqs),
    ]),
    h1: `${destination.name} Tour Packages — ${destination.tagline}`,
    intro: destination.fullOverview,
    sections: [
      { heading: `Why visit ${destination.name}`, bullets: highlightText },
      {
        heading: `Best time to visit ${destination.name}`,
        paragraphs: [
          `Best season: ${destination.bestTime}.`,
          `Typical temperatures: ${destination.temperatureRange}.`,
          `Suggested trip length: ${destination.idealDays}. Packages start from ₹${destination.startingPrice.toLocaleString('en-IN')} per person.`,
        ],
      },
      {
        heading: `Top places to visit in ${destination.name}`,
        bullets: destination.topAttractions.map(
          (attraction) => `${attraction.name} — ${attraction.description}`,
        ),
      },
      {
        heading: `How to reach ${destination.name}`,
        bullets: [
          `By air: ${destination.howToReach.air}`,
          `By rail: ${destination.howToReach.rail}`,
          `By road: ${destination.howToReach.road}`,
        ],
      },
      {
        heading: `Where to stay in ${destination.name}`,
        bullets: destination.stayCategories.map(
          (stay) => `${stay.category} (${stay.priceRange}) — ${stay.recommendation}`,
        ),
      },
      { heading: `${destination.name} travel tips`, bullets: destination.travelTips },
    ],
    faqs: destination.faqs,
    relatedLinks: [
      ...relatedPackages.map((pkg) => ({
        label: pkg.title,
        href: `/tour-packages/${pkg.slug}`,
      })),
      ...relatedGuides.map((guide) => ({ label: guide.title, href: `/guides/${guide.slug}` })),
      { label: 'All India destinations', href: '/destinations' },
    ],
    priority: 0.85,
    changefreq: 'weekly',
  };
}

function packageRoute(pkg: Package): RouteSeo {
  const path = `/tour-packages/${pkg.slug}`;
  const destination = destinationsData.find(
    (item) => item.name.toLowerCase() === pkg.destination.toLowerCase(),
  );

  return {
    path,
    title: fitTitle(`${pkg.title} – ${pkg.durationNights}N/${pkg.durationDays}D`),
    description: fitDescription(
      `${pkg.overview} Starting ₹${pkg.startingPrice.toLocaleString('en-IN')} per person from ${pkg.startingCity}.`,
    ),
    canonical: absoluteUrl(path),
    ogImage: pkg.heroImage,
    ogType: 'website',
    robots: INDEX_FOLLOW,
    jsonLd: organizationGraph([
      touristTripSchema(pkg, path),
      breadcrumbSchema([
        HOME_CRUMB,
        { name: 'Packages', path: '/packages' },
        { name: pkg.title, path },
      ]),
    ]),
    h1: `${pkg.title} — ${pkg.durationNights} Nights / ${pkg.durationDays} Days`,
    intro: pkg.overview,
    sections: [
      {
        heading: 'Package at a glance',
        bullets: [
          `Duration: ${pkg.durationNights} nights / ${pkg.durationDays} days`,
          `Starting price: ₹${pkg.startingPrice.toLocaleString('en-IN')} per person`,
          `Starts from: ${pkg.startingCity}`,
          `Hotel category: ${pkg.hotelCategory}`,
          `Best for: ${pkg.bestFor}`,
          `Season: ${pkg.season}`,
        ],
      },
      { heading: 'Trip highlights', bullets: pkg.highlights },
      {
        heading: 'Day-wise itinerary',
        bullets: pkg.itinerary.map(
          (day) => `Day ${day.dayNumber} — ${day.title} (${day.location}): ${day.description}`,
        ),
      },
      { heading: "What's included", bullets: pkg.inclusions },
      { heading: "What's not included", bullets: pkg.exclusions },
    ],
    faqs: [],
    relatedLinks: [
      ...(destination
        ? [{ label: `${destination.name} travel guide`, href: `/destinations/${destination.slug}` }]
        : []),
      { label: 'All holiday packages', href: '/packages' },
      { label: 'Build a custom itinerary with the AI planner', href: '/ai-planner' },
    ],
    priority: 0.8,
    changefreq: 'weekly',
  };
}

function guideRoute(guide: TravelGuide): RouteSeo {
  const path = `/guides/${guide.slug}`;
  return {
    path,
    title: fitTitle(guide.title.replace(/\s*\(\d{4}\)\s*$/, '')),
    description: fitDescription(guide.excerpt),
    canonical: absoluteUrl(path),
    ogImage: guide.heroImage,
    ogType: 'article',
    robots: INDEX_FOLLOW,
    jsonLd: organizationGraph([
      guideArticleSchema(guide),
      breadcrumbSchema([
        HOME_CRUMB,
        { name: 'Travel Guides', path: '/guides' },
        { name: guide.title, path },
      ]),
    ]),
    h1: guide.title,
    intro: `${guide.subtitle} ${guide.excerpt}`,
    sections: guide.contentSections.map((section) => ({
      heading: section.heading,
      paragraphs: [section.content, ...(section.highlightQuote ? [section.highlightQuote] : [])],
      bullets: section.bulletPoints,
    })),
    faqs: [],
    relatedLinks: [
      { label: `${guide.destinationName} tour packages`, href: `/destinations/${guide.destinationSlug}` },
      ...guide.relatedPackageSlugs
        .map((slug) => packagesData.find((pkg) => pkg.slug === slug))
        .filter((pkg): pkg is Package => Boolean(pkg))
        .map((pkg) => ({ label: pkg.title, href: `/tour-packages/${pkg.slug}` })),
      { label: 'All travel guides', href: '/guides' },
    ],
    priority: 0.75,
    changefreq: 'monthly',
  };
}

/* ------------------------------------------------------------------ *
 * Public API
 * ------------------------------------------------------------------ */

/** Every route that can be rendered to static HTML from local data. */
export function allStaticRoutes(): RouteSeo[] {
  return [
    ...STATIC_PAGES.map(staticRoute),
    ...destinationsData.map(destinationRoute),
    ...packagesData.map(packageRoute),
    ...guidesData.map(guideRoute),
  ];
}

/** Routes that belong in sitemap.xml (everything indexable). */
export function sitemapRoutes(): RouteSeo[] {
  return allStaticRoutes().filter((route) => !route.robots.startsWith('noindex'));
}

function normalisePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

/**
 * Resolves the SEO payload for any URL. Unknown-but-valid dynamic routes (for
 * example a package that lives in Sanity rather than in local data) fall back
 * to a generic indexable payload for their section, so they never inherit the
 * homepage's canonical.
 */
export function resolveRouteSeo(pathname: string): RouteSeo {
  const path = normalisePath(pathname);

  const exact = allStaticRoutes().find((route) => route.path === path);
  if (exact) return exact;

  // /destinations/:destSlug/packages/:pkgSlug — same content as /tour-packages/:slug,
  // so it points its canonical there rather than competing with it.
  const nestedPackage = path.match(/^\/destinations\/[^/]+\/packages\/([^/]+)$/);
  if (nestedPackage) {
    const pkg = packagesData.find((item) => item.slug === nestedPackage[1]);
    if (pkg) return { ...packageRoute(pkg), path };
  }

  const sanityPackage = path.match(/^\/packages\/([^/]+)$/);
  if (sanityPackage) {
    const pkg = packagesData.find((item) => item.slug === sanityPackage[1]);
    if (pkg) return { ...packageRoute(pkg), path };
    return dynamicFallback(path, sanityPackage[1], 'package');
  }

  const sanityDestination = path.match(/^\/destinations\/([^/]+)$/);
  if (sanityDestination) return dynamicFallback(path, sanityDestination[1], 'destination');

  const sanityGuide = path.match(/^\/guides\/([^/]+)$/);
  if (sanityGuide) return dynamicFallback(path, sanityGuide[1], 'guide');

  return allStaticRoutes().find((route) => route.path === '/404')!;
}

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Fallback for CMS-driven URLs this build has no local copy of. It still emits
 * a self-referencing canonical, which is the entire point of the fix.
 */
function dynamicFallback(
  path: string,
  slug: string,
  kind: 'destination' | 'package' | 'guide',
): RouteSeo {
  const name = slugToTitle(slug);
  const copy = {
    destination: {
      title: fitTitle(`${name} Tour Packages`),
      description: `Custom ${name} tour packages from ${BRAND_NAME} — verified stays, trained local drivers, transparent pricing and 24x7 on-trip support. Get a free itinerary.`,
      h1: `${name} Tour Packages`,
      section: 'Destinations',
      sectionPath: '/destinations',
    },
    package: {
      title: fitTitle(name),
      description: `${name} holiday package from ${BRAND_NAME} — day-wise itinerary, verified stays and clear inclusions. Customise it to your dates and budget.`,
      h1: name,
      section: 'Packages',
      sectionPath: '/packages',
    },
    guide: {
      title: fitTitle(name),
      description: `${name} — a practical travel guide from the ${BRAND_NAME} destination specialists. ${BRAND_TAGLINE}.`,
      h1: name,
      section: 'Travel Guides',
      sectionPath: '/guides',
    },
  }[kind];

  return {
    path,
    title: copy.title,
    description: fitDescription(copy.description),
    canonical: absoluteUrl(path),
    ogImage: DEFAULT_OG_IMAGE,
    ogType: kind === 'guide' ? 'article' : 'website',
    robots: INDEX_FOLLOW,
    jsonLd: organizationGraph([
      breadcrumbSchema([
        HOME_CRUMB,
        { name: copy.section, path: copy.sectionPath },
        { name: copy.h1, path },
      ]),
    ]),
    h1: copy.h1,
    intro: copy.description,
    sections: [],
    faqs: [],
    relatedLinks: topDestinationLinks(),
    priority: 0.6,
    changefreq: 'weekly',
  };
}
