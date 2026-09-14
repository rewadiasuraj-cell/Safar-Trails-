/**
 * Helpers that keep every generated title and description inside the lengths
 * Google actually renders.
 *
 * Title: ~600px, which works out to roughly 50-60 characters. The live site was
 * shipping a 67-character title on all 32 pages, so it was being truncated in
 * the SERP everywhere.
 *
 * Description: Google has no hard limit and truncates by pixel width, but
 * 120-158 characters is the range that survives on both desktop and mobile.
 */

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 158;

/** Cuts at the last whole word that fits, then appends an ellipsis. */
function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const clipped = text.slice(0, max - 1);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
}

/**
 * Builds "<primary> | <brand>", dropping the brand suffix rather than
 * truncating the keyword-bearing half when the combined string is too long.
 */
export function fitTitle(primary: string, brand = 'Safar Trails', max = TITLE_MAX): string {
  const withBrand = `${primary} | ${brand}`;
  if (withBrand.length <= max) return withBrand;
  if (primary.length <= max) return primary;
  return truncateAtWord(primary, max);
}

export function fitDescription(text: string, max = DESCRIPTION_MAX): string {
  return truncateAtWord(text.replace(/\s+/g, ' ').trim(), max);
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
