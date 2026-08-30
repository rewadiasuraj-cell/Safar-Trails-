import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  async prerender({ getStaticPaths }) {
    console.log("=== EXECUTING PRERENDER FUNCTION IN REACT ROUTER CONFIG ===");
    const staticPaths = getStaticPaths();
    console.log("getStaticPaths():", staticPaths);
    const dynamicPaths: string[] = [];

    // Static fallback destination slugs
    const staticDestSlugs = [
      'chardham-yatra',
      'kashmir',
      'goa',
      'kerala',
      'rajasthan',
      'himachal-pradesh',
      'andaman',
      'northeast-india',
      'uttarakhand'
    ];

    // Static fallback package slugs
    const staticPkgSlugs = [
      'chardham-yatra-haridwar-yamunotri-gangotri-kedarnath-badrinath-10d9n',
      'chardham-yatra-package',
      'chardham-yatra-premium',
      'kashmir-escape-houseboat-bliss',
      'kashmir-premium-escape',
      'romantic-goa-boutique-beach-backwater',
      'goa-premium-holiday',
      'kerala-nature-munnar-alleppey-houseboat',
      'kerala-complete-holiday',
      'royal-rajasthan-heritage-desert-dunes',
      'rajasthan-heritage-tour',
      'himachal-manali-solang-sissu-retreat',
      'himachal-adventure-tour',
      'andaman-turquoise-havelock-scuba-dream',
      'andaman-premium',
      'meghalaya-living-root-bridges-dawki-shillong',
      'sikkim-explorer',
      'uttarakhand-rishikesh-mussoorie-corbett',
      'auli-himalayan-retreat'
    ];

    try {
      const res = await fetch(
        'https://xmtc060o.apicdn.sanity.io/v2024-06-01/data/query/production?query=*[_type%20in%20[%22destination%22,%20%22tourPackage%22,%20%22guide%22]]{_type,%20%22slug%22:%20slug.current}'
      );
      const data = await res.json();
      const sanityItems = data.result || [];

      sanityItems.forEach((item: { _type: string; slug?: string }) => {
        if (!item.slug) return;
        if (item._type === 'destination') {
          dynamicPaths.push(`/destinations/${item.slug}`);
        } else if (item._type === 'tourPackage') {
          dynamicPaths.push(`/packages/${item.slug}`);
        } else if (item._type === 'guide') {
          dynamicPaths.push(`/guides/${item.slug}`);
        }
      });
    } catch (e) {
      console.warn('Sanity prerender fetch warning:', e);
    }

    staticDestSlugs.forEach((slug) => {
      if (!dynamicPaths.includes(`/destinations/${slug}`)) {
        dynamicPaths.push(`/destinations/${slug}`);
      }
    });

    staticPkgSlugs.forEach((slug) => {
      if (!dynamicPaths.includes(`/packages/${slug}`)) {
        dynamicPaths.push(`/packages/${slug}`);
      }
    });

    const allPaths = Array.from(new Set([...staticPaths, ...dynamicPaths]));
    console.log("TOTAL PRERENDER PATHS:", allPaths.length, allPaths);
    return allPaths;
  },
} satisfies Config;
