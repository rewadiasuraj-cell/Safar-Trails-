/**
 * Applies the resolved per-route metadata to document.head on every client-side
 * navigation.
 *
 * The prerendered HTML already carries the correct tags for the first paint, so
 * this exists to keep them correct after React Router takes over - without it,
 * navigating from /destinations/kashmir to /destinations/kerala would leave
 * Kashmir's canonical in place, which is the exact bug the audit found.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BRAND_NAME } from './siteConfig';
import { resolveRouteSeo } from './routes';

/** data-seo marks the tags this component owns, so it never clobbers anything else. */
const MANAGED = 'data-seo';

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(MANAGED, 'true');
    document.head.appendChild(element);
  }
  Object.entries(attrs).forEach(([key, value]) => element!.setAttribute(key, value));
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    element.setAttribute(MANAGED, 'true');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function upsertJsonLd(json: string) {
  let script = document.head.querySelector<HTMLScriptElement>(
    `script[type="application/ld+json"][${MANAGED}="graph"]`,
  );
  if (!script) {
    // Drop the build-time graph first so the page never carries two @graph blocks.
    document.head
      .querySelectorAll('script[type="application/ld+json"]')
      .forEach((node) => node.parentElement?.removeChild(node));
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute(MANAGED, 'graph');
    document.head.appendChild(script);
  }
  script.textContent = json;
}

export function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = resolveRouteSeo(pathname);

    document.title = seo.title;

    upsertMeta('meta[name="description"]', { name: 'description', content: seo.description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: seo.robots });

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title });
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: seo.description,
    });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: seo.canonical });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: seo.ogImage });
    upsertMeta('meta[property="og:image:alt"]', {
      property: 'og:image:alt',
      content: `${seo.h1} — ${BRAND_NAME}`,
    });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: seo.ogType });

    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title });
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: seo.description,
    });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: seo.ogImage });

    upsertLink('canonical', seo.canonical);
    upsertJsonLd(seo.jsonLd);
  }, [pathname]);

  return null;
}
