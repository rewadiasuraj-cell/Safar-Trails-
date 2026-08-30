import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router';

const SanityDestinationsPage = lazy(() => import('../../src/components/Sanity/DestinationsPage').then(m => ({ default: m.DestinationsPage })));

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
