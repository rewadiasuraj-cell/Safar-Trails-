import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'https://safartrails.co.in';
const SANITY_ENDPOINT = 'https://xmtc060o.apicdn.sanity.io/v2024-06-01/data/query/production?query=*[_type%20in%20[%22destination%22,%20%22tourPackage%22,%20%22guide%22]]{_type,%20%22slug%22:%20slug.current,%20_updatedAt}';

const today = new Date().toISOString().split('T')[0];

async function generateSitemapAndRedirects() {
  console.log('Generating dynamic sitemap.xml, robots.txt & _redirects...');
  const urls = [
    { loc: `${BASE_URL}/`, lastmod: today, changefreq: 'daily', priority: '1.0' },
    { loc: `${BASE_URL}/destinations`, lastmod: today, changefreq: 'daily', priority: '0.8' },
    { loc: `${BASE_URL}/packages`, lastmod: today, changefreq: 'daily', priority: '0.8' },
    { loc: `${BASE_URL}/guides`, lastmod: today, changefreq: 'daily', priority: '0.8' },
    { loc: `${BASE_URL}/about-us`, lastmod: today, changefreq: 'monthly', priority: '0.5' },
    { loc: `${BASE_URL}/contact-us`, lastmod: today, changefreq: 'monthly', priority: '0.5' },
    { loc: `${BASE_URL}/ai-planner`, lastmod: today, changefreq: 'monthly', priority: '0.5' },
  ];

  const destinationSlugs = new Set([
    'chardham-yatra',
    'kashmir',
    'goa',
    'kerala',
    'rajasthan',
    'himachal-pradesh',
    'andaman-nicobar',
    'andaman',
    'northeast-india',
    'uttarakhand',
  ]);

  try {
    const res = await fetch(SANITY_ENDPOINT);
    const data = await res.json();
    const items = data.result || [];

    items.forEach((item) => {
      if (!item.slug) return;
      const lastmod = item._updatedAt ? item._updatedAt.split('T')[0] : today;

      if (item._type === 'destination') {
        destinationSlugs.add(item.slug);
        urls.push({
          loc: `${BASE_URL}/destinations/${item.slug}`,
          lastmod,
          changefreq: 'weekly',
          priority: '0.8',
        });
      } else if (item._type === 'tourPackage') {
        urls.push({
          loc: `${BASE_URL}/packages/${item.slug}`,
          lastmod,
          changefreq: 'weekly',
          priority: '0.9',
        });
      } else if (item._type === 'guide') {
        urls.push({
          loc: `${BASE_URL}/guides/${item.slug}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.7',
        });
      }
    });
  } catch (e) {
    console.warn('Warning: Failed to fetch Sanity items for sitemap, using static fallbacks:', e);
  }

  // Ensure all static fallback destination slugs are in urls list
  destinationSlugs.forEach((slug) => {
    const loc = `${BASE_URL}/destinations/${slug}`;
    if (!urls.some((u) => u.loc === loc)) {
      urls.push({ loc, lastmod: today, changefreq: 'weekly', priority: '0.8' });
    }
  });

  // Static fallback package slugs
  const staticPkgSlugs = [
    'chardham-yatra-haridwar-yamunotri-gangotri-kedarnath-badrinath-10d9n',
    'chardham-yatra-package',
    'chardham-yatra-premium',
    'kashmir-escape-houseboat-bliss',
    'kashmir-premium-escape',
    'romantic-goa-boutique-beach-backwater',
    'goa-premium-holiday',
    'kerala-nature-munnar-alleppey-houseboat',
    'kerala-complete-holiday',
    'royal-rajasthan-heritage-desert-dunes',
    'rajasthan-heritage-tour',
    'himachal-manali-solang-sissu-retreat',
    'himachal-adventure-tour',
    'andaman-turquoise-havelock-scuba-dream',
    'andaman-premium',
    'meghalaya-living-root-bridges-dawki-shillong',
    'sikkim-explorer',
    'uttarakhand-rishikesh-mussoorie-corbett',
    'auli-himalayan-retreat',
  ];
  staticPkgSlugs.forEach((slug) => {
    const loc = `${BASE_URL}/packages/${slug}`;
    if (!urls.some((u) => u.loc === loc)) {
      urls.push({ loc, lastmod: today, changefreq: 'weekly', priority: '0.9' });
    }
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const robotsContent = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

  // Build per-destination redirect rules + tour-packages redirect
  const redirectLines = [
    ...Array.from(destinationSlugs).sort().map((slug) => `/destinations/${slug}/packages/*  /packages/:splat  301`),
    '/tour-packages/*  /packages/:splat  301',
  ];
  const redirectsContent = redirectLines.join('\n') + '\n';

  // Write to public folder
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xmlContent, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent, 'utf-8');
  fs.writeFileSync(path.join(publicDir, '_redirects'), redirectsContent, 'utf-8');

  // Also write to build/client if build directory exists
  const buildClientDir = path.resolve(process.cwd(), 'build/client');
  if (fs.existsSync(buildClientDir)) {
    fs.writeFileSync(path.join(buildClientDir, 'sitemap.xml'), xmlContent, 'utf-8');
    fs.writeFileSync(path.join(buildClientDir, 'robots.txt'), robotsContent, 'utf-8');
    fs.writeFileSync(path.join(buildClientDir, '_redirects'), redirectsContent, 'utf-8');
  }

  console.log(`Successfully generated sitemap.xml with ${urls.length} URLs, robots.txt, and _redirects with ${redirectLines.length} rules!`);
}

generateSitemapAndRedirects();
