import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router';

const SanityDestinationDetailPage = lazy(() => import('../../src/components/Sanity/DestinationDetailPage').then(m => ({ default: m.DestinationDetailPage })));

export default function DestinationDetailRoute() {
  const navigate = useNavigate();
  return (
    <Suspense fallback={<div className="w-full py-12 flex items-center justify-center min-h-[140px]" />}>
      <SanityDestinationDetailPage
        onStartAIPlan={(destName) => navigate(`/ai-planner?dest=${encodeURIComponent(destName)}`)}
        onOpenQuoteModal={() => {}}
      />
    </Suspense>
  );
}
