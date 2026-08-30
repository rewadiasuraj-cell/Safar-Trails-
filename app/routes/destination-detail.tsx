import React from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import { destinationsData } from '../../src/data/destinationsData';
import { DestinationDetailPage as SanityDestinationDetailPage } from '../../src/components/Sanity/DestinationDetailPage';
import type { Route } from './+types/destination-detail';

function useSafeNavigate() {
  try {
    return useNavigate();
  } catch {
    return (to: string) => {
      if (typeof window !== 'undefined') window.location.href = to;
    };
  }
}

export const meta: Route.MetaFunction = (arg) => {
  const params = arg?.params || {};
  const slug = params.slug || '';
  const staticFallback = destinationsData.find(d => d.slug === slug);
  const name = staticFallback?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const title = `${name} Tour Packages 2026 — Customizable Itineraries | Safar Trails`;
  const rawDesc = staticFallback?.seoDescription || staticFallback?.shortDescription || staticFallback?.tagline || `Book customized ${name} holiday packages with Safar Trails. Expert local guidance, premium stays & 24/7 concierge.`;
  const description = rawDesc.replace(/(<([^>]+)>)/gi, '').slice(0, 155);
  const ogImage = staticFallback?.heroImage || 'https://safartrails.co.in/og-image.jpg';

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: `https://safartrails.co.in/destinations/${slug}` },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: `https://safartrails.co.in/destinations/${slug}` },
    { property: "og:image", content: ogImage },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];
};

export default function DestinationDetailRoute({ params }: Route.ComponentProps) {
  const navigate = useSafeNavigate();
  const outletContext = useOutletContext<{
    handleOpenQuoteModal?: (summary?: string, destinationName?: string) => void;
  }>();

  const handleOpenQuoteModal = outletContext?.handleOpenQuoteModal || (() => {});
  const slug = params?.slug || '';
  const dest = destinationsData.find(d => d.slug === slug);
  const name = dest?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const image = dest?.heroImage || 'https://safartrails.co.in/og-image.jpg';
  const description = (dest?.seoDescription || dest?.shortDescription || dest?.tagline || `Explore ${name} holiday packages with Safar Trails.`).slice(0, 155);

  const destinationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: name,
    description: description,
    image: image,
    includesAttraction: (dest?.highlights || []).map((h) => ({
      '@type': 'TouristAttraction',
      name: typeof h === 'string' ? h : h.title,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://safartrails.co.in/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Destinations',
        item: 'https://safartrails.co.in/destinations',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: name,
        item: `https://safartrails.co.in/destinations/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SanityDestinationDetailPage
        onStartAIPlan={(destName) => navigate(`/ai-planner?dest=${encodeURIComponent(destName)}`)}
        onOpenQuoteModal={handleOpenQuoteModal}
      />
    </>
  );
}
