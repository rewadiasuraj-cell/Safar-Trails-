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
| Critical 3 | `www.safartrails.co.in` returning HTTP 522 | **NOT fixed — owner action.** Cannot be fixed from this repo; needs a Cloudflare Redirect Rule. See [seo-implementation.md](./seo-implementation.md), "Canonical host" |
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
the relevant Cloudflare or Google account.

1. **Add the www → apex Redirect Rule in Cloudflare.** The only one of the
   audit's three critical issues still open, and the only item here that is not
   a Google account task.
2. **Verify the site in Search Console** and submit the sitemap.
3. **Confirm the GA4 property** `G-0VMQX8NMJZ` is real and receiving data, then
   mark the conversion events.
4. **Update the Google Business Profile** — categories, description, address so
   it matches the website exactly.
5. **Create the Google Ads account** and build the campaigns.
6. **Consolidate the Instagram handles** and fix the bios.
7. **Set up `info@safartrails.co.in`** to replace the Gmail address.

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
2. **The review counts shown on destination and package pages.** `destinationsData.ts`
   and `packagesData.ts` carry ratings like *Kashmir 4.9 from 1,420 reviews*,
   *Goa 4.8 from 2,180*, *Kerala 4.9 from 1,890* — over ten thousand reviews in
   total, against a business with a handful of real ones. These look like
   placeholder values from when the site was built.

   They are no longer emitted in structured data (see below), but they are still
   **displayed on the pages**. Publishing review counts you cannot substantiate
   is a trust problem regardless of schema, and under India's consumer
   protection rules on misleading advertising it is a real exposure. Either
   replace them with true numbers or remove the counts from the UI. This is a
   content decision, so it has been flagged rather than changed.

   No `aggregateRating` is published anywhere now. The organisation-level switch
   (`ORGANIZATION_RATING_ENABLED`) stays off until genuine on-site reviews exist,
   and the destination/package blocks never carry one — `TouristDestination` and
   `TouristTrip` are not types Google supports review snippets on, so the field
   bought nothing and carried manual-action risk.
