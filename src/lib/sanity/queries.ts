export const DESTINATIONS_QUERY = `*[_type == "destination"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  heroImage,
  gallery,
  highlights,
  bestTimeToVisit
}`;

export const DESTINATION_BY_SLUG_QUERY = `*[_type == "destination" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  description,
  heroImage,
  gallery,
  highlights,
  bestTimeToVisit
}`;

const PACKAGE_PROJECTION = `{
  _id,
  name,
  "slug": slug.current,
  price,
  duration,
  images,
  itinerary,
  inclusions,
  exclusions,
  "destination": destination->{ _id, title, "slug": slug.current }
}`;

const PACKAGE_DETAIL_PROJECTION = `{
  _id,
  name,
  "slug": slug.current,
  price,
  duration,
  images,
  itinerary,
  inclusions,
  exclusions,
  "destination": destination->{ _id, title, "slug": slug.current },
  seoTitle,
  seoDescription,
  tagline,
  startingPoint,
  travelType,
  overview,
  whatIsSection,
  stopsCovered,
  placesCovered,
  bestTimeSections,
  howToReach,
  costNote,
  costFactors,
  highlights,
  accommodationNote,
  accommodationOptions,
  transportationOptions,
  customizeOptions,
  whoCanBook,
  travelTips,
  whyChooseUs,
  faqs,
  bottomCtaHeading,
  bottomCtaText
}`;

export const PACKAGES_QUERY = `*[_type == "tourPackage"] | order(displayOrder asc, name asc) ${PACKAGE_PROJECTION}`;

export const PACKAGES_BY_DESTINATION_SLUG_QUERY = `*[_type == "tourPackage" && destination->slug.current == $slug] | order(displayOrder asc, name asc) ${PACKAGE_PROJECTION}`;

export const PACKAGE_BY_SLUG_QUERY = `*[_type == "tourPackage" && slug.current == $slug][0] ${PACKAGE_DETAIL_PROJECTION}`;

export const GUIDES_QUERY = `*[_type == "guide"] | order(publishedDate desc) {
  _id,
  title,
  "slug": slug.current,
  coverImage,
  author,
  publishedDate,
  "relatedDestination": relatedDestination->{ _id, title, "slug": slug.current }
}`;

export const GUIDE_BY_SLUG_QUERY = `*[_type == "guide" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  coverImage,
  author,
  publishedDate,
  body,
  "relatedDestination": relatedDestination->{ _id, title, "slug": slug.current }
}`;
