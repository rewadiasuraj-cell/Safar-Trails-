import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeroSection } from './components/HeroSection';
import { HandpickedExperiencesSection } from './components/HandpickedExperiencesSection';
import { StickyContactWidget } from './components/StickyContactWidget';
import { Footer } from './components/Footer';

import { destinationsData } from './data/destinationsData';
import { guidesData } from './data/guidesData';
import { Package, Destination, TravelGuide } from './types';

// Code-split below-the-fold sections to eliminate unused JS on initial mobile paint
const AITripPlanner = lazy(() => import('./components/AITripPlanner/AITripPlanner').then(m => ({ default: m.AITripPlanner })));
const DestinationsSection = lazy(() => import('./components/Destinations/DestinationsSection').then(m => ({ default: m.DestinationsSection })));
const PackagesSection = lazy(() => import('./components/Packages/PackagesSection').then(m => ({ default: m.PackagesSection })));
const TravelStylesSection = lazy(() => import('./components/TravelStylesSection').then(m => ({ default: m.TravelStylesSection })));
const SeasonalTripsSection = lazy(() => import('./components/SeasonalTripsSection').then(m => ({ default: m.SeasonalTripsSection })));
const TravelGuidesSection = lazy(() => import('./components/TravelGuides/TravelGuidesSection').then(m => ({ default: m.TravelGuidesSection })));
const TrustSection = lazy(() => import('./components/TrustSection').then(m => ({ default: m.TrustSection })));
const ReviewsSection = lazy(() => import('./components/ReviewsSection').then(m => ({ default: m.ReviewsSection })));
const FAQSection = lazy(() => import('./components/FAQSection').then(m => ({ default: m.FAQSection })));
const FinalCTASection = lazy(() => import('./components/FinalCTASection').then(m => ({ default: m.FinalCTASection })));

// Code-split route detail views
const DestinationDetailView = lazy(() => import('./components/Destinations/DestinationDetailView').then(m => ({ default: m.DestinationDetailView })));
const TravelGuideArticleView = lazy(() => import('./components/TravelGuides/TravelGuideArticleView').then(m => ({ default: m.TravelGuideArticleView })));

// Code-split modals so their JS is only downloaded when opened by user
const PackageDetailModal = lazy(() => import('./components/Packages/PackageDetailModal').then(m => ({ default: m.PackageDetailModal })));
const GlobalSearchModal = lazy(() => import('./components/GlobalSearchModal').then(m => ({ default: m.GlobalSearchModal })));
const QuoteRequestModal = lazy(() => import('./components/QuoteRequestModal').then(m => ({ default: m.QuoteRequestModal })));
const PolicyModals = lazy(() => import('./components/PolicyModals').then(m => ({ default: m.PolicyModals })));

