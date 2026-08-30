import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from './+types/about-us';

const TrustSection = lazy(() => import('../../src/components/TrustSection').then(m => ({ default: m.TrustSection })));
const ReviewsSection = lazy(() => import('../../src/components/ReviewsSection').then(m => ({ default: m.ReviewsSection })));
const FAQSection = lazy(() => import('../../src/components/FAQSection').then(m => ({ default: m.FAQSection })));
const FinalCTASection = lazy(() => import('../../src/components/FinalCTASection').then(m => ({ default: m.FinalCTASection })));

export const meta: Route.MetaFunction = () => [
  { title: "About Safar Trails — India's Premier AI Travel Agency" },
  { name: "description", content: "Learn about Safar Trails. We blend AI itinerary intelligence with verified human travel experts, transparent pricing & 24/7 dedicated support." },
  { property: "og:title", content: "About Safar Trails — India's Premier AI Travel Agency" },
  { property: "og:description", content: "Learn about Safar Trails. We blend AI itinerary intelligence with verified human travel experts, transparent pricing & 24/7 dedicated support." },
  { property: "og:url", content: "https://safartrails.co.in/about-us" },
  { property: "og:image", content: "https://safartrails.co.in/og-image.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
];

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
