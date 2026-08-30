import React, { Suspense, lazy } from 'react';

const SanityPackagesPage = lazy(() => import('../../src/components/Sanity/PackagesPage').then(m => ({ default: m.PackagesPage })));

export default function PackagesRoute() {
  return (
    <div className="pt-20">
      <Suspense fallback={<div className="w-full py-12 flex items-center justify-center min-h-[140px]" />}>
        <SanityPackagesPage />
      </Suspense>
    </div>
  );
}
