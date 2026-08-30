import React from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import { HeroSection } from '../../src/components/HeroSection';
import { HandpickedExperiencesSection } from '../../src/components/HandpickedExperiencesSection';
import { AIPlannerTeaser } from '../../src/components/AIPlannerTeaser';
import { DestinationsSection } from '../../src/components/Destinations/DestinationsSection';
import { PackagesSection } from '../../src/components/Packages/PackagesSection';
import { TravelStylesSection } from '../../src/components/TravelStylesSection';
import { SeasonalTripsSection } from '../../src/components/SeasonalTripsSection';
import { TravelGuidesSection } from '../../src/components/TravelGuides/TravelGuidesSection';
import { TrustSection } from '../../src/components/TrustSection';
import { ReviewsSection } from '../../src/components/ReviewsSection';
import { FAQSection } from '../../src/components/FAQSection';
import { FinalCTASection } from '../../src/components/FinalCTASection';
import { Package, TravelGuide } from '../../src/types';
import type { Route } from './+types/home';

export const meta: Route.MetaFunction = () => [
  { title: "Safar Trails — AI-Powered India Holiday Packages & Custom Itineraries" },
  { name: "description", content: "AI plans. Experts perfect. Discover bespoke holiday packages across Kashmir, Goa, Kerala, Rajasthan, Himachal, Uttarakhand & beyond with SafarTrails." },
  { tagName: "link", rel: "canonical", href: "https://safartrails.co.in/" },
  { property: "og:title", content: "Safar Trails — AI-Powered India Holiday Packages & Custom Itineraries" },
  { property: "og:description", content: "AI-powered custom holiday planning handcrafted by verified destination experts. Discover India with Trust." },
  { property: "og:url", content: "https://safartrails.co.in/" },
  { property: "og:image", content: "https://safartrails.co.in/og-image.jpg" },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Safar Trails — AI-Powered India Holiday Packages & Custom Itineraries" },
  { name: "twitter:description", content: "AI plans. Experts perfect. Discover bespoke holiday packages across Kashmir, Goa, Kerala, Rajasthan & beyond with SafarTrails." },
  { name: "twitter:image", content: "https://safartrails.co.in/og-image.jpg" },
];

export default function HomeRoute() {
  const navigate = useNavigate();
  const outletContext = useOutletContext<{
    handleOpenQuoteModal?: (summary?: string, destinationName?: string) => void;
  }>();

  const handleOpenQuoteModal = outletContext?.handleOpenQuoteModal || (() => {});

  const handleStartAIPlan = (promptText?: string, destinationName?: string) => {
    const params = new URLSearchParams();
    if (promptText) params.set('prompt', promptText);
    if (destinationName) params.set('dest', destinationName);
    navigate(`/ai-planner?${params.toString()}`);
  };

  const handleSelectPackage = (pkg: Package) => {
    navigate(`/packages/${pkg.slug}`);
  };

  const handleSelectDestination = (slug: string) => {
    navigate(`/destinations/${slug}`);
  };

  const handleSelectGuide = (guide: TravelGuide) => {
    navigate(`/guides/${guide.slug}`);
  };

  return (
    <>
      <HeroSection
        onStartAIPlan={(prompt) => handleStartAIPlan(prompt)}
        onExplorePackages={() => {
          if (typeof document !== 'undefined') {
            const el = document.getElementById('packages-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else navigate('/packages');
          } else {
            navigate('/packages');
          }
        }}
      />

      <HandpickedExperiencesSection
        onSelectDestination={(slug) => handleSelectDestination(slug)}
        onSelectCategory={() => {
          if (typeof document !== 'undefined') {
            const el = document.getElementById('destinations-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else navigate('/destinations');
          } else {
            navigate('/destinations');
          }
        }}
        onViewAll={() => {
          if (typeof document !== 'undefined') {
            const el = document.getElementById('destinations-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else navigate('/destinations');
          } else {
            navigate('/destinations');
          }
        }}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      <AIPlannerTeaser />

      <DestinationsSection
        onSelectDestination={handleSelectDestination}
        onPlanDestinationWithAI={(destName) => handleStartAIPlan(undefined, destName)}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      <PackagesSection
        onSelectPackage={handleSelectPackage}
        onCustomizePackageWithAI={(title, dest) => handleStartAIPlan(`Customize ${title} in ${dest}`, dest)}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      <TravelStylesSection
        onSelectStyle={() => {
          if (typeof document !== 'undefined') {
            const el = document.getElementById('packages-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onExploreStyleWithAI={(style) => handleStartAIPlan(`Plan a ${style} vacation in India`)}
      />

      <SeasonalTripsSection
        onSelectDestinationSlug={handleSelectDestination}
        onStartAIPlan={(prompt) => handleStartAIPlan(prompt)}
      />

      <TravelGuidesSection
        onSelectGuide={handleSelectGuide}
      />

      <TrustSection />

      <ReviewsSection />

      <FAQSection />

      <FinalCTASection
        onStartAIPlan={() => handleStartAIPlan()}
        onOpenQuoteModal={handleOpenQuoteModal}
      />
    </>
  );
}
