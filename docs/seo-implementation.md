# SEO Implementation

How per-page SEO works in this codebase, and how to change it.

## The problem this replaced

The audit fetched the raw HTML of 24 URLs and got byte-identical head tags every
time:

```
Title      (every page): SafarTrails — AI-Powered India Holiday Packages & Custom Itineraries   (67 chars)
Meta       (every page): AI plans. Experts perfect. Discover bespoke holiday packages across…
Canonical  (every page): https://safartrails.co.in/
```

A canonical tag is a page telling Google "this is my real address". Every page
pointing at the homepage means `/destinations/kerala` was declaring itself *to
be* the homepage. Google honours that: it collapses the duplicates and ranks
one page. Nine destination pages, nine packages and eight guides were
effectively invisible, no matter how good the content was.

The body was the second half of the problem: 6 KB of HTML with zero `<h1>`,
zero `<img>` and 68 characters of visible text. Everything else was built by
JavaScript in the browser. Google does render JavaScript, but on a second,
slower pass that small sites frequently never get.

## The three pieces

```
src/lib/seo/
  siteConfig.ts       Brand NAP: phone, address, email, socials. One source of truth.
  textUtils.ts        Length fitting — titles to 60 chars, descriptions to 158.
  structuredData.ts   JSON-LD builders (TravelAgency, TouristTrip, Article, FAQPage…).
  routes.ts           resolveRouteSeo(pathname) -> everything one page needs.
  Seo.tsx             Applies it to document.head on client-side navigation.

scripts/prerender.ts  Runs after `vite build`; writes one HTML file per route.
```

`routes.ts` is the important one. `resolveRouteSeo('/destinations/kashmir')`
returns the title, description, canonical, OG tags, robots directive, JSON-LD
graph, H1, intro, body sections, FAQs and internal links for that page. Both
runtimes use it — the build and the browser — so they cannot disagree.

## How prerendering works

`bun run build` (or `npm run build`) runs `vite build`, then
`scripts/prerender.ts`, which:

1. Reads `dist/index.html` as a template.
2. For every route, rewrites the head tags and injects the page's real content
   *inside* `<div id="root">`.
3. Writes it to `dist/<path>/index.html`.
4. Writes `dist/404.html` and regenerates `sitemap.xml`.

Putting the content inside `#root` matters: React's `createRoot().render()`
replaces the container's children on mount. Crawlers and visitors whose
JavaScript has not loaded get the full text; everyone else gets the normal app a
moment later. Nothing is hidden from users that is shown to crawlers — the
prerendered text is a faithful summary of what the page renders, which is the
line between prerendering and cloaking.

Measured result:

| | Before | After |
|---|---|---|
| Homepage HTML | 6 KB | 10 KB |
| Destination page | 6 KB | 16 KB |
| `<h1>` per page | 0 | 1 |
| Visible text, destination page | 68 chars | ~3,800 chars (~600 words) |
| Distinct canonicals | 1 | 42 |

### Sanity-backed pages

The build also asks Sanity for published slugs and prerenders those too. If
Sanity is unreachable (offline build, restrictive network) the build logs a
warning and continues with the locally-authored routes — it never fails. CMS
pages still work in that case; they just fall back to the SPA shell with correct
head tags from `resolveRouteSeo`'s dynamic fallback, which is the part that
matters most.

## Editing page copy

**All title and description copy lives in `src/lib/seo/routes.ts`.** Do not edit
`index.html` — the prerender overwrites it.

- **Static pages** (`/`, `/destinations`, `/packages`, `/ai-planner`, `/guides`,
  `/about-us`, `/contact-us`, `/404`) — the `STATIC_PAGES` array.
- **Destination pages** — generated from `src/data/destinationsData.ts`. The
  `seoDescription` field there is used as-is. Titles come from
  `DESTINATION_TITLE_OVERRIDES` because the stored `seoTitle` values run to 70+
  characters, which Google truncates; the overrides carry the same head keyword
  inside the ~60-character limit.
- **Package and guide pages** — generated from `packagesData.ts` and
  `guidesData.ts`, with `fitTitle`/`fitDescription` keeping lengths in range.

After any change: `npm run build` then check `dist/<route>/index.html`.

### Live per-page metadata

