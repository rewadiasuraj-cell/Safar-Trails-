# Google Ads — Campaign Build Sheet

**Owner task.** Needs a Google Ads account and a payment method.

## Do not start yet

Launch only once all three are true:

- [ ] Search Console verified, sitemap submitted, prerendered HTML confirmed.
- [ ] GA4 receiving data and the four key events marked as conversions.
- [ ] `www.safartrails.co.in` returning 301, not 522.

Ads pointed at pages whose conversions are not tracked spend money and teach you
nothing. The playbook puts this at day 25-30 for that reason.

## The timing rule that matters most

Travellers book three to six months ahead. **Advertise against the booking
window, not the travel season.** Google's own guidance is to concentrate budget
six to twelve weeks before the peak, and to start seasonal campaigns at least
four to six weeks out.

If you run Kashmir ads in December because December is when people go to
Kashmir, you are bidding against everyone else at peak cost for travellers who
have already booked.

| Travel season | What you sell | Run ads from |
|---|---|---|
| ❄ Winter (Dec–Feb) | Kashmir snow, Goa, Rajasthan | **Sep–Nov** |
| ☀ Summer (Apr–Jun) | Himachal, Ladakh, Kashmir, Nainital | **Feb–Apr** |
| 🌧 Monsoon (Jul–Sep) | Kerala, Coorg, Meghalaya | **Apr–Jun** |
| 🎉 Festive (Oct–Nov) | Diwali trips, Rajasthan, Dubai | **Jul–Sep** |
| 🛕 Chardham (May–Oct) | Chardham Yatra | **Feb–Apr** |

Chardham is worth a dedicated calendar entry: the yatra window is fixed by
temple opening dates, so booking demand spikes hard and early.

## Campaign 1 — Search, destination intent

The workhorse. Start here, and only here, for the first month.

**Structure:** one ad group per destination. Never mix destinations in an ad
group; the ad copy has to name the destination to earn the click.

**Settings**
| Setting | Value | Why |
|---|---|---|
| Type | Search only | Leave Display off — Search Partners and Display drain budget at this size |
| Bidding | Maximise Conversions; switch to Target CPA after ~30 conversions | Smart Bidding needs data before a target means anything |
| Budget | ₹1,000–1,500/day to start | Enough for ~15-25 clicks/day in this vertical |
| Locations | Delhi NCR + Mumbai, Pune, Bengaluru, Hyderabad, Ahmedabad, Jaipur, Chandigarh, Lucknow | Match wherever enquiries actually come from — check GA4 first |
| Location option | **People in or regularly in** (not "interested in") | Default includes people merely searching about the area; that is a large share of the waste |
| Languages | English + Hindi | |
| Ad rotation | Optimise | |

**Keywords** — phrase and exact match only. Broad match with a small budget and
no conversion history spends the day on irrelevant queries.

```
Kashmir            "kashmir tour package", [kashmir tour packages], "kashmir holiday package",
                   "srinagar tour package", "kashmir package from delhi", [kashmir honeymoon package]
Kerala             "kerala tour package", [kerala honeymoon package], "kerala backwater package",
                   "munnar alleppey package", "kerala package from delhi"
Himachal           "himachal tour package", "manali tour package", [shimla manali package],
                   "manali package from delhi"
Chardham           "chardham yatra package", [char dham yatra booking], "chardham package from haridwar",
                   "do dham yatra package"
Rajasthan          "rajasthan tour package", "jaipur udaipur package", [rajasthan honeymoon package]
Goa                "goa tour package", [goa honeymoon package], "goa package from delhi"
Andaman            "andaman tour package", [andaman honeymoon package], "havelock island package"
Northeast          "meghalaya tour package", "shillong cherrapunji package", "northeast india tour package"
Ladakh             "ladakh tour package", "leh ladakh package", [ladakh bike trip package]
Custom / brand     "custom tour package india", "travel agency delhi", "safar trails"
```

Run a brand ad group on "safar trails". It is cheap, it protects against
competitors bidding on your name, and given the four look-alike Instagram
accounts, owning your own brand SERP is worth the small spend.

**Negative keywords** — add before launch, as a shared list:

```
jobs          salary        vacancy       internship    career
franchise     dealership    agent registration          become agent
free          cheapest      scam          fraud         complaint
government scheme           subsidy       tender
photo         photos        images        wallpaper     map       distance
quotes        shayari       status        blog          pdf       ppt
train ticket  irctc         flight only   hotel only
university    college       admission
```

