/**
 * Turns content/ into typed TypeScript modules.
 *
 * Content lives as one JSON file per item under content/, so it can be edited
 * from the GitHub web UI without touching code. This script reads those files,
 * checks each one has the fields its type requires, and writes
 * src/data/generated/*.ts.
 *
 * Why generate instead of importing the JSON directly: scripts/prerender.ts runs
 * under tsx rather than Vite, so Vite-only tricks like import.meta.glob are not
 * available to it. Generating one plain module keeps the app and the prerender on
 * a single code path, and turns a malformed edit into a failed build with a
 * useful message rather than a broken page in production.
 *
 * Runs automatically as the first step of `npm run build`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const OUT_DIR = path.join(ROOT, 'src', 'data', 'generated');

type Kind = 'string' | 'number' | 'array' | 'object';

interface Collection {
  /** Directory under content/ */
  dir: string;
  /** Generated file name and exported constant */
  file: string;
  exportName: string;
  /** Type imported from src/types.ts */
  type: string;
  /** Fields every item must have, and what shape they must be */
  required: Record<string, Kind>;
  /** Sort key for deterministic output */
  sortBy: (item: Record<string, unknown>) => string;
}

const COLLECTIONS: Collection[] = [
  {
    dir: 'destinations',
    file: 'destinations.ts',
    exportName: 'destinationsData',
    type: 'Destination',
    required: {
      slug: 'string',
      name: 'string',
      tagline: 'string',
      state: 'string',
      heroImage: 'string',
      cardImage: 'string',
      shortDescription: 'string',
      fullOverview: 'string',
      bestTime: 'string',
      temperatureRange: 'string',
      startingPrice: 'number',
      idealDays: 'string',
      highlights: 'array',
      howToReach: 'object',
      topAttractions: 'array',
      stayCategories: 'array',
      travelTips: 'array',
      faqs: 'array',
      seoTitle: 'string',
      seoDescription: 'string',
    },
    sortBy: (d) => String(d.slug),
  },
  {
    dir: 'packages',
    file: 'packages.ts',
    exportName: 'packagesData',
    type: 'Package',
    required: {
      id: 'string',
      slug: 'string',
      title: 'string',
      destination: 'string',
      state: 'string',
      durationDays: 'number',
      durationNights: 'number',
      startingPrice: 'number',
      tripType: 'array',
      hotelCategory: 'string',
      startingCity: 'string',
      bestFor: 'string',
      heroImage: 'string',
      galleryImages: 'array',
      overview: 'string',
      highlights: 'array',
      inclusions: 'array',
      exclusions: 'array',
      itinerary: 'array',
      season: 'string',
    },
    // displayOrder first (1, 2, 3 …), then everything else alphabetically.
    // Padded so the string comparison below orders numbers correctly, and so a
    // package without displayOrder always sorts after one that has it.
    sortBy: (p) =>
      `${String(p.displayOrder ?? 999).padStart(3, '0')}|${String(p.slug)}`,
  },
  {
    dir: 'guides',
    file: 'guides.ts',
    exportName: 'guidesData',
    type: 'TravelGuide',
    required: {
      slug: 'string',
      destinationSlug: 'string',
      destinationName: 'string',
      title: 'string',
      subtitle: 'string',
      readTime: 'string',
      author: 'object',
      publishedDate: 'string',
      heroImage: 'string',
      category: 'string',
      excerpt: 'string',
      contentSections: 'array',
      relatedPackageSlugs: 'array',
    },
    sortBy: (g) => String(g.slug),
  },
];

function kindOf(value: unknown): Kind | 'other' {
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (Array.isArray(value)) return 'array';
  if (value !== null && typeof value === 'object') return 'object';
  return 'other';
}

/** Collects every problem before reporting, so one run surfaces all of them. */
function validate(
  collection: Collection,
  file: string,
  item: Record<string, unknown>,
  errors: string[],
): void {
  const where = `content/${collection.dir}/${file}`;

  for (const [field, expected] of Object.entries(collection.required)) {
    const actual = kindOf(item[field]);
    if (item[field] === undefined || item[field] === null) {
      errors.push(`${where}: missing required field "${field}"`);
    } else if (actual !== expected) {
      errors.push(`${where}: "${field}" should be a ${expected}, got ${actual}`);
    } else if (expected === 'string' && String(item[field]).trim() === '') {
      errors.push(`${where}: "${field}" is empty`);
    }
  }

  // The filename is the URL slug, so a mismatch silently breaks routing.
  const expectedSlug = file.replace(/\.json$/, '');
  if (item.slug !== undefined && item.slug !== expectedSlug) {
    errors.push(
      `${where}: slug "${String(item.slug)}" does not match the filename. ` +
        `Rename the file to ${String(item.slug)}.json, or fix the slug.`,
    );
  }
}

function readCollection(collection: Collection, errors: string[]): Record<string, unknown>[] {
  const dir = path.join(CONTENT_DIR, collection.dir);
  if (!fs.existsSync(dir)) {
    errors.push(`content/${collection.dir}/ does not exist`);
    return [];
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
  const items: Record<string, unknown>[] = [];
  const seenSlugs = new Map<string, string>();

  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      // By far the most likely failure after a hand edit: a trailing comma or a
      // smart quote. Say exactly that, rather than just echoing the parser.
      errors.push(
        `content/${collection.dir}/${file}: not valid JSON (${(error as Error).message}). ` +
          'Check for a trailing comma, a missing quote, or a curly " pasted from a document.',
      );
      continue;
    }

    validate(collection, file, parsed, errors);

    const slug = String(parsed.slug);
    const duplicate = seenSlugs.get(slug);
    if (duplicate) {
      errors.push(`content/${collection.dir}/${file}: slug "${slug}" is already used by ${duplicate}`);
    } else {
      seenSlugs.set(slug, file);
    }

    items.push(parsed);
  }

  return items.sort((a, b) => collection.sortBy(a).localeCompare(collection.sortBy(b)));
}

function render(collection: Collection, items: Record<string, unknown>[]): string {
  return `// GENERATED FILE - DO NOT EDIT.
//
// Written by scripts/build-content.ts from content/${collection.dir}/*.json.
// To change this content, edit the JSON file for that item - one file per item,
// named after its URL slug - and the next build regenerates this.
//
// NOTE ON rating / reviewCount: these are placeholder values from when the site
// was first built. They are deliberately not displayed in the UI and not emitted
// in structured data - publishing review counts that cannot be substantiated is a
// Google review-snippet policy violation and, under India's consumer protection
// rules on misleading advertising, a real exposure. Do not wire them back in.

import { ${collection.type} } from '../../types';

export const ${collection.exportName}: ${collection.type}[] = ${JSON.stringify(items, null, 2)};
`;
}

function main(): void {
  const errors: string[] = [];
  const summary: string[] = [];

  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const collection of COLLECTIONS) {
    const items = readCollection(collection, errors);
    fs.writeFileSync(path.join(OUT_DIR, collection.file), render(collection, items), 'utf8');
    summary.push(`${items.length} ${collection.dir}`);
  }

  if (errors.length) {
    console.error(`\n[content] ${errors.length} problem(s) found:\n`);
    for (const error of errors) console.error(`  - ${error}`);
    console.error('\nNothing was deployed. Fix the files above and commit again.\n');
    process.exit(1);
  }

  console.log(`[content] Generated ${summary.join(', ')} from content/.`);
}

main();
