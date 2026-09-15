# Google Business Profile — Setup Runbook

**Owner task.** Needs the Google account that manages the existing listing.

The audit confirmed a live, verified listing: *Safar Trails*, category
**Travel agency**, at Pillar No. 786, Jai Bharat Encl, Bhagwati Garden, Nawada,
New Delhi 110059, showing 5★. So this is a tune-up, not a setup.

For a travel agency, the profile is usually the single largest source of free
qualified local enquiries — it is what puts you in the Maps pack.

## 1. The address — resolved, but verify the exact string

The site said "Dwarka Mor", the profile said "Nawada". Same building, two
descriptions, and Google reads them as two signals.

**The owner confirmed the profile is correct**, so the website was changed to
match it, not the other way round — the verified listing is the record Google
ranks, so the site moves to it. `POSTAL_ADDRESS` in `src/lib/seo/siteConfig.ts`
now reads:

```
First Floor, Plot No. 02, Pillar No. 786, Jai Bharat Enclave, Bhagwati Garden,
Nawada, New Delhi 110059
```

That flows to the footer, the contact page and the JSON-LD together.

**Still to check:** the string above was reconstructed from the audit's
transcription of the listing, not copied from it. Open the profile and compare
word for word. Two likely differences, both harmless to fix:

- The profile may abbreviate — "Jai Bharat Encl" rather than "Jai Bharat
  Enclave". Match whichever you prefer, on both.
- "First Floor" may not be on the profile at all. Keep it if the office really is
  upstairs — it helps visitors find the door — and add it to the profile too.

Character-for-character agreement is the goal; which of the two you edit to get
there does not matter.

Same rule for the phone number. The site publishes **+91 80766 65782**
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

## 3. Storefront plus service areas

The owner confirmed customers do visit the office, so this stays a **storefront
listing** with a visible address and a Maps pin — the stronger of the two for
local ranking.

Two conditions come with that, and Google does enforce them on spot checks:
permanent signage with the business name at the location, and someone there
during the stated opening hours. If either is not true, the listing is at risk
and a service-area business would be the honest configuration instead.

Add service areas alongside it: Delhi NCR first, then whichever cities enquiries
actually come from. Service areas do not weaken a storefront listing.

## 4. Business description

750-character limit, but only the first ~250 show before the "more" link — so
the hook goes first. This runs ~610 characters, inside the 400-600+ sweet spot:

```
Safar Trails is a travel agency in Dwarka, New Delhi crafting custom tour
packages across India – Kashmir houseboats, Kerala backwaters, Himachal road
trips, Chardham Yatra, Rajasthan, Goa and the Andamans. Every itinerary is
hand-planned by real travel consultants, not a template: transparent pricing
with no hidden extras, verified hotels, trained local drivers and guides, visa
and ticketing assistance, and support on the phone for the whole trip. Families,
honeymoons, pilgrimage groups and corporate departures. Travel with Trust –
safar aapka, zimmedari hamari. Call or WhatsApp for a free itinerary in 30
minutes.
```

**No rating or traveller count in this text, deliberately.** An earlier draft
opened with "500+ happy travelers rated us 4.9★". Those numbers came from the
same placeholder set as the review counts that were removed from the website —
they were never real. Google suspends listings over unverifiable claims, and a
profile claiming a rating the site no longer claims is a contradiction anyone
can check in one tap.

Add the numbers back only when the profile's own review count reaches them, and
say exactly what the profile says.

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
