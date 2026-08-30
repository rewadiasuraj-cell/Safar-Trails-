import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from './+types/guides';

const SanityGuidesPage = lazy(() => import('../../src/components/Sanity/GuidesPage').then(m => ({ default: m.GuidesPage })));

export const meta: Route.MetaFunction = () => [
  { title: "India Travel Guides, Tips & Itineraries | Safar Trails Blog" },
  { name: "description", content: "Discover comprehensive travel guides for Kashmir, Goa, Kerala, Rajasthan & Himachal. Best time to visit, trip costs, hidden gems & expert itinerary advice." },
  { property: "og:title", content: "India Travel Guides, Tips & Itineraries | Safar Trails Blog" },
  { property: "og:description", content: "Discover comprehensive travel guides for Kashmir, Goa, Kerala, Rajasthan & Himachal. Best time to visit, trip costs, hidden gems & expert itinerary advice." },
  { property: "og:url", content: "https://safartrails.co.in/guides" },
  { property: "og:image", content: "https://safartrails.co.in/og-image.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
];

export default function GuidesRoute() {
  const navigate = useNavigate();
  return (
    <div className="pt-20">
      <Suspense fallback={<div className="w-full py-12 flex items-center justify-center min-h-[140px]" />}>
        <SanityGuidesPage onSelectGuide={(slug) => navigate(`/guides/${slug}`)} />
      </Suspense>
    </div>
  );
}
