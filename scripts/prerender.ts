/**
 * Build-time prerendering.
 *
 * The September 2026 audit found the two problems this script exists to fix:
 *
 *   Critical #1 - all 32 URLs served an identical <title>, meta description and
 *                 canonical (always https://safartrails.co.in/), so every page
 *                 told Google it was the homepage.
 *   Critical #2 - the served HTML was a 6 KB shell: 0 H1, 0 images and 68
 *                 characters of visible text. Everything else needed JavaScript,
 *                 and Google's render queue is both delayed and unreliable for
 *                 small sites.
 *
 * Rather than migrating the whole app to a new meta-framework, this runs after
 * `vite build` and writes one real HTML file per route. Each file carries that
 * route's own head tags plus its actual body content - headings, itinerary,
 * FAQ and internal links - drawn from the same data the React components
 * render. The markup goes *inside* #root, so React's createRoot() replaces it
 * on mount: crawlers and no-JS visitors get the full text, everyone else gets
 * the normal app. Nothing is hidden from users that is shown to crawlers.
 *
 * Every route comes from content/ via src/data/generated, so this build is
 * deterministic and needs no network: the same commit always produces the same
 * pages, and a CMS outage can no longer change what gets deployed.
 *
 * Run: bun run prerender (automatically included in `bun run build`)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { allStaticRoutes, RouteSeo, sitemapRoutes } from '../src/lib/seo/routes';
import { BRAND_NAME, SITE_URL, absoluteUrl } from '../src/lib/seo/siteConfig';
import { escapeHtml } from '../src/lib/seo/textUtils';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PUBLIC = path.join(ROOT, 'public');

/* ------------------------------------------------------------------ *
 * Head rewriting
 * ------------------------------------------------------------------ */

