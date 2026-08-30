import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router';

const SanityGuidesPage = lazy(() => import('../../src/components/Sanity/GuidesPage').then(m => ({ default: m.GuidesPage })));

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
