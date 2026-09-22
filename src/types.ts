export type TripType = 
  | 'All'
  | 'Couple'
  | 'Honeymoon'
  | 'Family'
  | 'Friends'
  | 'Solo'
  | 'Group'
  | 'Adventure'
  | 'Luxury'
  | 'Weekend'
  | 'Spiritual'
  | 'Heritage'
  | 'Cultural'
  | 'Nature'
  | 'Relaxation';

export type HotelCategory =
  | 'Budget / 3★'
  | 'Standard 3★'
  | 'Deluxe 4★'
  | 'Luxury 5★'
  | 'Heritage Boutique'
  | 'Houseboat & Resort';

export type TransportType = 'Private Sedan' | 'Private SUV (Innova/Crysta)' | 'Tempo Traveller' | 'Self Drive / Flight + Cab';

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  location: string;
  description: string;
  morningActivity?: string;
  afternoonActivity?: string;
  eveningActivity?: string;
  stay?: string;
  mealsIncluded?: string; // e.g. "Breakfast & Dinner"
  transfers?: string;
  image?: string;
  insiderTip?: string;
}

export interface Package {
  id: string;
  slug: string;
  title: string;
  destination: string; // display label, e.g. "Chardham Yatra, Uttarakhand"
  /**
   * Which destination page this package belongs to. Separate from `destination`
   * because that field is display copy and drifted from the destination names:
   * "Andaman" vs "Andaman & Nicobar", "Chardham Yatra, Uttarakhand" vs "Chardham
   * Yatra". Matching on it left /destinations/andaman and
   * /destinations/chardham-yatra showing no packages at all.
   *
   * Guides already key off destinationSlug; packages now do the same.
   */
  destinationSlug?: string;
  state: string;
  durationDays: number;
  durationNights: number;
  startingPrice: number; // per person
  originalPrice?: number;
  tripType: TripType[];
  hotelCategory: HotelCategory;
  ratings: number;
  reviewCount: number;
  startingCity: string;
  bestFor: string;
  heroImage: string;
  galleryImages: string[];
  overview: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  /**
   * When the trip is worth taking, in the operator's own words.
   *
   * This was a five-value union, and real content outgrew it twice in a day:
   * Udaipur is "October to March" and Darjeeling is "March to May & October to
   * early December", neither of which is Summer, Monsoon, Winter or Spring.
   * Forcing them into the nearest label would have thrown away the useful half
   * of the answer.
   *
   * Nothing renders this field - it is not a filter and not a badge; the
   * seasonal ordering a visitor actually sees comes from displayOrder, and the
   * real answer lives in each package's "best time to visit" FAQ. So it is
   * free text, and build-content.ts already validates it as a string.
   */
  season: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  /**
   * Optional. Questions people actually type before booking this trip - "Manali
   * tour package for couple", "…from Delhi", "…with flight". Destinations have
   * carried these for a while; packages are where the buying-intent searches
   * land, so they earn them too.
   *
   * Answer honestly about THIS package. A question the trip does not cover
   * (a two-day version, a price band well below its own) brings in a visitor who
   * bounces, which helps nobody.
   */
  faqs?: {
    question: string;
    answer: string;
  }[];
  /**
   * Optional meta-title and meta-description overrides for this package's page.
   *
   * Without them the title is generated as "<title> – 2N/3D | Safar Trails",
   * which is fine for most packages. Supply these when the page is being written
   * to rank for a specific phrase and the generated form would bury it, or when
   * marketing has already decided the wording.
   *
   * Keep seoTitle at or under 60 characters and seoDescription under 158, or
   * Google truncates them mid-sentence. seoDescription is length-fitted
   * automatically; seoTitle is used exactly as written, the same way
   * DESTINATION_TITLE_OVERRIDES works.
   */
  seoTitle?: string;
  seoDescription?: string;
  /**
   * Where this package sits in the listing. 1 shows first, 2 second, and so on;
   * packages without it fall in behind, ordered by slug as before.
   *
   * Packages were previously listed alphabetically by slug, which put Andaman at
   * the top all year for no reason anyone chose. What sells changes with the
   * season - Shimla and Manali from September through January, Chardham from
   * May to October - so the order is now a decision, made in the content files
   * and changeable from a phone without touching code.
   *
   * Reorder seasonally. A package nobody is searching for in December should not
   * be occupying the first card.
   */
  displayOrder?: number;

