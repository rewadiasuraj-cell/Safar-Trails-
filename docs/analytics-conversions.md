# Analytics & Conversion Tracking

**Owner + developer task.**

The audit could not find a GA4 or GTM script in the served HTML and flagged it
as something to confirm before spending anything on ads. The tag does exist —
it is injected by `src/lib/analytics.ts` rather than hardcoded in `index.html`,
which is why a raw HTML fetch does not show it. That is a legitimate pattern,
but it does mean the only way to confirm it works is to look at GA4 itself.

## 1. Confirm GA4 is actually receiving data

The measurement ID currently compiled into the bundle is **`G-0VMQX8NMJZ`**
(from `VITE_GA_MEASUREMENT_ID`, falling back to that constant).

1. Sign in to <https://analytics.google.com> and confirm a property exists with
   that ID. **If it does not, every number below is going nowhere** — create the
   property and set `VITE_GA_MEASUREMENT_ID` in the Cloudflare Pages environment
   variables, then redeploy.
2. Open the site in one tab and GA4 → **Reports → Realtime** in another. Your
   visit should appear within 30 seconds.
3. Navigate between a few pages. Realtime should show a separate `page_view` per
   route — the app is a single-page app, so `gtag`'s built-in auto-pageview
   fires only once; `trackPageView` sends the rest.

If Realtime stays empty: check for an ad blocker (they block
`googletagmanager.com`), then confirm the ID in the deployed bundle with
`curl -s https://safartrails.co.in/assets/index-*.js | grep -o 'G-[A-Z0-9]*'`.

## 2. The five conversion events

Every lead-generating interaction on the site now routes through
`src/lib/analytics.ts`, so these fire consistently wherever the CTA appears.

| Event | Fires when | Parameters | Use as |
|---|---|---|---|
| `whatsapp_click` | Any WhatsApp CTA is clicked | `source`, `destination` | Conversion |
| `phone_call_click` | Any `tel:` link is clicked | `source` | Conversion |
| `quote_submitted` | Quote form is submitted | `destination`, `source` | Micro-conversion |
| `generate_lead` | Server confirms the lead | `destination`, `lead_id` | **Primary conversion** |
| `ai_plan_generated` | An itinerary is delivered | `destination`, `trip_days` | Engagement |

Plus `ai_plan_requested`, `view_package` and `search` for audience building.

The `source` parameter is the useful part. It tells you whether enquiries come
from the sticky widget, the header, the mobile bottom bar, a package page or the
planner — which is what tells you where to invest. Values in use: `header`,
`sticky_widget`, `mobile_bottom_nav`, `contact_page`, `final_cta`,
`guide_article`, `package_detail`, `ai_planner_result`, `quote_modal_success`,
`404_page`.

WhatsApp deserves conversion status rather than being treated as a soft signal:
in the Indian travel market it is the primary enquiry channel, and the form is
often skipped entirely in favour of it.

## 3. Mark them as conversions in GA4

**Admin → Data display → Events**, wait for each event to appear once (they only
show after firing at least once — so click each CTA yourself first), then toggle
**Mark as key event** on:

- `generate_lead`
- `whatsapp_click`
- `phone_call_click`
- `quote_submitted`

Leave `ai_plan_generated` unmarked. It is a strong engagement signal but not a
lead, and mixing the two makes cost-per-lead meaningless.

## 4. Link GA4 to Google Ads

Once the Ads account exists:

1. GA4 → **Admin → Product links → Google Ads links → Link**.
2. Select the Ads account, enable personalised advertising, and enable auto-tagging.
3. In Google Ads → **Goals → Conversions → Import → Google Analytics 4** and
   import the four key events above.
4. Set `generate_lead` as **Primary** and the rest as **Secondary**. Only the
   primary should drive Smart Bidding, or the algorithm optimises toward whichever
   is easiest to trigger rather than toward actual bookings.

## 5. Optional: the Ads tag

`src/lib/analytics.ts` reads `VITE_GOOGLE_ADS_ID`. Set it to your `AW-XXXXXXXXX`
conversion ID in the Pages environment variables and gtag configures the Ads tag
alongside GA4 — no second snippet, and remarketing audiences start collecting
immediately. Leave it unset until the account exists; empty means the code path
is skipped entirely.

## 6. Recommended custom report

GA4 → **Explore → Free form**:

- Dimensions: `Event name`, `source` (custom), `destination` (custom), `Landing page`
- Metrics: `Event count`, `Total users`
- Filter: event name matches one of the five above

Register `source` and `destination` as custom dimensions first
(**Admin → Custom definitions → Create custom dimension**, scope: Event). They
will not appear in reports until you do, and GA4 does not backfill — so do it
before you start spending on ads, not after.

## 7. What to check weekly

| Question | Where |
|---|---|
| Are enquiries growing? | `generate_lead` + `whatsapp_click` count |
| Which destination sells? | `destination` parameter breakdown |
| Which CTA works? | `source` parameter breakdown |
| Do guides convert? | Landing page = `/guides/*`, then conversion |
| Does the planner convert? | `ai_plan_generated` → `generate_lead` sequence |

The last one is the interesting one. The AI planner is the site's clearest
differentiator; if people generate itineraries but do not then enquire, the gap
is in the handoff from the result screen to the enquiry, not in the planner.