// Lightweight section skeleton for smooth progressive hydration
function SectionSkeleton() {
  return <div className="w-full py-12 flex items-center justify-center min-h-[140px]" />;
}

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeDestinationSlug, setActiveDestinationSlug] = useState<string | null>(null);
  const [activeGuideSlug, setActiveGuideSlug] = useState<string | null>(null);
  
  // Modals & Overlays
  const [selectedPackageForModal, setSelectedPackageForModal] = useState<Package | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteModalInitialSummary, setQuoteModalInitialSummary] = useState<string>('');
  const [quoteModalInitialDestination, setQuoteModalInitialDestination] = useState<string>('');
  const [activePolicyType, setActivePolicyType] = useState<'privacy' | 'terms' | 'cancellation' | null>(null);

  // AI Planner Context Seed
  const [aiPlannerSeedPrompt, setAiPlannerSeedPrompt] = useState<string>('');
  const [aiPlannerSeedDestination, setAiPlannerSeedDestination] = useState<string>('');

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, activeDestinationSlug, activeGuideSlug]);

  const handleNavigate = (view: string, param?: string) => {
    if (view === 'destination-detail' && param) {
      setActiveDestinationSlug(param);
      setCurrentView('destination-detail');
    } else if (view === 'guide-detail' && param) {
      setActiveGuideSlug(param);
      setCurrentView('guide-detail');
    } else {
      setCurrentView(view);
    }
  };

  const handleStartAIPlan = (promptText?: string, destinationName?: string) => {
    if (promptText) setAiPlannerSeedPrompt(promptText);
    if (destinationName) setAiPlannerSeedDestination(destinationName);
    
    if (currentView === 'home') {
      const el = document.getElementById('ai-trip-planner-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    setCurrentView('ai-planner');
  };

  const handleOpenQuoteModal = (summary?: string, destinationName?: string) => {
    setQuoteModalInitialSummary(summary || '');
    setQuoteModalInitialDestination(destinationName || '');
    setQuoteModalOpen(true);
  };

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackageForModal(pkg);
  };

  const handleSelectDestination = (slug: string) => {
    setActiveDestinationSlug(slug);
    setCurrentView('destination-detail');
  };

  const handleSelectGuide = (guide: TravelGuide) => {
    setActiveGuideSlug(guide.slug);
    setCurrentView('guide-detail');
  };

  const activeDestination: Destination = destinationsData.find(
    (d) => d.slug === activeDestinationSlug
  ) || destinationsData[0];

  const activeGuide: TravelGuide = guidesData.find(
    (g) => g.slug === activeGuideSlug
  ) || guidesData[0];

  return (
    <div className="min-h-screen w-full flex flex-col bg-white text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* Primary Desktop & Mobile Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      {/* Main Content Router */}
      <main className="w-full flex-grow">
        {/* VIEW 1: HOME (Master Editorial Layout) */}
        {currentView === 'home' && (
          <>
            <HeroSection
              onStartAIPlan={(prompt) => handleStartAIPlan(prompt)}
              onExplorePackages={() => {
                const el = document.getElementById('packages-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setCurrentView('packages');
              }}
            />

            <HandpickedExperiencesSection
              onSelectDestination={(slug) => handleSelectDestination(slug)}
              onSelectCategory={() => {
                const el = document.getElementById('destinations-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setCurrentView('destinations');
              }}
              onViewAll={() => {
                const el = document.getElementById('destinations-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setCurrentView('destinations');
              }}
              onOpenQuoteModal={handleOpenQuoteModal}
            />

            <Suspense fallback={<SectionSkeleton />}>
              <AITripPlanner
                initialPrompt={aiPlannerSeedPrompt}
                initialDestination={aiPlannerSeedDestination}
                onOpenQuoteModal={handleOpenQuoteModal}
              />

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
                  const el = document.getElementById('packages-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
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
                onOpenQuoteModal={() => handleOpenQuoteModal()}
              />
            </Suspense>
          </>
        )}

        {/* VIEW 2: ALL DESTINATIONS */}
        {currentView === 'destinations' && (
          <div className="pt-20">
            <Suspense fallback={<SectionSkeleton />}>
              <DestinationsSection
                onSelectDestination={handleSelectDestination}
                onPlanDestinationWithAI={(destName) => handleStartAIPlan(undefined, destName)}
                onOpenQuoteModal={handleOpenQuoteModal}
              />
            </Suspense>
          </div>
        )}

        {/* VIEW 3: SINGLE DESTINATION DETAIL */}
        {currentView === 'destination-detail' && activeDestination && (
          <Suspense fallback={<SectionSkeleton />}>
            <DestinationDetailView
              destination={activeDestination}
              onBack={() => setCurrentView('destinations')}
              onSelectPackage={handleSelectPackage}
              onStartAIPlan={(destName) => handleStartAIPlan(undefined, destName)}
              onOpenQuoteModal={handleOpenQuoteModal}
            />
          </Suspense>
        )}

        {/* VIEW 4: ALL PACKAGES */}
        {currentView === 'packages' && (
          <div className="pt-20">
            <Suspense fallback={<SectionSkeleton />}>
              <PackagesSection
                onSelectPackage={handleSelectPackage}
                onCustomizePackageWithAI={(title, dest) => handleStartAIPlan(`Customize ${title} in ${dest}`, dest)}
                onOpenQuoteModal={handleOpenQuoteModal}
              />
            </Suspense>
          </div>
        )}

        {/* VIEW 5: STANDALONE AI TRIP PLANNER */}
        {currentView === 'ai-planner' && (
          <div className="pt-20 pb-16">
            <Suspense fallback={<SectionSkeleton />}>
              <AITripPlanner
                initialPrompt={aiPlannerSeedPrompt}
                initialDestination={aiPlannerSeedDestination}
                onOpenQuoteModal={handleOpenQuoteModal}
              />
            </Suspense>
          </div>
        )}

        {/* VIEW 6: TRAVEL GUIDES HUB */}
        {currentView === 'guides' && (
          <div className="pt-20">
            <Suspense fallback={<SectionSkeleton />}>
              <TravelGuidesSection
                onSelectGuide={handleSelectGuide}
              />
            </Suspense>
          </div>
        )}

        {/* VIEW 7: SINGLE TRAVEL GUIDE ARTICLE */}
        {currentView === 'guide-detail' && activeGuide && (
          <Suspense fallback={<SectionSkeleton />}>
            <TravelGuideArticleView
              guide={activeGuide}
              onBack={() => setCurrentView('guides')}
              onSelectPackage={handleSelectPackage}
              onStartAIPlan={(destName) => handleStartAIPlan(undefined, destName)}
              onOpenQuoteModal={handleOpenQuoteModal}
            />
          </Suspense>
        )}

        {/* VIEW 8: WHY SAFARTRAILS / TRUST */}
        {currentView === 'why-us' && (
          <div className="pt-20">
            <Suspense fallback={<SectionSkeleton />}>
              <TrustSection />
              <ReviewsSection />
              <FAQSection />
              <FinalCTASection
                onStartAIPlan={() => handleStartAIPlan()}
                onOpenQuoteModal={() => handleOpenQuoteModal()}
              />
            </Suspense>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPolicyModal={(policyType) => setActivePolicyType(policyType)}
      />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Floating Sticky Contact & Free Itinerary Widget */}
      <StickyContactWidget
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      {/* LAZY LOADED MODALS (Only fetched when triggered) */}
      <Suspense fallback={null}>
        {selectedPackageForModal && (
          <PackageDetailModal
            packageData={selectedPackageForModal}
            onClose={() => setSelectedPackageForModal(null)}
            onStartAIPlanWithPackage={(pkg) => {
              setSelectedPackageForModal(null);
              handleStartAIPlan(`Customize ${pkg.title}`, pkg.destination);
            }}
            onOpenQuoteModal={(summary) => {
              setSelectedPackageForModal(null);
              handleOpenQuoteModal(summary);
            }}
          />
        )}

        {searchModalOpen && (
          <GlobalSearchModal
            isOpen={searchModalOpen}
            onClose={() => setSearchModalOpen(false)}
            onSelectDestination={handleSelectDestination}
            onSelectPackage={handleSelectPackage}
            onSelectGuide={handleSelectGuide}
            onStartAIPlan={(query) => handleStartAIPlan(query)}
          />
        )}

        {quoteModalOpen && (
          <QuoteRequestModal
            isOpen={quoteModalOpen}
            onClose={() => setQuoteModalOpen(false)}
            initialSummary={quoteModalInitialSummary}
            initialDestination={quoteModalInitialDestination}
          />
        )}

        {activePolicyType && (
          <PolicyModals
            type={activePolicyType}
            onClose={() => setActivePolicyType(null)}
          />
        )}
      </Suspense>
    </div>
  );
}
