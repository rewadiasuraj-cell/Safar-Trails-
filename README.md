# SafarTrails

An AI-powered India travel planning site (React + Vite + Express).

## Getting Started

```bash
bun install
bun run dev      # starts the app at http://localhost:3000
bun run build    # vite build + prerender + server bundle
```

## SEO, Google setup and growth docs

`docs/` holds the work following the September 2026 SEO audit — what was fixed
in code, and the runbooks for the parts that need someone signed in to a Google
account. Start at [docs/README.md](./docs/README.md).

**If you change anything about how pages are built, read
[docs/seo-implementation.md](./docs/seo-implementation.md) first.** Two things
are easy to break by accident:

1. **`bun run build` must keep running `scripts/prerender.ts`.** Without it the
   site reverts to serving one identical head tag and an empty body on all 47
   URLs — the exact state the audit found. `build:pages` includes it too.
2. **Page titles and descriptions live in `src/lib/seo/routes.ts`,** not in
   `index.html`. The prerender overwrites `index.html`'s tags per route.

The prerender also regenerates `public/sitemap.xml`, so that file is build
output and should not be hand-edited.

## Editing content

Destinations, packages and travel guides live as one JSON file per item:

```
content/destinations/kashmir.json
content/packages/kashmir-escape-houseboat-bliss.json
content/guides/best-time-to-visit-kashmir.json
```

**You do not need a local checkout to edit these.** Open the file on github.com,
click the pencil, change what you need, and commit. Cloudflare redeploys in a
couple of minutes.

The filename is the URL slug: `content/packages/sikkim-explorer.json` is served at
`/tour-packages/sikkim-explorer`. To add a package, copy an existing file, rename
it to the new slug, and change the contents.

### Photos

`heroImage` is the one image that shows on the page — it becomes the banner, the
Facebook/WhatsApp link preview and the `image` in the structured data. Two forms
work:

```
"heroImage": "/content/packages/<slug>/1.jpg"          a real photo in this repo
"heroImage": "https://images.unsplash.com/photo-…"     a stock photo
```

Real photos rank and convert better than stock — the audit says so explicitly —
so prefer them wherever they exist. Put the files in
`public/content/packages/<slug>/` (or `destinations/`, `guides/`) and reference
them with a leading slash, exactly as above. The code turns that into a full
`https://safartrails.co.in/…` URL wherever one is needed, so never write the
domain into the JSON.

Before committing a photo, **shrink it**: longest edge 1600px, JPEG quality
around 75. A phone photo straight out of the camera is 4–8 MB and will make the
page slow on mobile data, which costs rankings. Anything over ~300 KB is too
big.

`galleryImages` is stored but not yet rendered anywhere.

### If you break something, the build stops

`scripts/build-content.ts` reads these files, checks each one, and generates
`src/data/generated/`. A bad edit fails the build with a specific message instead
of shipping a broken page:

```
content/packages/sikkim-explorer.json: not valid JSON (…). Check for a trailing
comma, a missing quote, or a curly " pasted from a document.

content/packages/sikkim-explorer.json: missing required field "startingPrice"

content/packages/sikkim-explorer.json: slug "sikkim-explorer-2026" does not match
the filename. Rename the file to sikkim-explorer-2026.json, or fix the slug.
```

The live site keeps serving the previous version until the problem is fixed.

Two rules worth remembering when editing by hand: text must be wrapped in
straight double quotes (`"`), not the curly ones a word processor produces, and
the last item in a list or object must not have a comma after it.

`src/data/generated/` is build output and is gitignored — it is rebuilt on every
`bun run dev` and `bun run build`, so a content change is always a one-file diff.

## Email Notifications (Resend)

When someone submits the "Get Your Custom Trip Quote" form, an email with
every field (name, phone, destination, dates, travellers, budget, notes, and
the enquiry reference ID) is sent to `info.safartrails@gmail.com` via
[Resend](https://resend.com). The actual Resend call lives in
`src/lib/email/sendQuoteEmail.ts`, a small dependency-free module shared by
two entry points so this works regardless of how the app is hosted:

- `functions/api/send-quote-email.ts` — a **Cloudflare Pages Function**,
  called from the browser as a separate request after the enquiry is
  submitted. Only executes when the site is served through Cloudflare Pages.
- `server.ts`'s existing `/api/quotes` handler — calls it directly (Node's
  built-in `fetch`) whenever `RESEND_API_KEY` is set, for the current Express
  host. This is the path that's actually live today.

Both are pure additions alongside the existing `/api/quotes` submission and
WhatsApp link, and neither is awaited before responding to the user: if
Resend is unreachable, misconfigured, or `RESEND_API_KEY` is unset entirely,
the enquiry and WhatsApp flow are completely unaffected either way.

### One-time setup on Resend

1. Create a free account at [resend.com](https://resend.com).
2. Domain verified: `safartrails.co.in` is live in Resend, so emails send
   from `noreply@safartrails.co.in` (`DEFAULT_FROM_EMAIL` in
   `src/lib/email/sendQuoteEmail.ts`). Override per-environment with
   `RESEND_FROM_EMAIL` if you ever need a different sender on this domain.
3. Go to **API Keys → Create API Key**, name it (e.g. `safartrails-quotes`),
   and copy the key — Resend only shows it once.

### Configuring the API key

- **Current host (Express / `server.ts`):** copy `.env.example` to `.env` and
  fill in `RESEND_API_KEY` (and optionally `RESEND_FROM_EMAIL`). Read via
  `dotenv`/`process.env`, same as `GEMINI_API_KEY`. This is what makes the
  email actually go out today.
- **If you later deploy on Cloudflare Pages:** Pages project → **Settings →
  Environment variables** → add `RESEND_API_KEY` as a secret (+ optionally
  `RESEND_FROM_EMAIL`). For local testing of the Pages Function specifically,
  copy `.dev.vars.example` to `.dev.vars` and run `npx wrangler pages dev`.

Neither variable is a `VITE_`-prefixed var, so neither ever reaches the
browser bundle — `server.ts` reads it from `process.env`, the Pages Function
reads it from its own `env` binding, and Vite's client-side `import.meta.env`
never sees it either way.
