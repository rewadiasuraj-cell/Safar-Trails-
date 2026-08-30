import React from 'react';
import { packagesData } from '../../src/data/packagesData';
import { PackageDetailPage } from '../../src/components/Sanity/PackageDetailPage';
import type { Route } from './+types/tour-package-detail';

export const links: Route.LinksFunction = (arg) => {
  const params = arg?.params || {};
  const slug = params.slug || '';
  return [
    { rel: 'canonical', href: `https://safartrails.co.in/packages/${slug}` }
  ];
};

export const meta: Route.MetaFunction = (arg) => {
  const params = arg?.params || {};
  const slug = params.slug || '';
  const staticFallback = packagesData.find(p => p.slug === slug);
  const name = staticFallback?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const duration = staticFallback ? `${staticFallback.durationDays} Days / ${staticFallback.durationNights} Nights` : '';
  const title = duration ? `${name} — ${duration} | Safar Trails` : `${name} | Safar Trails`;
  const rawDesc = staticFallback?.overview || `Book ${name} with Safar Trails. Includes stay, private transport, sightseeing & 24/7 concierge support.`;
  const description = rawDesc.replace(/(<([^>]+)>)/gi, '').slice(0, 155);
  const ogImage = staticFallback?.heroImage || 'https://safartrails.co.in/og-image.jpg';

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: `https://safartrails.co.in/packages/${slug}` },
    { property: "og:image", content: ogImage },
    { property: "og:type", content: "product" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];
};

export default function TourPackageDetailRoute({ params }: Route.ComponentProps) {
  const slug = params?.slug || '';
  return <PackageDetailPage slug={slug} onOpenQuoteModal={() => {}} />;
}
