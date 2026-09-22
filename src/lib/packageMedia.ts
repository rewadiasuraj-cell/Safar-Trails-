import { Package } from '../types';
import { destinationsData } from '../data/destinationsData';

export interface Shot {
  src: string;
  /** The place, where the site already states what the photograph shows. */
  caption?: string;
  alt: string;
}

/**
 * Identity of a photograph, for de-duplication.
 *
 * This matters more than it looks. Most packages list two or three
 * galleryImages and two of them are the same Unsplash photo as the hero, just
 * at a different `w=` - Kerala carries the same backwater three times,
 * Rajasthan the same fort twice. Rendered naively that is a gallery showing one
 * picture three times, which reads worse than having no gallery at all.
 *
 * An Unsplash URL carries its photo id in the path (`photo-1544735716-...`), so
 * that is the identity and the query string is noise. Anything else is
 * identified by its path.
 */
function identity(url: string): string {
  const unsplash = url.match(/photo-[A-Za-z0-9_-]+/);
  if (unsplash) return unsplash[0];
  return url.split('?')[0];
}

/** These open full-screen, so ask Unsplash for something bigger than a card. */
function upscale(url: string): string {
  return url.includes('images.unsplash.com') ? url.replace(/\bw=\d+/, 'w=1400') : url;
}

/**
 * Words that carry no place in them. "Kedarnath Temple" is matched on
 * "kedarnath"; matching on "temple" would tie every shrine in India together.
 */
const GENERIC = new Set([
  'temple', 'valley', 'river', 'beach', 'beaches', 'fort', 'palace', 'lake',
  'falls', 'garden', 'gardens', 'island', 'islands', 'pass', 'tunnel', 'hot',
  'springs', 'point', 'road', 'ridge', 'church', 'lodge', 'reserve', 'tiger',
  'dunes', 'sand', 'golden', 'clifftop', 'quarter', 'waterfalls', 'plantation',
  'gondola', 'riverbank', 'backwaters', 'sahib', 'devi', 'city', 'old', 'green',
]);

function placeTokens(name: string): string[] {
  return name
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((t) => t.length >= 4 && !GENERIC.has(t));
}

/**
 * Every photograph the site can honestly show for one package.
 *
 * The problem this solves: a package page was its hero photograph and then
 * three tabs of text. The data to do better was already in the repo and
 * rendered nowhere - `galleryImages` on every package, and 47 captioned
 * photographs of named attractions across the twelve destinations.
 *
 * Sources, in order of how specific they are to the trip:
 *
 *   1. the package's own heroImage and galleryImages
 *   2. attractions of the destinations this itinerary stops in, but only the
 *      ones the itinerary actually names
 *   3. the destination's own hero, as a last resort so a thin package still
 *      has something
 *
 * Rule 2 is the honest part and the reason an attraction is matched rather
 * than just listed. Himachal Pradesh carries seven attraction photographs
 * including Spiti and Bir Billing; a Shimla-Manali-Kasol trip goes to neither.
 * Putting them in the gallery would show a buyer two places the itinerary does
 * not take them. So an attraction is included only when a distinctive word of
 * its name appears in the itinerary's own stops - Shimla, Manali, Solang,
 * Kasol, Manikaran - and the caption is the attraction's name, which is a claim
 * the destination page already makes.
 *
 * What this cannot do is invent depth. Where an operator has one stock photo
 * and no attraction matches, the strip stays short and the component hides
 * itself. That gap closes with the operator's own photographs of the actual
 * hotels, vehicles and trips, not with more stock.
 */
export function packageGallery(pkg: Package): Shot[] {
  // What the itinerary itself says it visits, plus the trip's own labels.
  const haystack = [
    pkg.title,
    pkg.destination,
    ...(pkg.itinerary || []).flatMap((d) => [d.location || '', d.title || '']),
  ]
    .join(' | ')
    .toLowerCase();

  // A destination is on the route when its name appears in that text. Word
  // boundaries, so "Goa" does not match "Goalpara".
  const onRoute = destinationsData.filter((d) => {
    if (d.slug === pkg.destinationSlug) return true;
    const name = d.name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${name}\\b`).test(haystack);
  });

  const onThisTrip = onRoute
    .flatMap((d) => (d.topAttractions || []).map((a) => ({ ...a, destination: d.name })))
    .map((a) => ({ a, score: placeTokens(a.name).filter((t) => haystack.includes(t)).length }))
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .map((x) => x.a);

  // Captions come only from attractions this itinerary actually visits, and the
  // reason is that the alternative was tried and was wrong. Captioning from
  // every attraction the site knows put "Cherrapunji & Nohkalikai Falls" - which
  // is in Meghalaya - under the Sikkim trip's hero, and "Christ Church", which
  // is in Shimla, under a Manali one. Those are real mistakes in the package
  // data, where an operator reused a photo from somewhere else, and a caption
  // that repeats the mistake to a buyer is worse than no caption at all. So an
  // unrecognised photograph simply goes uncaptioned.
  const named = new Map<string, string>();
  for (const a of onThisTrip) if (a.image) named.set(identity(a.image), a.name);

  const seen = new Set<string>();
  const shots: Shot[] = [];

  const push = (src: string | undefined, alt: string, caption?: string) => {
    if (!src) return;
    const id = identity(src);
    if (seen.has(id)) return;
    seen.add(id);
    const known = named.get(id);
    shots.push({ src: upscale(src), alt: known || alt, caption: caption || known });
  };

  push(pkg.heroImage, pkg.title);
  for (const g of pkg.galleryImages || []) push(g, `${pkg.destination} — ${pkg.title}`);
  for (const a of onThisTrip) push(a.image, `${a.name} — ${a.destination}`, a.name);

  // Only if the trip is still thin: the destination's own photograph - and only
  // from a destination the trip itself is about.
  //
  // Two things disqualify a destination here that do not disqualify it above.
  // `onRoute` includes the package's destinationSlug, which is a filing
  // decision rather than a claim about the route: the Nainital trip is filed
  // under Uttarakhand, and Uttarakhand's photograph is Rishikesh. And the
  // `destination` label carries the state as a suffix - "Nainital,
  // Uttarakhand" - so matching on it lets the state back in through the side
  // door. Matching on the title and the itinerary's own stops is the test that
  // actually means "this trip goes there": a Kerala or Shimla package passes
  // it, the Nainital one does not, and its page stays photo-thin until a real
  // Nainital photograph arrives rather than filling with a temple 300km away.
  const subject = [
    pkg.title,
    ...(pkg.itinerary || []).flatMap((d) => [d.location || '', d.title || '']),
  ]
    .join(' | ')
    .toLowerCase();

  if (shots.length < 4) {
    for (const d of onRoute) {
      const name = d.name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (!new RegExp(`\\b${name}\\b`).test(subject)) continue;
      push(d.heroImage, d.name, d.name);
      push(d.cardImage, d.name, d.name);
    }
  }

  return shots.slice(0, 8);
}
