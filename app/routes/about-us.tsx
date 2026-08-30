import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router';

const TrustSection = lazy(() => import('../../src/components/TrustSection').then(m => ({ default: m.TrustSection })));
const ReviewsSection = lazy(() => import('../../src/components/ReviewsSection').then(m => ({ default: m.ReviewsSection })));
const FAQSection = lazy(() => import('../../src/components/FAQSection').then(m => ({ default: m.FAQSection })));
const FinalCTASection = lazy(() => import('../../src/components/FinalCTASection').then(m => ({ default: m.FinalCTASection })));

export default function AboutUsRoute() {
  const navigate = useNavigate();
  return (
    <div className="pt-20">
      <Suspense fallback={<div className="w-full py-12 flex items-center justify-center min-h-[140px]" />}>
        <TrustSection />
        <ReviewsSection />
        <FAQSection />
        <FinalCTASection
          onStartAIPlan={() => navigate('/ai-planner')}
          onOpenQuoteModal={() => {}}
        />
      </Suspense>
    </div>
  );
}
