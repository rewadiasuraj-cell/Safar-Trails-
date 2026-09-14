/**
 * Guards the one thing this migration could quietly get wrong: dropping a URL
 * Google already knows about.
 *
 * The live sitemap had 48 URLs and indexing was requested for the priority ones.
 * If a page stops existing and nothing redirects to it, that work is thrown away
 * and a visitor following a search result gets a 404. This compares what the
 * build now produces against a snapshot of what is live, and fails when a URL
 * disappears without a redirect covering it.
 *
 * The snapshot is content/.sitemap-baseline.txt: the 48 URLs the live sitemap
 * held on the day of the migration, committed alongside the content itself.
 * Without it this passes with a warning, because there is nothing to compare
 * against. Keep it - it is the record of what Google already knows about, and
 * it stays useful for any future change that retires a URL.
 *
 * Run: npx tsx scripts/check-urls.ts   (after a build)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE = path.join(ROOT, 'content', '.sitemap-baseline.txt');
const BUILT = path.join(ROOT, 'dist', 'sitemap.xml');
const REDIRECTS = path.join(ROOT, 'public', '_redirects');
const SITE = 'https://safartrails.co.in';

function readBuiltUrls(): string[] {
  if (!fs.existsSync(BUILT)) {
    console.error('dist/sitemap.xml not found - run a build first.');
    process.exit(1);
  }
  return [...fs.readFileSync(BUILT, 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}

/**
 * Source patterns from _redirects that are genuine redirects, as regexes.
 *
 * Only 3xx rules count. The SPA rewrites are `200`, which serve the app shell -
 * the visitor lands on the React 404 page and the URL still resolves to nothing.
 * Treating those as coverage would hide exactly the failure this check exists to
 * find, so they are excluded.
 *
 * Comments, blank lines and the hostname-source fallbacks are skipped.
 */
function readRedirectPatterns(): RegExp[] {
  if (!fs.existsSync(REDIRECTS)) return [];

  return fs
    .readFileSync(REDIRECTS, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split(/\s+/))
    .filter((parts) => parts[0]?.startsWith('/') && /^3\d\d!?$/.test(parts[2] ?? ''))
    .map(
      (parts) =>
        new RegExp(`^${parts[0].replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`),
    );
}

function main(): void {
  if (!fs.existsSync(BASELINE)) {
    console.warn(
      '[urls] No content/.sitemap-baseline.txt, so there is nothing to compare against.\n' +
        '       It should be committed in this repository. Without it this check cannot\n' +
        '       tell you whether a live URL has been dropped.',
    );
    return;
  }

  const baseline = fs
    .readFileSync(BASELINE, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const built = new Set(readBuiltUrls());
  const patterns = readRedirectPatterns();

  const missing: string[] = [];
  const redirected: string[] = [];

  for (const url of baseline) {
    if (built.has(url)) continue;
    const urlPath = url.replace(SITE, '') || '/';
    if (patterns.some((pattern) => pattern.test(urlPath))) {
      redirected.push(url);
    } else {
      missing.push(url);
    }
  }

  console.log(`[urls] ${baseline.length} live URLs checked against ${built.size} in the new sitemap.`);
  if (redirected.length) {
    console.log(`[urls] ${redirected.length} no longer in the sitemap but covered by a redirect:`);
    for (const url of redirected) console.log(`         ${url}`);
  }

  if (missing.length) {
    console.error(`\n[urls] ${missing.length} live URL(s) would 404 - nothing serves them and no redirect covers them:\n`);
    for (const url of missing) console.error(`         ${url}`);
    console.error(
      '\n       Each of these is a page Google has indexed. Either add the content back\n' +
        '       under content/, or add a 301 in public/_redirects pointing at the nearest\n' +
        '       equivalent page. Do not merge until this is empty.\n',
    );
    process.exit(1);
  }

  console.log('[urls] No live URL is lost.');
}

main();