| URL | Title | Chars |
|---|---|---|
| `/` | Custom India Tour Packages – AI Trip Planner \| Safar Trails | 59 |
| `/destinations` | India Tour Packages by Destination \| Safar Trails | 48 |
| `/packages` | India Holiday Packages – Curated Tours \| Safar Trails | 52 |
| `/ai-planner` | AI Trip Planner India – Free Custom Itinerary \| Safar Trails | 59 |
| `/guides` | India Travel Guides – Costs, Seasons & Tips \| Safar Trails | 57 |
| `/destinations/kashmir` | Kashmir Tour Packages – Houseboat & Gulmarg \| Safar Trails | 57 |
| `/destinations/kerala` | Kerala Tour Packages – Munnar & Alleppey \| Safar Trails | 54 |
| `/destinations/chardham-yatra` | Chardham Yatra Package 2026 – Custom & Group \| Safar Trails | 58 |
| `/destinations/goa` | Goa Tour Packages – Beaches & Boutique Stays \| Safar Trails | 58 |
| `/destinations/rajasthan` | Rajasthan Tour Packages – Forts & Desert \| Safar Trails | 54 |
| `/destinations/himachal-pradesh` | Himachal Tour Packages – Manali & Shimla \| Safar Trails | 54 |
| `/destinations/uttarakhand` | Uttarakhand Packages – Hills & Rishikesh \| Safar Trails | 54 |
| `/destinations/northeast-india` | Northeast India Tours – Meghalaya & Assam \| Safar Trails | 55 |
| `/destinations/andaman` | Andaman Tour Packages – Havelock & Scuba \| Safar Trails | 54 |
| `/destinations/ladakh` | Ladakh Tour Packages – Pangong & Nubra \| Safar Trails | 52 |

Package and guide titles are generated per item; run a build and read them out
of `dist/` if you need the full list.

## Structured data

Every page emits one `@graph` block. `TravelAgency` and `WebSite` are on every
page; the rest depend on page type:

| Page type | Additional types |
|---|---|
| Destination | `TouristDestination` (with `includesAttraction`), `BreadcrumbList`, `FAQPage` |
| Package | `TouristTrip` with one `subTrip` per itinerary day, `Offer`, `BreadcrumbList` |
| Guide | `Article`, `BreadcrumbList` |
| Hub / static | `BreadcrumbList` |

`TouristTrip` + `subTrip` is the schema.org-sanctioned way to express a
multi-day itinerary, exactly as the playbook's Section 6 describes.

Validate after deploying: <https://search.google.com/test/rich-results>

**On `aggregateRating`.** Destination and package pages emit it because those
pages display that rating and count on-screen, which is what Google's policy
requires. The organisation-level rating is off by default
(`ORGANIZATION_RATING_ENABLED` in `siteConfig.ts`). Turning it on with numbers
copied from the Google Business Profile would violate Google's review-snippet
policy — a site may not re-mark-up reviews collected on Google as its own.

## Domain, redirects and 404s

`public/_redirects` (Cloudflare Pages):

- `www.safartrails.co.in/*` → `https://safartrails.co.in/:splat`, 301, both
  schemes, forced. This is the HTTP 522 fix.
- `/about` → `/about-us`, `/contact` → `/contact-us`, `/faq` and `/reviews` →
  `/about-us`, `/blog/*` → `/guides`. The audit found `/about` and `/about-us`
  both live and both returning 200, which is duplicate content.
- SPA rewrites scoped to `/destinations/*`, `/packages/*`, `/tour-packages/*`
  and `/guides/*` only. A blanket `/* /index.html 200` would answer 200 for
  every junk URL, which is the soft-404 pattern the audit warned about.
  Anything outside those prefixes falls through to `404.html` and gets a real
  HTTP 404.

`server.ts` mirrors the same behaviour for the Express deployment.

**Known limitation:** a bad slug *under* one of those four prefixes (for example
`/destinations/not-a-real-place`) still returns 200 with the React 404 page,
because the CMS owns which slugs are valid and the CDN cannot know. The page is
`noindex`, so it will not be indexed, but it is not a hard 404. Resolving it
properly means either prerendering every valid CMS slug at build time (already
happens when Sanity is reachable — so rebuild after publishing new content) or
moving to server-side rendering.

## Verifying after a deploy

```bash
# Every page should have its own canonical, matching its own URL
curl -s https://safartrails.co.in/destinations/kashmir | grep -E '<title>|canonical'

# www must 301, not 522
curl -sI https://www.safartrails.co.in/ | head -3

# A junk URL must return 404, not 200
curl -s -o /dev/null -w '%{http_code}\n' https://safartrails.co.in/xyz-fake-page

# The sitemap should list 42 URLs
curl -s https://safartrails.co.in/sitemap.xml | grep -c '<url>'
```
