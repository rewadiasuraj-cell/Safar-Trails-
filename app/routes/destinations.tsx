import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from './+types/destinations';

const SanityDestinationsPage = lazy(() => import('../../src/components/Sanity/DestinationsPage').then(m => ({ default: m.DestinationsPage })));

export const meta: Route.MetaFunction = () => [
  { title: "Top Travel Destinations in India — Holiday Packages 2026 | Safar Trails" },
  { name: "description", content: "Explore handpicked travel destinations across India. From Kashmir snow to Kerala backwaters, plan your customized tour package with Safar Trails." },
  { property: "og:title", content: "Top Travel Destinations in India — Holiday Packages 2026 | Safar Trails" },
  { property: "og:description", content: "Explore handpicked travel destinations across India. From Kashmir snow to Kerala backwaters, plan your customized tour package with Safar Trails." },
  { property: "og:url", content: "https://safartrails.co.in/destinations" },
  { property: "og:image", content: "https://safartrails.co.in/og-image.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
];

export default function DestinationsRoute() {
  const navigate = useNavigate();
  return (
    <div className="pt-20">
      <Suspense fallback={<div className="w-full py-12 flex items-center justify-center min-h-[140px]" />}>
        <SanityDestinationsPage
          onSelectDestination={(slug) => navigate(`/destinations/${slug}`)}
          onPlanDestinationWithAI={(destName) => navigate(`/ai-planner?dest=${encodeURIComponent(destName)}`)}
          onOpenQuoteModal={() => {}}
        />
      </Suspense>
    </div>
  );
}