function replaceTag(html: string, pattern: RegExp, replacement: string): string {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function applyHead(template: string, seo: RouteSeo): string {
  let html = template;

  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(seo.title)}</title>`);

  html = replaceTag(
    html,
    /<meta\s+name="description"[^>]*>/,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
  );

  html = replaceTag(
    html,
    /<meta\s+name="robots"[^>]*>/,
    `<meta name="robots" content="${escapeHtml(seo.robots)}" />`,
  );

  html = replaceTag(
    html,
    /<link\s+rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`,
  );

  const ogAlt = `${seo.h1} — ${BRAND_NAME}`;
  const metaReplacements: [RegExp, string][] = [
    [/<meta\s+property="og:type"[^>]*>/, `<meta property="og:type" content="${seo.ogType}" />`],
    [/<meta\s+property="og:url"[^>]*>/, `<meta property="og:url" content="${escapeHtml(seo.canonical)}" />`],
    [/<meta\s+property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeHtml(seo.title)}" />`],
    [/<meta\s+property="og:description"[^>]*>/, `<meta property="og:description" content="${escapeHtml(seo.description)}" />`],
    [/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${escapeHtml(seo.ogImage)}" />`],
    [/<meta\s+property="og:image:alt"[^>]*>/, `<meta property="og:image:alt" content="${escapeHtml(ogAlt)}" />`],
    [/<meta\s+name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`],
    [/<meta\s+name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`],
    [/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="${escapeHtml(seo.ogImage)}" />`],
    [/<meta\s+name="twitter:image:alt"[^>]*>/, `<meta name="twitter:image:alt" content="${escapeHtml(ogAlt)}" />`],
  ];
  for (const [pattern, replacement] of metaReplacements) {
    html = replaceTag(html, pattern, replacement);
  }

  // Swap the site-wide graph for this route's graph.
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${seo.jsonLd.replace(/</g, '\\u003c')}</script>`,
  );

  return html;
}

/* ------------------------------------------------------------------ *
 * Body content
 * ------------------------------------------------------------------ */

function renderSections(seo: RouteSeo): string {
  return seo.sections
    .map((section) => {
      const paragraphs = (section.paragraphs ?? [])
        .map((text) => `<p>${escapeHtml(text)}</p>`)
        .join('');
      const bullets = section.bullets?.length
        ? `<ul>${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
        : '';
      return `<section><h2>${escapeHtml(section.heading)}</h2>${paragraphs}${bullets}</section>`;
    })
    .join('');
}

function renderFaqs(seo: RouteSeo): string {
  if (!seo.faqs.length) return '';
  const items = seo.faqs
    .map((faq) => `<h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p>`)
    .join('');
  return `<section><h2>Frequently asked questions</h2>${items}</section>`;
}

function renderLinks(seo: RouteSeo): string {
  if (!seo.relatedLinks.length) return '';
  const items = seo.relatedLinks
    .map((link) => `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`)
    .join('');
  return `<nav aria-label="Related pages"><h2>Explore more</h2><ul>${items}</ul></nav>`;
}

/**
 * The static body React replaces on mount. Styled just enough to be readable if
 * a visitor lands here with JavaScript disabled or still loading.
 */
function renderBody(seo: RouteSeo): string {
  return [
    '<div class="prerendered-content">',
    `<h1>${escapeHtml(seo.h1)}</h1>`,
    `<p class="prerendered-intro">${escapeHtml(seo.intro)}</p>`,
    renderSections(seo),
    renderFaqs(seo),
    renderLinks(seo),
    `<p class="prerendered-contact">Talk to a ${escapeHtml(BRAND_NAME)} destination specialist for a free custom itinerary.</p>`,
    '</div>',
  ].join('');
}

const PRERENDER_STYLE = `<style>
  .prerendered-content{max-width:900px;margin:0 auto;padding:6rem 1.25rem 4rem;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,sans-serif;color:#1E293B;line-height:1.65}
  .prerendered-content h1{font-family:'Playfair Display',Georgia,serif;font-size:clamp(1.75rem,4vw,2.5rem);line-height:1.2;color:#0A0A0A;margin:0 0 1rem}
  .prerendered-content h2{font-family:'Playfair Display',Georgia,serif;font-size:clamp(1.25rem,3vw,1.6rem);color:#0A0A0A;margin:2rem 0 .75rem}
  .prerendered-content h3{font-size:1.05rem;color:#0A0A0A;margin:1.25rem 0 .35rem}
  .prerendered-content p{margin:0 0 1rem}
  .prerendered-content ul{margin:0 0 1rem;padding-left:1.25rem}
  .prerendered-content li{margin-bottom:.45rem}
  .prerendered-content a{color:#B44900;text-decoration:underline}
  .prerendered-intro{font-size:1.05rem;color:#334155}
</style>`;

function applyBody(html: string, seo: RouteSeo): string {
  return html
    .replace('</head>', `${PRERENDER_STYLE}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${renderBody(seo)}</div>`);
}

/* ------------------------------------------------------------------ *
 * Sitemap
 * ------------------------------------------------------------------ */

function renderSitemap(routes: RouteSeo[]): string {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = routes
    .map(
      (route) =>
        `  <url>\n    <loc>${absoluteUrl(route.path)}</loc>\n    <lastmod>${lastmod}</lastmod>\n` +
        `    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority.toFixed(2)}</priority>\n  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

function writeRoute(templateHtml: string, seo: RouteSeo): void {
  const html = applyBody(applyHead(templateHtml, seo), seo);
  const outDir = seo.path === '/' ? DIST : path.join(DIST, seo.path);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
}

function main() {
  const templatePath = path.join(DIST, 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error('dist/index.html not found - run `vite build` before prerendering.');
  }
  const template = fs.readFileSync(templatePath, 'utf8');

  const routes = allStaticRoutes();

  for (const route of routes) {
    if (route.path === '/404') continue; // written separately as dist/404.html
    writeRoute(template, route);
  }

  // Cloudflare Pages serves /404.html for unmatched paths with a real 404 status.
  const notFound = routes.find((route) => route.path === '/404')!;
  fs.writeFileSync(
    path.join(DIST, '404.html'),
    applyBody(applyHead(template, notFound), notFound),
    'utf8',
  );

  // Sitemap: written to dist for deployment and to public/ so it stays in git.
  // A sitemap must list only canonical URLs. Any path that canonicalises
  // elsewhere is reachable but must not be submitted - asking Google to index a
  // URL that the page's own tag disowns is a contradictory signal.
  const indexable = sitemapRoutes().filter(
    (route) => !route.robots.startsWith('noindex') && absoluteUrl(route.path) === route.canonical,
  );
  const deduped = [...new Map(indexable.map((route) => [route.path, route])).values()].sort((a, b) =>
    b.priority - a.priority || a.path.localeCompare(b.path),
  );
  const sitemap = renderSitemap(deduped);
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');
  fs.writeFileSync(path.join(PUBLIC, 'sitemap.xml'), sitemap, 'utf8');

  console.log(
    `[prerender] Wrote ${routes.length} static pages and a ${deduped.length}-URL sitemap ` +
      `for ${SITE_URL}.`,
  );
}

try {
  main();
} catch (error) {
  console.error('[prerender] Failed:', error);
  process.exit(1);
}