  /**
   * A short label on the card and the detail hero, e.g. "Trending No.1".
   *
   * Free text and set per package in content/, because the thing worth
   * shouting about changes: it is the season's bestseller in one month and a
   * new launch the next, and neither is worth a code change. Deliberately not
   * a boolean called `isTrending` - that would bake one wording into the
   * components and leave the copy stranded where it cannot be edited.
   *
   * Only one package should carry one at a time. A badge on every card is a
   * badge on none.
   */
  badge?: string;
}

export interface DestinationHighlight {
  icon?: string;
  title: string;
  description?: string;
}

export interface Destination {
  slug: string;
  name: string;
  displayName?: string;
  category?: string;
  tagline: string;
  state: string;
  heroImage: string;
  cardImage: string;
  shortDescription: string;
  fullOverview: string;
  bestTime: string;
  temperatureRange: string;
  startingPrice: number;
  idealDays: string;
  rating?: number;
  reviewCount?: number;
  isTrending?: boolean;
  highlights: (string | DestinationHighlight)[];
  howToReach: {
    air: string;
    rail: string;
    road: string;
  };
  topAttractions: {
    name: string;
    description: string;
    image: string;
  }[];
  stayCategories: {
    category: string;
    priceRange: string;
    recommendation: string;
  }[];
  travelTips: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
  seoTitle: string;
  seoDescription: string;
}

export interface TravelGuide {
  slug: string;
  destinationSlug: string;
  destinationName: string;
  title: string;
  subtitle: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedDate: string;
  heroImage: string;
  category: 'Itinerary' | 'Cost Breakdown' | 'Best Time' | 'Offbeat' | 'Honeymoon' | 'Food & Culture';
  excerpt: string;
  contentSections: {
    heading: string;
    content: string;
    bulletPoints?: string[];
    highlightQuote?: string;
  }[];
  relatedPackageSlugs: string[];
}

export interface CustomerReview {
  id: string;
  authorName: string;
  city: string;
  tripName: string;
  destination: string;
  rating: number;
  reviewText: string;
  date: string;
  travelType: string;
  avatar: string;
  verified: boolean;
  userPhotos?: string[];
}

export interface AITripPlanRequest {
  destination: string;
  startCity?: string;
  travelDates?: string;
  durationDays: number;
  travellers: number;
  tripType: TripType;
  budgetTotal?: number;
  hotelCategory?: HotelCategory;
  transportMode?: TransportType;
  interests: string[];
  specialRequests?: string;
  userPrompt?: string;
}

export interface AITripPlanResult {
  planId: string;
  destination: string;
  title: string;
  summary: string;
  durationDays: number;
  durationNights: number;
  travellersCount: number;
  tripType: string;
  hotelCategory: string;
  transportType: string;
  estimatedBudget: {
    min: number;
    max: number;
    perPerson: number;
    breakdown: {
      hotels: number;
      transport: number;
      sightseeingAndPermits: number;
      foodAndMisc: number;
    };
  };
  itinerary: ItineraryDay[];
  includedHighlights: string[];
  expertTips: string[];
  packingEssentials: string[];
  bestTimeToVisitInfo: string;
  disclaimer: string;
}

export interface LeadEnquiry {
  id?: string;
  name: string;
  phone: string;
  email: string;
  destination: string;
  travelDates: string;
  travellers: string;
  budget?: string;
  tripType?: string;
  itinerarySummary?: string;
  specialNotes?: string;
  source?: string;
}
