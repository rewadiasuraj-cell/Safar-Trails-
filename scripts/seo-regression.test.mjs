import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { fitDescription, fitTitle } from '../src/lib/seo/textUtils.ts';
import * as site from '../src/lib/seo/siteConfig.ts';
import { sitemapRoutes } from '../src/lib/seo/routes.ts';
import { pathToView } from '../src/lib/pathToView.ts';

const root = fileURLToPath(new URL('../', import.meta.url));

test('navigation highlights the same page for slash and slashless URLs', () => {
  for (const [url, view] of [['/packages/', 'packages'], ['/ai-planner/', 'ai-planner'], ['/destinations/', 'destinations'], ['/guides/', 'guides'], ['/about-us/', 'why-us'], ['/contact-us/', 'contact-us']]) {
    assert.equal(pathToView(url), view, url);
    assert.equal(pathToView(url.slice(0, -1)), view, url);
  }
});

test('metadata preserves a complete sentence instead of cutting off its CTA', () => {
  const description = 'Custom Kashmir, Kerala, Himachal & Rajasthan tour packages, planned by AI and refined by real travel experts. 24x7 support, transparent pricing. Get a free itinerary!';
  assert.equal(fitDescription(description), description);
});

test('long titles retain the complete topic instead of an ellipsis', () => {
  const title = 'Best Time to Visit Kashmir: A Seasonal Guide for Snow, Tulips and Autumn';
  assert.equal(fitTitle(title), title);
});

test('page canonicals match directory URLs without changing asset URLs', () => {
  assert.equal(site.canonicalPageUrl('/about-us'), 'https://safartrails.co.in/about-us/');
  assert.equal(site.canonicalPageUrl('/about-us/'), 'https://safartrails.co.in/about-us/');
  assert.equal(site.canonicalPageUrl('/'), 'https://safartrails.co.in/');
  assert.equal(site.absoluteUrl('/og-image.jpg'), 'https://safartrails.co.in/og-image.jpg');
});

test('all indexable routes emit complete metadata and consistent schema URLs', () => {
  for (const route of sitemapRoutes()) {
    assert.ok(route.canonical.endsWith('/'), route.path);
    assert.ok(!route.title.endsWith('…'), route.path);
    assert.ok(!route.description.endsWith('…'), route.path);
    const graph = JSON.parse(route.jsonLd)['@graph'];
    for (const entity of graph) {
      if (['Article', 'TouristTrip', 'TouristDestination'].includes(entity['@type'])) {
        assert.equal(entity.url, route.canonical, route.path);
      }
    }
  }
});

test('URL guard rejects the live slash redirect loop and accepts the fixed directory', () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'safar-seo-'));
  try {
    for (const dir of ['scripts', 'public', 'dist/about-us']) {
      fs.mkdirSync(path.join(fixture, dir), { recursive: true });
    }
    fs.copyFileSync(path.join(root, 'scripts/check-urls.ts'), path.join(fixture, 'scripts/check-urls.ts'));
    fs.writeFileSync(path.join(fixture, 'dist/about-us/index.html'), '<h1>About Safar Trails</h1>');
    fs.writeFileSync(path.join(fixture, 'dist/sitemap.xml'), '<urlset><url><loc>https://safartrails.co.in/about-us/</loc></url></urlset>');
    const run = () => spawnSync(process.execPath, [path.join(root, 'node_modules/tsx/dist/cli.mjs'), path.join(fixture, 'scripts/check-urls.ts')], { encoding: 'utf8' });
    fs.writeFileSync(path.join(fixture, 'public/_redirects'), '/about-us/ /about-us 301\n');
    const broken = run();
    assert.equal(broken.status, 1, broken.stderr);
    assert.match(broken.stderr, /loops on Pages/);
    fs.writeFileSync(path.join(fixture, 'public/_redirects'), '/about /about-us/ 301\n');
    const fixed = run();
    assert.equal(fixed.status, 0, fixed.stderr);
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});
