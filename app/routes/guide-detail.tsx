import React, { Suspense, lazy } from 'react';

const SanityGuideDetailPage = lazy(() => import('../../src/components/Sanity/GuideDetailPage').then(m => ({ default: m.GuideDetailPage })));

export default function GuideDetailRoute() {
  return (
    <Suspense fallback={<div className="w-full py-12 flex items-center justify-center min-h-[140px]" />}>
      <SanityGuideDetailPage />
    </Suspense>
  );
}
