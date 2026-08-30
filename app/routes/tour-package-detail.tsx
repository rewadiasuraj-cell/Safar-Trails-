import React, { Suspense, lazy } from 'react';
import { useParams } from 'react-router';
import { packagesData } from '../../src/data/packagesData';
import type { Route } from './+types/tour-package-detail';

const SanityPackageDetailPage = lazy(() => import('../../src/components/Sanity/PackageDetailPage').then(m => ({ default: m.PackageDetailPage })));

export const meta: Route.MetaFunction = ({ params }) => {
  const slug = params.slug || '';
  const staticFallback = packagesData.find(p => p.slug === slug);
  const name = staticFallback?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const duration = staticFallback?.duration || '';
  const title = duration ? `${name} — ${duration} | Safar Trails` : `${name} | Safar Trails`;
  const rawDesc = staticFallback?.overview || staticFallback?.subtitle || `Book ${name} with Safar Trails. Includes stay, private transport, sightseeing & 24/7 concierge support.`;
  const description = rawDesc.replace(/(<([^>]+)>)/gi, '').slice(0, 155);
  const ogImage = staticFallback?.heroImage || 'https://safartrails.co.in/og-image.jpg';

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: `https://safartrails.co.in/tour-packages/${slug}` },
    { property: "og:image", content: ogImage },
    { property: "og:type", content: "product" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];
};

export default function TourPackageDetailRoute() {
  const params = useParams();
  const slug = params.slug || '';
  const pkg = packagesData.find(p => p.slug === slug);
  const name = pkg?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const price = pkg?.price || 14999;
  const image = pkg?.heroImage || 'https://safartrails.co.in/og-image.jpg';
  const description = (pkg?.overview || `Customized ${name} holiday package with Safar Trails.`).slice(0, 155);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name,
    image: [image],
    description: description,
    brand: {
      '@type': 'Brand',
      name: 'SafarTrails',
    },
    offers: {
      '@type': 'Offer',
      url: `https://safartrails.co.in/tour-packages/${slug}`,
      priceCurrency: 'INR',
      price: price,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'SafarTrails',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1420',
    },
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
        name: 'Tour Packages',
        item: 'https://safartrails.co.in/packages',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: name,
        item: `https://safartrails.co.in/tour-packages/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense fallback={<div className="w-full py-12 flex items-center justify-center min-h-[140px]" />}>
        <SanityPackageDetailPage onOpenQuoteModal={() => {}} />
      </Suspense>
    </>
  );
}
