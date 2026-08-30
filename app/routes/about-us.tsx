import React from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import { TrustSection } from '../../src/components/TrustSection';
import { ReviewsSection } from '../../src/components/ReviewsSection';
import { FAQSection } from '../../src/components/FAQSection';
import { FinalCTASection } from '../../src/components/FinalCTASection';
import type { Route } from './+types/about-us';

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
  const outletContext = useOutletContext<{
    handleOpenQuoteModal?: (summary?: string, destinationName?: string) => void;
  }>();

  const handleOpenQuoteModal = outletContext?.handleOpenQuoteModal || (() => {});

  return (
    <div className="pt-20">
      <TrustSection />
      <ReviewsSection />
      <FAQSection />
      <FinalCTASection
        onStartAIPlan={() => navigate('/ai-planner')}
        onOpenQuoteModal={handleOpenQuoteModal}
      />
    </div>
  );
}
