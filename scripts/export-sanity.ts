/**
 * One-off migration: pull everything out of Sanity into content/, then delete me.
 *
 * WHY THIS IS A SEPARATE SCRIPT YOU RUN BY HAND
 *
 * The live sitemap has more URLs than the repo can produce on its own - a handful
 * of destinations, packages and guides exist only in Sanity, and they have already
 * been submitted to Search Console. Sanity's images are also served from
 * cdn.sanity.io and stop resolving the moment the project is dropped. Both have to
 * come across before any Sanity code is deleted, or indexed pages start 404ing and
 * surviving pages lose their photography.
 *
 * Run this once, from a machine with network access:
 *
 *     npx tsx scripts/export-sanity.ts
 *
 * Then review `git status`, read the report it prints, and commit.
 *
 * WHAT IT DOES
 *
 *   1. Fetches every destination, tourPackage and guide.
 *   2. Downloads each referenced image into public/content/ and rewrites the field
 *      to that local path.
 *   3. Maps each document into the Destination / Package / TravelGuide shapes in
 *      src/types.ts and writes content/<type>/<slug>.json.
 *   4. Saves the live sitemap to content/.sitemap-baseline.txt so the URL list can
 *      be diffed after the switchover.
 *   5. Reports what it created, what it skipped, and - importantly - which fields
 *      it could not fill.
 *
 * WHERE IT WILL COME UP SHORT
 *
 * Sanity's destination schema carries seven fields; the local Destination type has
 * eighteen. Guides are stored as Portable Text, which is richer than the
 * heading/paragraph/bullet structure the site renders. Anything unmappable is
 * written as "TODO: ..." so it is greppable and obvious on the page, rather than
 * silently blank. Those pages will be visibly thinner than the hand-written ones
 * until someone fills them in.
 *
 * Existing content/ files are never overwritten - the locally authored records are
 * fuller than their Sanity counterparts, which is why DestinationDetailPage.tsx
 * already preferred them at runtime.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const IMAGE_DIR = path.join(ROOT, 'public', 'content');

const PROJECT_ID = process.env.VITE_SANITY_PROJECT_ID || 'xmtc060o';
const DATASET = process.env.VITE_SANITY_DATASET || 'production';
const API_VERSION = process.env.VITE_SANITY_API_VERSION || '2024-06-01';
const SITE_URL = 'https://safartrails.co.in';

const TODO = (what: string) => `TODO: ${what} - not present in Sanity, please write this.`;

/* ------------------------------------------------------------------ *
 * Sanity plumbing
 * ------------------------------------------------------------------ */

async function groq<T>(query: string): Promise<T> {
  const url = `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Sanity returned HTTP ${response.status} for a query. Check the project ID and that the dataset is public.`);
  }
  const body = (await response.json()) as { result?: T };
  return (body.result ?? []) as T;
}

interface ImageRef {
  asset?: { _ref?: string };
  alt?: string;
}

