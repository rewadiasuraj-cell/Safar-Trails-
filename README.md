# SafarTrails

An AI-powered India travel planning site (React + Vite + Express).

## Getting Started

```bash
bun install
bun run dev      # starts the app at http://localhost:3000
```

## Content Management (Sanity Studio)

Destinations, tour packages, and travel guides shown on the `/destinations`,
`/destinations/:slug`, `/packages`, and `/guides` pages are managed as content
in [Sanity](https://www.sanity.io) and fetched live by the app via
`@sanity/client` — see `src/lib/sanity/`. The Studio itself lives in
`studio-safar-trails/` as a completely standalone project: it has its own
`package.json`, its own dependencies, and its own build — it is never bundled
into the main app (the root `vite build` / `bun run build` never touches it).

Project ID: `xmtc060o` · Dataset: `production`

### One-time setup: allow the app's origin in Sanity CORS

Sanity blocks browser requests from origins it doesn't recognize, even for a
public dataset. Before the app can read data, add each URL it runs on
(e.g. `http://localhost:3000` for local dev, plus your production domain) at
[sanity.io/manage](https://sanity.io/manage) → your project → **API** → **CORS
Origins**, or from `studio-safar-trails/` run:

```bash
npx sanity cors add http://localhost:3000 --credentials false
```

Until this is done, the destinations/packages/guides pages will show a
"Couldn't load content from Sanity" message instead of your content.

### Running the Studio locally

```bash
cd studio-safar-trails
bun install
bun run dev      # starts the Studio at http://localhost:3333
```

The first time you run it you'll be prompted to log in with your Sanity
account (this only grants *you* editing access — it doesn't affect the
live site, which only reads public data).

Content types: **Destination** (title, slug, description, hero image,
gallery, highlights, best time to visit), **Tour Package** (name, slug,
price, duration, a reference to a Destination, itinerary, images,
inclusions/exclusions), and **Guide** (title, slug, body, author, published
date, cover image, related Destination).

The dataset starts empty — add a few documents of each type in the Studio
and they'll appear on the live site automatically (no redeploy needed,
thanks to `useCdn: true` + Sanity's fast CDN propagation).

### Deploying the Studio (optional, free)

You don't need to self-host the Studio — Sanity provides free hosting for it:

```bash
cd studio-safar-trails
bun run deploy
```

This publishes it to `https://<your-chosen-name>.sanity.studio`, a
standalone URL separate from the main site, where you (or teammates you
invite as collaborators on sanity.io) can log in and edit content from
anywhere.

## Email Notifications (Resend)

When someone submits the "Get Your Custom Trip Quote" form, an email with
every field (name, phone, destination, dates, travellers, budget, notes, and
the enquiry reference ID) is sent to `info.safartrails@gmail.com` via
[Resend](https://resend.com). This runs in `functions/api/send-quote-email.ts`,
a **Cloudflare Pages Function** — it only executes when the site is served
through Cloudflare Pages, since that's what builds and routes files under
`functions/` into serverless endpoints. It's a plain addition alongside the
existing `/api/quotes` submission and WhatsApp link: if the email fails or
isn't reachable, the form and WhatsApp flow are unaffected either way.

### One-time setup on Resend

1. Create a free account at [resend.com](https://resend.com).
2. You can start sending immediately using Resend's shared sandbox address
   (`onboarding@resend.dev`) — no domain setup required. When you're ready to
   send from your own address, go to **Domains → Add Domain**, enter your
   domain, and add the DNS records (SPF/DKIM) Resend shows you at your
   registrar. Verification is usually automatic once the DNS propagates.
3. Go to **API Keys → Create API Key**, name it (e.g. `safartrails-quotes`),
   and copy the key — Resend only shows it once.

### Configuring the API key

- **Production (Cloudflare Pages):** Pages project → **Settings → Environment
  variables** → add `RESEND_API_KEY` as a secret. Optionally add
  `RESEND_FROM_EMAIL` once you've verified your own domain (defaults to the
  Resend sandbox sender otherwise).
- **Local testing:** copy `.dev.vars.example` to `.dev.vars` and fill in your
  key, then run `npx wrangler pages dev -- bun run dev` (or `npx wrangler
  pages dev dist` after building) to exercise the function locally. `.dev.vars`
  is gitignored.

Neither variable is a `VITE_`-prefixed var and neither belongs in `.env` —
they're read via the Pages Function's `env` binding, not `import.meta.env`,
so the key never reaches the browser bundle.
