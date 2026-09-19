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
 * One _redirects source pattern as a regex.
 *
 * `*` is a splat and matches anything INCLUDING the empty string - which is the
 * whole reason /packages/* swallowed the bare /packages. `:name` is a
 * placeholder and matches exactly one non-empty path segment, which is why the
 * package rule uses one.
 */
function sourceToRegExp(source: string): RegExp {
  const escaped = source
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/:[A-Za-z_][A-Za-z0-9_]*/g, '[^/]+')
    .replace(/\*/g, '.*');
  return new RegExp(`^${escaped}$`);
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
    .map((parts) => sourceToRegExp(parts[0]));
}

/**
 * Every rule in _redirects, in file order, with its status.
 *
 * Order matters here where readRedirectPatterns() can ignore it: Cloudflare
 * Pages applies the FIRST matching rule, so a 200 rewrite listed above a 301
 * protects a path from it. A check that ignored order would report a false
 * positive for exactly the fix that makes /packages work.
 */
function readOrderedRules(): {
  pattern: RegExp;
  status: string;
  source: string;
  target: string;
}[] {
  if (!fs.existsSync(REDIRECTS)) return [];

  return fs
    .readFileSync(REDIRECTS, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split(/\s+/))
    .filter((parts) => parts[0]?.startsWith('/') && parts.length >= 3)
    .map((parts) => ({
      source: parts[0],
      target: parts[1],
      status: parts[2].replace('!', ''),
      pattern: sourceToRegExp(parts[0]),
    }));
}

/**
 * Nothing we publish may redirect away from itself.
 *
 * /packages shipped broken for days exactly this way. It is a prerendered page
 * and sits in the sitemap, but the `/packages/* -> /tour-packages/:splat` rule
 * below it also matched the bare /packages, so the listing 301'd to a URL that
 * does not exist and served a 404 to visitors and to Googlebot. The existing
 * baseline check could not see it: that one asks whether URLs have been dropped
 * from the sitemap, and this URL was present the whole time.
 *
 * So: take what we are actually asking Google to index, and confirm the edge
 * will answer each one with a page rather than send it somewhere else.
 */
function checkSitemapIsServable(built: string[]): string[] {
  const rules = readOrderedRules();
  const problems: string[] = [];

  /*
   * No rule may point at a SUBDIRECTORY index.html.
   *
   * Pages canonicalises <dir>/index.html back to <dir>, so a rule whose target
   * is one redirects into its own source and the page dies with
   * ERR_TOO_MANY_REDIRECTS. Not theoretical: the first attempt at fixing
   * /packages rewrote it to /packages/index.html and took the listing down
   * harder than the 404 it was meant to fix. The servable check above could not
   * see it, because a 200 rewrite reads as "this path is handled".
   *
   * The root /index.html is exempt and must stay that way - it is the SPA shell
   * the three fallbacks below serve, it has worked in production throughout, and
   * there is no directory for Pages to canonicalise it back to.
   */
  for (const rule of rules) {
    if (/^\/.+\/index\.html$/.test(rule.target)) {
      problems.push(
        `"${rule.source}" points at ${rule.target} - Pages rewrites that back to ` +
          `${rule.target.replace(/\/index\.html$/, '')} and the request loops`,
      );
    }
  }

  for (const url of built) {
    const urlPath = url.replace(SITE, '') || '/';

    /*
     * Both spellings, because the edge moves between them on its own.
     *
     * /packages is what the sitemap says and what a naive reading of
     * `/packages/*` does not match - the pattern needs the slash. The edge
     * resolves the directory to /packages/ first, and THAT matches the wildcard
     * with an empty splat. Checking only the sitemap spelling is what let this
     * ship: the rule looked like it could not apply, and it did.
     */
    const spellings = urlPath === '/' ? ['/'] : [urlPath, `${urlPath}/`];

    const shadowed = spellings
      .map((spelling) => ({ spelling, rule: rules.find((r) => r.pattern.test(spelling)) }))
      .find(
        ({ rule }) =>
          rule &&
          /^3\d\d$/.test(rule.status) &&
          // A trailing-slash rule that points back at this same path is
          // canonicalisation, not shadowing - /about-us/ -> /about-us is
          // exactly what we want. Only a redirect to somewhere ELSE is a bug.
          rule.target !== urlPath,
      );

    if (shadowed?.rule) {
      problems.push(
        `${urlPath} is in the sitemap but "${shadowed.rule.source}" ` +
          `${shadowed.rule.status}s ${shadowed.spelling} away`,
      );
      continue;
    }

    const firstMatch = rules.find((rule) => rule.pattern.test(urlPath));

    // A 200 rewrite is fine - it names the file to serve. Otherwise the
    // prerendered file has to be there, or the edge has nothing to answer with.
    if (!firstMatch || firstMatch.status !== '200') {
      const file =
        urlPath === '/'
          ? path.join(ROOT, 'dist', 'index.html')
          : path.join(ROOT, 'dist', urlPath, 'index.html');
      if (!fs.existsSync(file)) {
        problems.push(`${urlPath} is in the sitemap but ${path.relative(ROOT, file)} was not built`);
      }
    }
  }

  return problems;
}

function main(): void {
  const servable = checkSitemapIsServable(readBuiltUrls());
  if (servable.length) {
    console.error(`\n[urls] ${servable.length} URL(s) in the sitemap will not serve a page:\n`);
    for (const problem of servable) console.error(`         ${problem}`);
    console.error(
      '\n       A URL we submit to Google has to answer with its own page. Move the\n' +
        '       rule in public/_redirects below a 200 rewrite for this path, or take\n' +
        '       the URL out of the sitemap.\n',
    );
    process.exit(1);
  }
  console.log('[urls] Every sitemap URL serves its own page.');

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
