# Google Business Profile — Setup Runbook

**Owner task.** Needs the Google account that manages the existing listing.

The audit confirmed a live, verified listing: *Safar Trails*, category
**Travel agency**, at Pillar No. 786, Jai Bharat Encl, Bhagwati Garden, Nawada,
New Delhi 110059, showing 5★. So this is a tune-up, not a setup.

For a travel agency, the profile is usually the single largest source of free
qualified local enquiries — it is what puts you in the Maps pack.

## 1. Fix the address first

This is the one genuine inconsistency, and it is worth ten minutes.

| Source | Street line |
|---|---|
| Website footer | First Floor, Plot No. 02, Jai Bharat Enclave, Bhagwati Garden, Metro Pillar No. 786, Dwarka Mor |
| Business Profile | Pillar No. 786, Plot no-2, Jai Bharat Encl, Bhagwati Garden, Nawada |

Same building, two different descriptions — and Google reads them as two
different signals. Pick whichever is correct and make the profile match the
website exactly, character for character. The website's version is defined once
in `src/lib/seo/siteConfig.ts` and flows to the footer, the JSON-LD and
everywhere else, so if the *profile* is the correct one, change that file and
redeploy instead.

Same rule for the phone number. The site now publishes **+91 80766 65782**
everywhere; the social profiles were showing +91 85008 19000. One number, on the
website, the profile, Facebook and Instagram.

## 2. Categories

Primary category carries by far the most ranking weight, so make it the most
precise true description.

- **Primary:** `Travel agency` — keep it, unless organised tours genuinely are
  the core of the business, in which case `Tour operator` is more precise.
- **Secondary:** `Tour operator`, `Visa consultant`, `Air ticketing agency` —
  add only the ones you actually deliver. Padding this list with services you
  do not provide dilutes relevance and invites suspensions.

## 3. Storefront or service area

- Walk-in office where customers actually visit → **storefront listing**, with a
  Maps pin. Stronger for local ranking.
- No permanent signage and no customer visits → Google's rules require a
  **service-area business** with the address hidden.

If there is a real office, set it up as a storefront *and* add service areas
(Delhi NCR plus the tier-2 cities enquiries come from).

## 4. Business description

750-character limit, but only the first ~250 show before the "more" link — so
the hook goes first. This runs ~610 characters, inside the 400-600+ sweet spot:

```
Safar Trails is a trusted travel agency crafting custom tour packages across
India & abroad – Kashmir houseboats, Kerala backwaters, Himachal road trips,
Dubai & international honeymoons. Every itinerary is hand-planned by real travel
experts with transparent pricing, verified hotels, trained drivers & guides,
visa and ticketing assistance, plus 24x7 on-trip support. 500+ happy travelers
rated us 4.9★. Travel with Trust – safar aapka, zimmedari hamari. Call or
WhatsApp for a free itinerary in 30 minutes.
```

Before pasting, confirm "500+ happy travelers" and "4.9★" are numbers you can
stand behind. Google can suspend a listing over unverifiable claims, and the
same figures appear in the site's schema — they should agree.

## 5. Services and products

Add each as a Service so it becomes searchable text on the profile. Link each to
the matching page:

| Service | Link |
|---|---|
| Kashmir tour packages | `/destinations/kashmir` |
| Kerala tour packages | `/destinations/kerala` |
| Chardham Yatra packages | `/destinations/chardham-yatra` |
| Himachal tour packages | `/destinations/himachal-pradesh` |
| Rajasthan tour packages | `/destinations/rajasthan` |
| Goa holiday packages | `/destinations/goa` |
| Andaman holiday packages | `/destinations/andaman` |
| Northeast India tours | `/destinations/northeast-india` |
| Honeymoon packages | `/packages` |
| Group and corporate tours | `/packages` |
| Visa assistance | `/contact-us` |
| Custom itinerary planning | `/ai-planner` |

## 6. Photos

Real trip photos, not stock. Stock imagery makes a listing look like every other
agency's and measurably reduces engagement.

Aim for: 10+ photos at minimum, refreshed weekly. Cover shot of the team or
office; interior if there is a storefront; and per-destination galleries from
actual departures. Traveller-submitted photos are the strongest of all — ask for
them at trip end.

## 7. The review engine

This is the highest-leverage habit on this page. Around 72% of travellers always
or frequently read reviews before booking, and leisure travellers read six or
seven before deciding.

**At trip end, every time:**
1. Send the Google review short link over WhatsApp while the trip is still fresh
   — the same day, not a week later. Get it from the profile's **Ask for
   reviews** button.
2. Print the same link as a QR code on a card handed over at drop-off.
3. Reply to every review within 24 hours, the negative ones included. A calm,
   specific reply to a complaint reads better to prospects than the complaint
   reads badly.

Target: 100+ reviews at 4.8★ within six months. At roughly one trip a day and a
30% response rate that is achievable; without asking systematically it is not.

**Also fix the Facebook page's zero reviews.** The site claims a 4.5+ rating
while the Facebook page shows none, which reads as a contradiction to anyone who
checks. Point a handful of recent travellers at Facebook instead of Google to
seed it.

## 8. Weekly posts

One post a week, rotating:
- A package offer with a price and a real deadline.
- A link to a new guide from `/guides`.
- A traveller story with their photo and permission.
- A seasonal prompt matched to the booking window — "Kashmir in December, book
  by October".

Posts expire after seven days, so a stale profile visibly looks stale.

## 9. Instagram and Facebook cleanup

The audit found at least four Instagram accounts using variations of the name:
`@safartrails` (someone else entirely), `@safartrails.in`, `@safartrails_india`,
and `@safar_trails7` (a different company in Maharashtra).

1. Decide which is official — `@safartrails.in` appears to be it.
2. Delete or archive any duplicates you control.
3. Put the same bio on the official account:

```
🌍 Custom tours – India & abroad
⭐ 500+ happy travelers
🛡 24x7 on-trip support
📩 DM "SAFAR" for free itinerary
```
(148 characters — inside Instagram's 150-character limit.)

4. Link `safartrails.co.in` in the bio, and add "Travel with Trust" to both the
   Instagram and Facebook bios. The tagline appeared nowhere the audit looked;
   it is now on the website, so the social profiles are the remaining gap.
5. Same phone number as the website and the profile.

## 10. Branded email

`info.safartrails@gmail.com` is indexed in the site footer. A Gmail address on a
business that handles ₹25,000+ bookings costs trust at exactly the wrong moment.

Set up `info@safartrails.co.in` (Google Workspace, or Cloudflare Email Routing
free if you only need forwarding), then update `PRIMARY_EMAIL` in
`src/lib/seo/siteConfig.ts` — that one change updates the footer, the schema and
the contact page together.

Keep "Average WhatsApp Response: Under 3 mins" on the site. It is a genuinely
strong trust signal and it is unusual enough to be memorable.
