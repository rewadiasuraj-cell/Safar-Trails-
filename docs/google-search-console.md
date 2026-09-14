# Google Search Console — Setup Runbook

**Owner task.** Needs someone signed in to the Google account that should own
the property, plus access to the Cloudflare DNS for `safartrails.co.in`.

Do this first. Nothing else in the plan can be measured without it.

## 1. Add the property

Go to <https://search.google.com/search-console> and choose **Domain property**,
not URL prefix. Enter `safartrails.co.in` with no `https://` and no `www`.

A domain property covers every subdomain and both protocols at once. A URL-prefix
property would treat `https://safartrails.co.in` and `https://www.safartrails.co.in`
as separate properties — and given that the www host was returning HTTP 522,
that split is exactly the confusion to avoid.

## 2. Verify by DNS

Search Console gives you a `TXT` record like
`google-site-verification=xxxxxxxxxxxxxxxxxxxx`.

In the Cloudflare dashboard → `safartrails.co.in` → **DNS** → **Add record**:

| Field | Value |
|---|---|
| Type | `TXT` |
| Name | `@` |
| Content | the `google-site-verification=…` string, pasted whole |
| TTL | Auto |

Save, wait a couple of minutes, then click **Verify**. If it fails, wait ten
minutes and retry — DNS propagation, not a mistake on your part.

> The playbook suggests HTML-file verification. DNS is better here: it survives
> redeploys, and the deployment writes `dist/` fresh on every build, so an
> uploaded HTML file would need to be re-added to `public/` to persist. If you
> do prefer the file method, drop it in `public/` (not the project root) so it
> gets copied into the build.

## 3. Confirm the www redirect first

Before submitting anything, check that the deploy actually fixed the 522:

```bash
curl -sI https://www.safartrails.co.in/ | head -3
```

You want `HTTP/2 301` and a `location:` header pointing at
`https://safartrails.co.in/`. If you still see 522, the redirect rules in
`public/_redirects` have not deployed yet — no point submitting a sitemap until
they have.

## 4. Submit the sitemap

**Sitemaps** → enter `sitemap.xml` → **Submit**.

It should report 42 discovered URLs. The sitemap is generated at build time from
the same route table that produces the pages, so it can no longer drift from
what actually exists — which is how `/about-us`, `/contact-us` and
`/destinations/ladakh` came to be missing from the old hand-written one.

## 5. Request indexing for the priority pages

**URL Inspection** → paste the URL → **Request Indexing**. Google rate-limits
this to roughly ten a day, so spend them on the pages that earn money:

```
https://safartrails.co.in/
https://safartrails.co.in/destinations/kashmir
https://safartrails.co.in/destinations/kerala
https://safartrails.co.in/destinations/chardham-yatra
https://safartrails.co.in/destinations/himachal-pradesh
https://safartrails.co.in/ai-planner
https://safartrails.co.in/packages
https://safartrails.co.in/destinations/rajasthan
https://safartrails.co.in/destinations/goa
https://safartrails.co.in/guides
```

Use the inspection tool's **View Crawled Page** on at least one of them and
confirm the HTML now contains an `<h1>` and body text. That is the single
clearest proof that the prerendering fix worked.

## 6. Remove the stale URLs

The old sitemap listed nine package URLs under `/packages/<slug>` that do not
resolve — for example `/packages/chardham-yatra-package`. Static packages now
live at `/tour-packages/<slug>`. If Search Console reports 404s for the old
paths, that is correct and expected; let them drop out naturally. Do not add
redirects for them unless they were actually accumulating traffic, since
`/packages/<slug>` is a live route for CMS-managed packages.

## 7. The weekly routine

Fifteen minutes, once a week.

| Report | What you are looking for |
|---|---|
| **Performance** | Which destination queries bring impressions. Any query with impressions but a poor click-through rate is a title/description to rewrite in `src/lib/seo/routes.ts`. |
| **Pages** (Indexing) | "Crawled – currently not indexed" and "Discovered – currently not indexed" should both fall as the prerendered content is recrawled. |
| **Core Web Vitals** | Needs ~28 days of field data before it reports. Targets: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. |
| **Enhancements** | New sections should appear for FAQ, Breadcrumbs and Merchant listings as the structured data is picked up. |

### What "good" looks like by day 90

- Indexed pages: 35+ (from effectively 1).
- Destination pages appearing for their own names, not only "safar trails".
- 10+ keywords ranking in the top 10.
- Organic clicks growing ~25% month on month.

Recrawling takes time. Expect two to four weeks before the indexing reports
reflect the fix, and six to eight weeks before rankings move. If nothing has
changed after four weeks, re-inspect a destination URL and check the rendered
HTML still shows the prerendered content — that is the first thing to break if
a future deploy skips the prerender step.

## Troubleshooting

**"Page is not indexed: Duplicate, Google chose different canonical"** — the old
behaviour. If it persists after a recrawl, confirm with
`curl -s <url> | grep canonical` that the page really does point at itself.

**"Excluded by 'noindex' tag"** on a real page — check `robots` in
`resolveRouteSeo`; only `/404` should carry `noindex`.

**Sitemap "Couldn't fetch"** — check `https://safartrails.co.in/sitemap.xml`
loads in a browser and is served as XML. Both `server.ts` and Cloudflare Pages
serve it directly.
