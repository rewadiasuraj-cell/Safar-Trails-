import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router';

const LocalPackageDetailPage = lazy(() => import('../../src/components/Packages/PackageDetailPage').then(m => ({ default: m.PackageDetailPage })));

export default function DestinationPackageDetailRoute() {
  const navigate = useNavigate();
  return (
    <Suspense fallback={<div className="w-full py-12 flex items-center justify-center min-h-[140px]" />}>
      <LocalPackageDetailPage
        onStartAIPlan={(prompt, dest) => navigate(`/ai-planner?prompt=${encodeURIComponent(prompt || '')}&dest=${encodeURIComponent(dest || '')}`)}
        onOpenQuoteModal={() => {}}
      />
    </Suspense>
  );
}