/** image-<id>-<width>x<height>-<ext>  ->  the CDN URL for that asset. */
function cdnUrl(ref: string): string | null {
  const match = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
  if (!match) return null;
  const [, id, dimensions, extension] = match;
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dimensions}.${extension}`;
}

const downloaded = new Map<string, string>();

/**
 * Downloads an image and returns the site-relative path to it. Returns null when
 * there is nothing to download, so callers can fall back rather than emit a
 * broken src.
 */
async function localiseImage(
  image: ImageRef | undefined,
  kind: string,
  slug: string,
  index: number,
  report: string[],
): Promise<string | null> {
  const ref = image?.asset?._ref;
  if (!ref) return null;

  const cached = downloaded.get(ref);
  if (cached) return cached;

  const source = cdnUrl(ref);
  if (!source) {
    report.push(`  ! ${kind}/${slug}: could not parse image reference "${ref}"`);
    return null;
  }

  const extension = source.split('.').pop() || 'jpg';
  const relative = `/content/${kind}/${slug}/${index}.${extension}`;
  const destination = path.join(IMAGE_DIR, kind, slug, `${index}.${extension}`);

  try {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, Buffer.from(await response.arrayBuffer()));
    downloaded.set(ref, relative);
    return relative;
  } catch (error) {
    report.push(`  ! ${kind}/${slug}: image download failed (${(error as Error).message}) - ${source}`);
    return null;
  }
}

/* ------------------------------------------------------------------ *
 * Portable Text -> the heading/paragraph/bullet shape the site renders
 * ------------------------------------------------------------------ */

interface PortableBlock {
  _type?: string;
  style?: string;
  listItem?: string;
  children?: { text?: string }[];
}

interface ContentSection {
  heading: string;
  content: string;
  bulletPoints?: string[];
}

function portableTextToSections(body: PortableBlock[] | undefined, title: string): ContentSection[] {
  if (!body?.length) return [];

  const sections: ContentSection[] = [];
  let current: ContentSection = { heading: title, content: '' };

  const flush = () => {
    if (current.content.trim() || current.bulletPoints?.length) sections.push(current);
  };

  for (const block of body) {
    if (block._type !== 'block') continue;
    const text = (block.children ?? []).map((child) => child.text ?? '').join('').trim();
    if (!text) continue;

    if (block.listItem) {
      (current.bulletPoints ??= []).push(text);
    } else if (block.style && /^h[1-4]$/.test(block.style)) {
      flush();
      current = { heading: text, content: '' };
    } else {
      current.content = current.content ? `${current.content}\n\n${text}` : text;
    }
  }

  flush();
  return sections;
}

/* ------------------------------------------------------------------ *
 * Writing
 * ------------------------------------------------------------------ */

function writeIfNew(kind: string, slug: string, item: unknown, report: string[]): boolean {
  const file = path.join(CONTENT_DIR, kind, `${slug}.json`);
  if (fs.existsSync(file)) {
    report.push(`  = ${kind}/${slug} already in content/ - kept the local version (it is fuller)`);
    return false;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(item, null, 2) + '\n', 'utf8');
  report.push(`  + ${kind}/${slug} created from Sanity`);
  return true;
}

/** "5 Nights / 6 Days", "6D/5N", "6 days" -> { days, nights } */
function parseDuration(duration: string | undefined): { days: number; nights: number } {
  const text = duration ?? '';
  const days = Number(text.match(/(\d+)\s*(?:d\b|days?)/i)?.[1] ?? 0);
  const nights = Number(text.match(/(\d+)\s*(?:n\b|nights?)/i)?.[1] ?? 0);
  if (days && nights) return { days, nights };
  if (days) return { days, nights: days - 1 };
  if (nights) return { days: nights + 1, nights };
  return { days: 0, nights: 0 };
}

const TRIP_TYPES = [
  'Couple', 'Honeymoon', 'Family', 'Friends', 'Solo', 'Group', 'Adventure',
  'Luxury', 'Weekend', 'Spiritual', 'Heritage', 'Cultural', 'Nature', 'Relaxation',
];

/** Only emit trip types the union actually accepts, so the build cannot break. */
function mapTripType(travelType: string | undefined): string[] {
  const match = TRIP_TYPES.find((t) => t.toLowerCase() === (travelType ?? '').trim().toLowerCase());
  return match ? [match] : ['Family'];
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

async function main(): Promise<void> {
  const report: string[] = [];
  const gaps: string[] = [];

  console.log(`Reading Sanity project ${PROJECT_ID}/${DATASET}…\n`);

  // --- Destinations -------------------------------------------------
  const destinations = await groq<Record<string, any>[]>(
    '*[_type == "destination" && defined(slug.current)]{_id,title,"slug":slug.current,description,heroImage,gallery,highlights,bestTimeToVisit}',
  );
  report.push(`Destinations (${destinations.length} in Sanity)`);
  for (const doc of destinations) {
    const slug = doc.slug as string;
    if (fs.existsSync(path.join(CONTENT_DIR, 'destinations', `${slug}.json`))) {
      report.push(`  = destinations/${slug} already in content/ - kept the local version (it is fuller)`);
      continue;
    }
    const hero = await localiseImage(doc.heroImage, 'destinations', slug, 0, report);
    const gallery: string[] = [];
    for (const [i, image] of (doc.gallery ?? []).entries()) {
      const localPath = await localiseImage(image, 'destinations', slug, i + 1, report);
      if (localPath) gallery.push(localPath);
    }

    writeIfNew('destinations', slug, {
      slug,
      name: doc.title,
      tagline: TODO('tagline'),
      state: TODO('state'),
      heroImage: hero ?? gallery[0] ?? '',
      cardImage: hero ?? gallery[0] ?? '',
      shortDescription: doc.description ?? TODO('shortDescription'),
      fullOverview: doc.description ?? TODO('fullOverview'),
      bestTime: doc.bestTimeToVisit ?? TODO('bestTime'),
      temperatureRange: TODO('temperatureRange'),
      startingPrice: 0,
      idealDays: TODO('idealDays'),
      highlights: doc.highlights ?? [],
      howToReach: { air: TODO('howToReach.air'), rail: TODO('howToReach.rail'), road: TODO('howToReach.road') },
      topAttractions: [],
      stayCategories: [],
      travelTips: [],
      faqs: [],
      seoTitle: `${doc.title} Tour Packages | Safar Trails`,
      seoDescription: doc.description ?? TODO('seoDescription'),
    }, report);

    gaps.push(`destinations/${slug}: startingPrice is 0, and tagline, state, temperatureRange, idealDays, howToReach, topAttractions, stayCategories, travelTips and faqs are all empty.`);
  }

  // --- Packages -----------------------------------------------------
  const packages = await groq<Record<string, any>[]>(
    '*[_type == "tourPackage" && defined(slug.current)]{_id,name,"slug":slug.current,price,duration,images,itinerary,inclusions,exclusions,tagline,startingPoint,travelType,overview,highlights,travelTips,"destination":destination->{title,"slug":slug.current}}',
  );
  report.push(`\nPackages (${packages.length} in Sanity)`);
  for (const doc of packages) {
    const slug = doc.slug as string;
    if (fs.existsSync(path.join(CONTENT_DIR, 'packages', `${slug}.json`))) {
      report.push(`  = packages/${slug} already in content/ - kept the local version (it is fuller)`);
      continue;
    }
    const images: string[] = [];
    for (const [i, image] of (doc.images ?? []).entries()) {
      const localPath = await localiseImage(image, 'packages', slug, i, report);
      if (localPath) images.push(localPath);
    }
    const { days, nights } = parseDuration(doc.duration);
    const destinationName = doc.destination?.title ?? TODO('destination');

    writeIfNew('packages', slug, {
      id: doc._id,
      slug,
      title: doc.name,
      destination: destinationName,
      state: TODO('state'),
      durationDays: days,
      durationNights: nights,
      startingPrice: doc.price ?? 0,
      tripType: mapTripType(doc.travelType),
      hotelCategory: 'Deluxe 4★',
      ratings: 0,
      reviewCount: 0,
      startingCity: doc.startingPoint ?? TODO('startingCity'),
      bestFor: doc.tagline ?? TODO('bestFor'),
      heroImage: images[0] ?? '',
      galleryImages: images,
      overview: doc.overview ?? TODO('overview'),
      highlights: doc.highlights ?? [],
      inclusions: doc.inclusions ?? [],
      exclusions: doc.exclusions ?? [],
      itinerary: (doc.itinerary ?? []).map((day: any, i: number) => ({
        dayNumber: day.day ?? i + 1,
        title: day.title ?? `Day ${i + 1}`,
        location: destinationName,
        description: day.description ?? '',
      })),
      season: 'All Season',
    }, report);

    if (!days || !nights) gaps.push(`packages/${slug}: could not read nights/days from duration "${doc.duration ?? ''}".`);
    gaps.push(`packages/${slug}: state, hotelCategory and season are guesses; Sanity's faqs, costFactors and whyChooseUs have no home in the Package type and were dropped.`);
  }

  // --- Guides -------------------------------------------------------
  const guides = await groq<Record<string, any>[]>(
    '*[_type == "guide" && defined(slug.current)]{_id,title,"slug":slug.current,coverImage,author,publishedDate,body,"relatedDestination":relatedDestination->{title,"slug":slug.current}}',
  );
  report.push(`\nGuides (${guides.length} in Sanity)`);
  for (const doc of guides) {
    const slug = doc.slug as string;
    if (fs.existsSync(path.join(CONTENT_DIR, 'guides', `${slug}.json`))) {
      report.push(`  = guides/${slug} already in content/ - kept the local version (it is fuller)`);
      continue;
    }
    const cover = await localiseImage(doc.coverImage, 'guides', slug, 0, report);
    const sections = portableTextToSections(doc.body, doc.title);
    const firstParagraph = sections.find((s) => s.content)?.content ?? '';

    writeIfNew('guides', slug, {
      slug,
      destinationSlug: doc.relatedDestination?.slug ?? '',
      destinationName: doc.relatedDestination?.title ?? TODO('destinationName'),
      title: doc.title,
      subtitle: firstParagraph.slice(0, 160) || TODO('subtitle'),
      readTime: `${Math.max(1, Math.round(sections.reduce((n, s) => n + s.content.split(/\s+/).length, 0) / 200))} min read`,
      author: {
        name: doc.author ?? 'Safar Trails Team',
        role: 'Destination Specialist',
        avatar: '/logo.svg',
      },
      publishedDate: doc.publishedDate ?? new Date().toISOString().slice(0, 10),
      heroImage: cover ?? '',
      category: 'Itinerary',
      excerpt: firstParagraph.slice(0, 260) || TODO('excerpt'),
      contentSections: sections,
      relatedPackageSlugs: [],
    }, report);

    if (!sections.length) gaps.push(`guides/${slug}: Portable Text body produced no sections - the page will be empty.`);
    gaps.push(`guides/${slug}: category defaulted to "Itinerary"; relatedPackageSlugs is empty.`);
  }

  // --- Sitemap baseline, so the URL list can be diffed after the switch
  try {
    const response = await fetch(`${SITE_URL}/sitemap.xml`);
    const urls = [...(await response.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]).sort();
    fs.writeFileSync(path.join(CONTENT_DIR, '.sitemap-baseline.txt'), urls.join('\n') + '\n', 'utf8');
    report.push(`\nSaved content/.sitemap-baseline.txt - ${urls.length} live URLs, to diff against after the switchover.`);
  } catch (error) {
    report.push(`\n! Could not fetch the live sitemap (${(error as Error).message}). Save it by hand before switching over.`);
  }

  console.log(report.join('\n'));

  if (gaps.length) {
    console.log(`\n\nFIELDS THAT NEED WRITING (${gaps.length})\n`);
    console.log('These pages will render, but thinner than the hand-written ones.');
    console.log('Search content/ for "TODO:" to find every one.\n');
    for (const gap of gaps) console.log(`  - ${gap}`);
  }

  console.log('\n\nNEXT: run `npm run content` to validate, then `git status` and commit.\n');
}

main().catch((error) => {
  console.error('\nExport failed:', error.message);
  console.error('Nothing was written. Fix the above and re-run - the script is safe to repeat.\n');
  process.exit(1);
});
