import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router';
import { HeroSection } from '../../src/components/HeroSection';
import { HandpickedExperiencesSection } from '../../src/components/HandpickedExperiencesSection';
import { AIPlannerTeaser } from '../../src/components/AIPlannerTeaser';
import { Package, TravelGuide } from '../../src/types';

const DestinationsSection = lazy(() => import('../../src/components/Destinations/DestinationsSection').then(m => ({ default: m.DestinationsSection })));
const PackagesSection = lazy(() => import('../../src/components/Packages/PackagesSection').then(m => ({ default: m.PackagesSection })));
const TravelStylesSection = lazy(() => import('../../src/components/TravelStylesSection').then(m => ({ default: m.TravelStylesSection })));
const SeasonalTripsSection = lazy(() => import('../../src/components/SeasonalTripsSection').then(m => ({ default: m.SeasonalTripsSection })));
const TravelGuidesSection = lazy(() => import('../../src/components/TravelGuides/TravelGuidesSection').then(m => ({ default: m.TravelGuidesSection })));
const TrustSection = lazy(() => import('../../src/components/TrustSection').then(m => ({ default: m.TrustSection })));
const ReviewsSection = lazy(() => import('../../src/components/ReviewsSection').then(m => ({ default: m.ReviewsSection })));
const FAQSection = lazy(() => import('../../src/components/FAQSection').then(m => ({ default: m.FAQSection })));
const FinalCTASection = lazy(() => import('../../src/components/FinalCTASection').then(m => ({ default: m.FinalCTASection })));

function SectionSkeleton() {
  return <div className="w-full py-12 flex items-center justify-center min-h-[140px]" />;
}

export default function HomeRoute() {
  const navigate = useNavigate();

  const handleStartAIPlan = (promptText?: string, destinationName?: string) => {
    const params = new URLSearchParams();
    if (promptText) params.set('prompt', promptText);
    if (destinationName) params.set('dest', destinationName);
    navigate(`/ai-planner?${params.toString()}`);
  };

  const handleSelectPackage = (pkg: Package) => {
    navigate(`/tour-packages/${pkg.slug}`);
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
        onOpenQuoteModal={() => {}}
      />

      <AIPlannerTeaser />

      <Suspense fallback={<SectionSkeleton />}>
        <DestinationsSection
          onSelectDestination={handleSelectDestination}
          onPlanDestinationWithAI={(destName) => handleStartAIPlan(undefined, destName)}
          onOpenQuoteModal={() => {}}
        />

        <PackagesSection
          onSelectPackage={handleSelectPackage}
          onCustomizePackageWithAI={(title, dest) => handleStartAIPlan(`Customize ${title} in ${dest}`, dest)}
          onOpenQuoteModal={() => {}}
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
          onOpenQuoteModal={() => {}}
        />
      </Suspense>
    </>
  );
}
