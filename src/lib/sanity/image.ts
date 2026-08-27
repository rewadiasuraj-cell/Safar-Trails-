import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './client';
import type { SanityImageSource } from './types';

const builder = imageUrlBuilder(sanityClient);

/** Builds a Sanity CDN image URL builder from an image reference field. */
export function urlFor(source: SanityImageSource | null | undefined) {
  return builder.image(source || {});
}
