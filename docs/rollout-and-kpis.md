# 30 / 60 / 90-Day Rollout & KPIs

## Where things stand

The playbook's bottom line was that the strategy scored 9/10 and the technical
execution 3/10 — Google was seeing one blank homepage instead of 32 pages. The
content, sitemap, guides, planner and Business Profile were already in place.

The code fixes in this branch address the technical half. What remains is
almost entirely account work plus the recurring habits that compound.

## Phase 1 — Foundation (Days 1–30)

**Deploy and confirm** *(day 1–3, developer)*
- [ ] Deploy this branch.
- [ ] `curl -sI https://www.safartrails.co.in/` returns 301, not 522.
- [ ] `curl -s https://safartrails.co.in/destinations/kashmir | grep canonical`
      shows its own URL.
- [ ] `curl -s -o /dev/null -w '%{http_code}' https://safartrails.co.in/xyz-fake` returns 404.
- [ ] Rich Results Test passes on a destination page and a package page.

**Search Console** *(day 1–5, owner)* — see [google-search-console.md](./google-search-console.md)
- [ ] Domain property added and verified by DNS.
- [ ] Sitemap submitted; 42 URLs discovered.
- [ ] Indexing requested for the 10 priority URLs.

**Analytics** *(day 3–7, owner + developer)* — see [analytics-conversions.md](./analytics-conversions.md)
- [ ] GA4 property `G-0VMQX8NMJZ` confirmed to exist and receive data.
- [ ] `source` and `destination` registered as custom dimensions.
- [ ] Four key events marked as conversions.

**Business Profile** *(day 5–10, owner)* — see [google-business-profile.md](./google-business-profile.md)
- [ ] Address reconciled with the website, character for character.
- [ ] One phone number across website, profile, Facebook, Instagram.
- [ ] Description pasted; categories confirmed.
- [ ] 10+ real photos uploaded.

**Brand cleanup** *(day 10–15, owner)*
- [ ] Instagram consolidated to one handle; bio and link updated.
- [ ] "Travel with Trust" added to both social bios.
- [ ] First Facebook reviews requested.
- [ ] `info@safartrails.co.in` created; `PRIMARY_EMAIL` updated in `siteConfig.ts`.

**Baseline measurement** *(day 5, owner)*
- [ ] Run <https://pagespeed.web.dev> on the homepage and one destination page.
      Record LCP, INP and CLS. Server response was already excellent
      (TTFB 0.065s on Cloudflare); prerendering should improve LCP further
      because the first paint no longer waits on JavaScript.

## Phase 2 — Growth (Days 31–60)

- [ ] **Review engine running.** QR card at trip end, WhatsApp link same day,
      every review replied to within 24 hours. This is the single highest-return
      habit on this list.
- [ ] **Google Ads live** — Search only, destination ad groups, matched to the
      current booking window. See [google-ads.md](./google-ads.md).
- [ ] **Weekly Business Profile post** — offer, guide link, or traveller story.
- [ ] **Instagram: 4 Reels a week.** Reels get far more non-follower reach than
      any other format, which is what a small account needs.
- [ ] **Trust wall on site** — Google reviews widget in the hero, real traveller
      photos, and 20-30 second video testimonials on the top destination pages.
- [ ] **Check Search Console Performance** for queries with impressions but weak
      click-through, and rewrite those titles in `src/lib/seo/routes.ts`.

### Instagram weekly rhythm

| Day | Format | Idea |
|---|---|---|
| Mon | Reel | "Kashmir in December – 7 days under ₹25K?" day-wise quick cuts |
| Tue | Story | Poll: "Mountains 🏔 or Beach 🏖?" |
| Wed | Reel | Traveller testimonial, 20 sec, their own voice |
| Thu | Carousel | "Packing checklist – Ladakh trip" (save-worthy) |
| Fri | Reel | Behind the scenes: the team planning a trip |
| Sat | Post | Traveller photo + review screenshot |
| Sun | Story | Weekend offer, countdown sticker |

Reels for reach → Stories for engagement → DM/WhatsApp for the booking. Put the
destination keyword and a CTA in every Reel caption.

## Phase 3 — Scale (Days 61–90)

- [ ] **Demand Gen remarketing** to non-converting visitors.
- [ ] **8-10 new guide pages** targeting long-tail queries. Guides are the
      cheapest way to rank; each new one is a new entry point.
- [ ] **Backlinks** — travel directories, the existing TripClap partner profile,
      guest posts on Indian travel blogs.
- [ ] **A/B test the CTA** — "Get Free Itinerary" against "Book Now". The
      `source` parameter in GA4 already segments this.
- [ ] **Monthly KPI review** against the table below.
- [ ] **Trim the quote form.** It currently asks for seven fields; the evidence
      is that every extra field costs 7-10% of submissions. Name, destination,
      travel date, phone is the target — the rest can be asked on WhatsApp.

## KPI table

Review weekly unless noted.

| KPI | Tool | Day 30 | Day 60 | Day 90 |
|---|---|---|---|---|
| Pages indexed | Search Console | 20+ | 30+ | 35+ |
| Organic clicks | Search Console | Baseline | +25% | +50% |
| Keywords in top 10 | Search Console | 2+ | 5+ | 10+ |
| Destination pages ranking for own name | Search Console | 3+ | 6+ | 9 |
| Core Web Vitals *(monthly)* | PageSpeed Insights | Measured | All "Good" | All "Good" |
| Free itinerary requests + WhatsApp leads | GA4 | Baseline | 25+/mo | 50+/mo |
| Ads click-through rate | Google Ads | — | >3% | >4% |
| Cost per lead | Google Ads | — | Measured | ₹300-600 |
| Business Profile actions *(monthly)* | GBP Insights | Baseline | +15% | +30% |
| Google reviews | GBP | 10+ | 30+ | 50+ (→100 by month 6) |
| Instagram DMs | IG Insights | 5/wk | 12/wk | 20/wk |
| Accessibility score *(monthly)* | Lighthouse | 90+ | 95+ | 95+ |

### Targets worth reading twice

**Core Web Vitals** — LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. Needs ~28 days of
field data before the report populates, so the day-30 column is "measured", not
"good".

**Reviews** — 100+ at 4.8★ within six months is the playbook's target and it is
reachable at roughly one trip a day with a 30% response rate. It does not happen
without asking every single traveller, every single time.

**Cost per lead** — at a 10% enquiry-to-booking rate, ₹500 per lead is ₹5,000
per booking. Check that against your margin per traveller before scaling spend.

## What to expect, and when

Indexing changes move first, rankings much later:

- **Week 1-2:** Search Console starts recrawling; "Crawled – not indexed" falls.
- **Week 3-4:** destination pages appear for long-tail queries.
- **Week 6-8:** rankings on competitive destination terms begin to move.
- **Month 3-6:** compounding, as reviews, backlinks and new guides accumulate.

If the indexing reports have not moved after four weeks, the first thing to
check is whether a deploy skipped the prerender step — fetch a destination page
and confirm the HTML still contains an `<h1>` and body text.
