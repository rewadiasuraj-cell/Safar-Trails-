import type { PortableTextBlock } from '@portabletext/react';

export interface SanityImageSource {
  asset?: { _ref: string; _type: 'reference' };
  alt?: string;
  [key: string]: unknown;
}

export interface SanityDestinationRef {
  _id: string;
  title: string;
  slug: string;
}

export interface SanityDestination {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  heroImage?: SanityImageSource;
  gallery?: SanityImageSource[];
  highlights?: string[];
  bestTimeToVisit?: string;
}

export interface SanityItineraryDay {
  day: number;
  title: string;
  description?: string;
}

export interface SanityTourPackage {
  _id: string;
  name: string;
  slug: string;
  price: number;
  duration: string;
  destination?: SanityDestinationRef | null;
  images?: SanityImageSource[];
  itinerary?: SanityItineraryDay[];
  inclusions?: string[];
  exclusions?: string[];
}

export interface SanityGuide {
  _id: string;
  title: string;
  slug: string;
  coverImage?: SanityImageSource;
  author?: string;
  publishedDate?: string;
  relatedDestination?: SanityDestinationRef | null;
  body?: (PortableTextBlock | SanityImageSource)[];
}
