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

## Two decisions that needed the owner — both now settled

1. **The street address — settled.** The site said "Dwarka Mor", the Google
   Business Profile said "Nawada". The owner confirmed the profile is correct,
   so `POSTAL_ADDRESS` in `src/lib/seo/siteConfig.ts` was changed to match it and
   the contact page, which had the old line typed out by hand, now reads from
   that same object. See `google-business-profile.md` §1 for the exact string to
   compare against the live listing.

2. **The invented review counts — settled, removed.** `destinationsData.ts` and
   `packagesData.ts` carried ratings like *Kashmir 4.9 from 1,420 reviews*, *Goa
   4.8 from 2,180*, *Kerala 4.9 from 1,890* — over ten thousand reviews against a
   business with a handful of real ones. Placeholders from when the site was
   built, and they had been published to Google in structured data.

   They are gone from the schema and from the pages. Cards now lead with
   "From ₹X" and factual badges, and the Trust section links to the real Google
   profile where the rating can be verified in one tap. Nothing on the site now
   states a rating or a review count.

   **This applies to anything written for the profile too.** The GBP description
   draft originally opened with "500+ happy travelers rated us 4.9★", from the
   same placeholder set; it was rewritten without numbers. Google suspends
   listings over unverifiable claims.

### Still open, and also the owner's

The author bylines on six guides — *Aditi Sharma*, *Dr. Priya Nair*, *Rohan
Deshmukh*, *Tariq Mir*, *Priya Rawat* — use Unsplash stock portraits as their
avatars. If these are real colleagues, the fix is real photographs. If they are
not real people, this is the same class of problem as the review counts: Google's
E-E-A-T guidance weighs author credibility, and a reverse image search resolves
it instantly. The five migrated guides already use the brand mark with
"SafarTrails Editorial Team", which is the honest fallback.

   No `aggregateRating` is published anywhere now. The organisation-level switch
   (`ORGANIZATION_RATING_ENABLED`) stays off until genuine on-site reviews exist,
   and the destination/package blocks never carry one — `TouristDestination` and
   `TouristTrip` are not types Google supports review snippets on, so the field
   bought nothing and carried manual-action risk.
