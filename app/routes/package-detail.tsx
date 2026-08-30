import React, { Suspense, lazy } from 'react';

const SanityPackageDetailPage = lazy(() => import('../../src/components/Sanity/PackageDetailPage').then(m => ({ default: m.PackageDetailPage })));

export default function PackageDetailRoute() {
  return (
    <Suspense fallback={<div className="w-full py-12 flex items-center justify-center min-h-[140px]" />}>
      <SanityPackageDetailPage onOpenQuoteModal={() => {}} />
    </Suspense>
  );
}
