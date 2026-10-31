/** Metadata copy stays complete; search engines choose how to display it. */

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 158;

/**
 * Builds "<primary> | <brand>", dropping the brand suffix rather than
 * truncating the keyword-bearing half when the combined string is too long.
 */
export function fitTitle(primary: string, brand = 'Safar Trails', max = TITLE_MAX): string {
  const withBrand = `${primary} | ${brand}`;
  if (withBrand.length <= max) return withBrand;
  if (primary.length <= max) return primary;
  // Display width varies by device and query. Preserve meaning in the source;
  // write a shorter editorial title when needed instead of storing an ellipsis.
  return primary;
}

export function fitDescription(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Renders a guide's publishedDate for humans.
 *
 * The field holds two shapes. Guides written here carry "January 2026"; the ones
 * migrated out of the CMS carry a full ISO timestamp, which was being printed to
 * the page verbatim - a reader saw "2026-03-12T00:00:00Z" under the headline.
 *
 * ISO is kept in the JSON on purpose: it is the exact date, and the Article
 * schema's datePublished needs that precision. Only the display is formatted,
 * and anything that is already human-readable is passed through untouched.
 */
export function formatPublishedDate(raw: string): string {
  if (!/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Minimal HTML-entity escaping for values interpolated into prerendered HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