The `free`, `photos` and `map` negatives matter more than they look: "kashmir
photos" and "kerala map" are high-volume queries that will eat a small budget
overnight.

**Responsive Search Ads** — 15 headlines, 4 descriptions per ad group.
Headlines (swap the destination per ad group):

```
Kashmir Tour Packages 2026
Custom Kashmir Itinerary Free
Free Itinerary in 30 Minutes
Dal Lake Houseboat + Gulmarg
Rated 4.9★ by 500+ Travellers
24x7 On-Trip Support
Transparent Pricing, No Hidden Cost
Verified Hotels & Trained Drivers
Talk to a Kashmir Specialist
Hand-Planned, Not Off-the-Shelf
Travel with Trust
WhatsApp Reply Under 3 Minutes
Honeymoon & Family Packages
Book Kashmir from Delhi
AI Plans. Experts Perfect.
```

Descriptions:
```
Hand-planned Kashmir itineraries with verified stays, trained local drivers and
24x7 on-trip support. Free custom itinerary in 30 minutes.

Tell us your dates and budget – get a day-wise itinerary with transparent,
itemised pricing. No hidden costs, no pressure to book.

500+ happy travellers. Houseboats, Gulmarg snow, Pahalgam valleys. Customise
every day of your trip. Travel with Trust.

Speak to a real Kashmir specialist, not a call centre. WhatsApp reply in under
3 minutes. Visa, flights and transfers arranged.
```

Pin "Travel with Trust" to Headline Position 3 so the tagline is always served.

**Assets** (formerly extensions) — these lift click-through rate more than any
copy change, and they are free:
- **Sitelinks:** Kashmir Packages `/destinations/kashmir` · Free AI Planner `/ai-planner` · All Packages `/packages` · Travel Guides `/guides`
- **Callouts:** 24x7 On-Trip Support · Verified Hotels · Transparent Pricing · Free Custom Itinerary · Trained Local Drivers
- **Structured snippet** (Destinations): Kashmir, Kerala, Himachal, Rajasthan, Goa, Andaman, Ladakh, Chardham Yatra
- **Call asset:** +91 80766 65782, scheduled to your answering hours. An unanswered ad call is worse than no call asset.
- **Lead form asset:** name, phone, destination, travel date — four fields, matching the site's form.

**Landing pages:** send each ad group to its own destination page, never the
homepage. That is now worth doing, because those pages finally have their own
titles, content and canonicals.

## Campaign 2 — Demand Gen (month 2+)

Only once Search is producing conversions.

- **Audiences:** website visitors in the last 30 days who did *not* convert;
  viewers of any `/destinations/*` page; a customer-match list of past
  travellers; a lookalike of converters.
- **Creative:** the trip Reels. Vertical video outperforms static here by a wide
  margin.
- **Budget:** ₹400-600/day, separate from Search so it cannot cannibalise it.
- **Goal:** re-engagement, not last-click conversions. Judge it on assisted
  conversions, or you will switch it off unfairly.

## Budget allocation

Starting at ₹50,000/month:

| Line | Share | Amount |
|---|---|---|
| Search – destination ad groups | 60% | ₹30,000 |
| Search – brand | 5% | ₹2,500 |
| Search – seasonal push (current booking window) | 20% | ₹10,000 |
| Demand Gen remarketing (month 2+) | 15% | ₹7,500 |

Below roughly ₹25,000/month, run Search only. Spreading a small budget across
campaign types leaves none of them with enough data to optimise.

## Targets

| Metric | Target | Note |
|---|---|---|
| Click-through rate | >4% | Travel Search benchmark |
| Conversion rate | 3-6% | Enquiry, not booking |
| Cost per lead | ₹300-600 | Delhi NCR, destination keywords |
| Cost per booking | Compare against margin | At ~10% enquiry-to-booking, a ₹500 CPL is ₹5,000 per booking |
| Impression share | >50% on brand | Below that, someone is outbidding you on your own name |

## First-month checklist

- Week 1: daily search-term report; add negatives aggressively. Expect to add 20-40.
- Week 2: pause keywords with 50+ clicks and no conversion.
- Week 3: check which ad-group landing pages convert; shift budget toward them.
- Week 4: with 30+ conversions, switch to Target CPA at your actual CPL.

The search-terms report in week one is the highest-value hour you will spend on
the account. It is where you find out what people actually typed, as opposed to
what you assumed they would.
