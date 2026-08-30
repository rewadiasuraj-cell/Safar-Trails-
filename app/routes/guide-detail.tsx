import React, { Suspense, lazy } from 'react';
import { guidesData } from '../../src/data/guidesData';
import type { Route } from './+types/guide-detail';

const SanityGuideDetailPage = lazy(() => import('../../src/components/Sanity/GuideDetailPage').then(m => ({ default: m.GuideDetailPage })));

export const meta: Route.MetaFunction = ({ params }) => {
  const slug = params.slug || '';
  const staticFallback = guidesData.find(g => g.slug === slug);
  const titleText = staticFallback?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const title = `${titleText} | Safar Trails Travel Guide`;
  const rawDesc = staticFallback?.excerpt || staticFallback?.readTime || `Read our expert travel guide for ${titleText} with Safar Trails. Top places to visit, trip costs & local tips.`;
  const description = rawDesc.replace(/(<([^>]+)>)/gi, '').slice(0, 155);
  const ogImage = staticFallback?.coverImage || 'https://safartrails.co.in/og-image.jpg';

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: `https://safartrails.co.in/guides/${slug}` },
    { property: "og:image", content: ogImage },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];
};

export default function GuideDetailRoute() {
  return (
    <Suspense fallback={<div className="w-full py-12 flex items-center justify-center min-h-[140px]" />}>
      <SanityGuideDetailPage />
    </Suspense>
  );
}
