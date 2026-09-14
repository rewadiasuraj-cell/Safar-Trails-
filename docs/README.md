# Safar Trails — Growth & Technical Documentation

Companion to *Safar Trails: Complete SEO & Digital Growth Playbook + Website Audit*
(14 September 2026). The playbook set the strategy and found the problems; this
folder records what was fixed in code and what still needs a human with account
access.

## Read in this order

| Doc | What it covers | Who does it |
|---|---|---|
| [seo-implementation.md](./seo-implementation.md) | What changed in the codebase, and how to edit page titles, descriptions and schema from now on | Developer |
| [analytics-conversions.md](./analytics-conversions.md) | GA4 verification, the five conversion events, importing them into Ads | Owner + Developer |
| [google-search-console.md](./google-search-console.md) | Verification, sitemap submission, what to watch weekly | Owner |
| [google-business-profile.md](./google-business-profile.md) | Categories, ready-to-paste description, review engine | Owner |
| [google-ads.md](./google-ads.md) | Campaign build sheet: keywords, negatives, ad copy, seasonal timing, budget | Owner |
| [rollout-and-kpis.md](./rollout-and-kpis.md) | 30/60/90-day plan and the KPI table with targets | Owner |

## Status of the audit's findings

### Fixed in code

| # | Audit finding | Status |
|---|---|---|
| Critical 1 | Identical title / meta / canonical on all 32 URLs | **Fixed** — per-route metadata, self-referencing canonicals |
| Critical 2 | 6 KB HTML shell, 0 H1, 68 characters of text | **Fixed** — every route prerendered with real content (~600 words on destination pages) |
| Critical 3 | `www.safartrails.co.in` returning HTTP 522 | **Fixed in config** — needs a deploy to take effect, then re-test |
| High 2 | Soft 404s — junk URLs answering 200 | **Fixed** — real 404 status and a noindex 404 page |
| High 3 | No GA4 / conversion events | **Fixed** — GA4 tag plus five conversion events |
| High 1 | Sitemap missing live pages | **Fixed** — generated at build time from the route table |
| High 4 | Two different phone numbers published | **Fixed on the website** — one source of truth; the social profiles still need updating by hand |
| Medium 1 | "Travel with Trust" appearing nowhere | **Fixed on the website** — footer, OG tags, schema; social bios still need updating |
| Medium 2/3/4 | Instagram handle split, 0 Facebook reviews, Gmail address | **Owner action** — see [google-business-profile.md](./google-business-profile.md) |
| — | Per-page schema missing | **Fixed** — TouristTrip, TouristDestination, Article, FAQPage, BreadcrumbList |
| — | WCAG 2.2 AA gaps (not in the audit, found while working) | **Fixed** — contrast, focus, labels, headings, touch targets, 320px reflow |

### Blocked on account access

Nothing below can be done from the repository. Each needs someone signed in to
the relevant Google account.

1. **Verify the site in Search Console** and submit the sitemap.
2. **Confirm the GA4 property** `G-0VMQX8NMJZ` is real and receiving data, then
   mark the conversion events.
3. **Update the Google Business Profile** — categories, description, address so
   it matches the website exactly.
4. **Create the Google Ads account** and build the campaigns.
5. **Consolidate the Instagram handles** and fix the bios.
6. **Set up `info@safartrails.co.in`** to replace the Gmail address.

## The one ordering rule

Do not start Google Ads until Search Console verification, the GA4 conversion
check and the www redirect are all confirmed working. Ads traffic landing on a
site whose conversions are not tracked is money spent with nothing to learn
from. The playbook puts this at day 25-30 for the same reason.

## Two decisions that need the owner, not a developer

1. **The street address.** The website footer says "Dwarka Mor"; the Google
   Business Profile says "Nawada". Both are now consistent *within* the site
   (`src/lib/seo/siteConfig.ts`), but the profile still disagrees. Decide which
   is correct and make both match character for character — NAP consistency is a
   direct local-ranking factor.
2. **Whether to publish an aggregate rating in schema.** It is deliberately
   switched off (`ORGANIZATION_RATING_ENABLED = false`). Google's review-snippet
   policy only allows ratings a site collects and displays itself; re-publishing
   Google Business Profile ratings as your own markup is a policy violation that
   risks a manual action. Turn it on once genuine on-site reviews exist.
