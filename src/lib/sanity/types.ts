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

export interface SanityStopCovered {
  name: string;
  description?: string;
}

export interface SanityBestTimeSection {
  heading: string;
  description?: string;
}

export interface SanityHowToReach {
  road?: string;
  rail?: string;
  air?: string;
}

export interface SanityFAQ {
  question: string;
  answer?: string;
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
  seoTitle?: string;
  seoDescription?: string;
  tagline?: string;
  startingPoint?: string;
  travelType?: string;
  overview?: string;
  whatIsSection?: string;
  stopsCovered?: SanityStopCovered[];
  placesCovered?: string[];
  bestTimeSections?: SanityBestTimeSection[];
  howToReach?: SanityHowToReach;
  costNote?: string;
  costFactors?: string[];
  highlights?: string[];
  accommodationNote?: string;
  accommodationOptions?: string[];
  transportationOptions?: string[];
  customizeOptions?: string[];
  whoCanBook?: string[];
  travelTips?: string[];
  whyChooseUs?: string[];
  faqs?: SanityFAQ[];
  bottomCtaHeading?: string;
  bottomCtaText?: string;
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
