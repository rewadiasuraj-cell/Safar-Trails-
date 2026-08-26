import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeroSection } from './components/HeroSection';
import { HandpickedExperiencesSection } from './components/HandpickedExperiencesSection';
import { AITripPlanner } from './components/AITripPlanner/AITripPlanner';
import { DestinationsSection } from './components/Destinations/DestinationsSection';
import { DestinationDetailView } from './components/Destinations/DestinationDetailView';
import { PackagesSection } from './components/Packages/PackagesSection';
import { PackageDetailModal } from './components/Packages/PackageDetailModal';
import { TravelStylesSection } from './components/TravelStylesSection';
import { SeasonalTripsSection } from './components/SeasonalTripsSection';
import { TravelGuidesSection } from './components/TravelGuides/TravelGuidesSection';
import { TravelGuideArticleView } from './components/TravelGuides/TravelGuideArticleView';
import { TrustSection } from './components/TrustSection';
import { ReviewsSection } from './components/ReviewsSection';
import { FAQSection } from './components/FAQSection';
import { FinalCTASection } from './components/FinalCTASection';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { QuoteRequestModal } from './components/QuoteRequestModal';
import { PolicyModals } from './components/PolicyModals';

import { destinationsData } from './data/destinationsData';
import { packagesData } from './data/packagesData';
import { guidesData } from './data/guidesData';
import { Package, Destination, TravelGuide, TripType } from './types';

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
    
    // If on home view, scroll smoothly to the AI Planner section
    if (currentView === 'home') {
      const el = document.getElementById('ai-trip-planner-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    setCurrentView('ai-planner');
  };

  const handleOpenQuoteModal = (summary?: string) => {
    setQuoteModalInitialSummary(summary || '');
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

  const activeDestination: Destination | undefined = destinationsData.find(
    (d) => d.slug === activeDestinationSlug
  );

  const activeGuide: TravelGuide | undefined = guidesData.find(
    (g) => g.slug === activeGuideSlug
  );

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
              onSelectCategory={(category) => {
                const el = document.getElementById('destinations-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setCurrentView('destinations');
              }}
              onViewAll={() => {
                const el = document.getElementById('destinations-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setCurrentView('destinations');
              }}
            />

            <AITripPlanner
              initialPrompt={aiPlannerSeedPrompt}
              initialDestination={aiPlannerSeedDestination}
              onOpenQuoteModal={handleOpenQuoteModal}
            />

            <DestinationsSection
              onSelectDestination={handleSelectDestination}
              onPlanDestinationWithAI={(destName) => handleStartAIPlan(undefined, destName)}
            />

            <PackagesSection
              onSelectPackage={handleSelectPackage}
              onCustomizePackageWithAI={(title, dest) => handleStartAIPlan(`Customize ${title} in ${dest}`, dest)}
            />

            <TravelStylesSection
              onSelectStyle={(tripType) => {
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
          </>
        )}

        {/* VIEW 2: ALL DESTINATIONS */}
        {currentView === 'destinations' && (
          <div className="pt-20">
            <DestinationsSection
              onSelectDestination={handleSelectDestination}
              onPlanDestinationWithAI={(destName) => handleStartAIPlan(undefined, destName)}
            />
          </div>
        )}

        {/* VIEW 3: SINGLE DESTINATION DETAIL */}
        {currentView === 'destination-detail' && activeDestination && (
          <DestinationDetailView
            destination={activeDestination}
            onBack={() => setCurrentView('destinations')}
            onSelectPackage={handleSelectPackage}
            onStartAIPlan={(destName) => handleStartAIPlan(undefined, destName)}
            onOpenQuoteModal={handleOpenQuoteModal}
          />
        )}

        {/* VIEW 4: ALL PACKAGES */}
        {currentView === 'packages' && (
          <div className="pt-20">
            <PackagesSection
              onSelectPackage={handleSelectPackage}
              onCustomizePackageWithAI={(title, dest) => handleStartAIPlan(`Customize ${title} in ${dest}`, dest)}
            />
          </div>
        )}

        {/* VIEW 5: STANDALONE AI TRIP PLANNER */}
        {currentView === 'ai-planner' && (
          <div className="pt-20 pb-16">
            <AITripPlanner
              initialPrompt={aiPlannerSeedPrompt}
              initialDestination={aiPlannerSeedDestination}
              onOpenQuoteModal={handleOpenQuoteModal}
            />
          </div>
        )}

        {/* VIEW 6: TRAVEL GUIDES HUB */}
        {currentView === 'guides' && (
          <div className="pt-20">
            <TravelGuidesSection
              onSelectGuide={handleSelectGuide}
            />
          </div>
        )}

        {/* VIEW 7: SINGLE TRAVEL GUIDE ARTICLE */}
        {currentView === 'guide-detail' && activeGuide && (
          <TravelGuideArticleView
            guide={activeGuide}
            onBack={() => setCurrentView('guides')}
            onSelectPackage={handleSelectPackage}
            onStartAIPlan={(destName) => handleStartAIPlan(undefined, destName)}
            onOpenQuoteModal={handleOpenQuoteModal}
          />
        )}

        {/* VIEW 8: WHY SAFARTRAILS / TRUST */}
        {currentView === 'why-us' && (
          <div className="pt-20">
            <TrustSection />
            <ReviewsSection />
            <FAQSection />
            <FinalCTASection
              onStartAIPlan={() => handleStartAIPlan()}
              onOpenQuoteModal={() => handleOpenQuoteModal()}
            />
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

      {/* MODALS */}
      {/* 1. Package Detail Modal */}
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

      {/* 2. Global Search Overlay */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectDestination={handleSelectDestination}
        onSelectPackage={handleSelectPackage}
        onSelectGuide={handleSelectGuide}
        onStartAIPlan={(query) => handleStartAIPlan(query)}
      />

      {/* 3. Quote Request Modal */}
      <QuoteRequestModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialSummary={quoteModalInitialSummary}
      />

      {/* 4. Policy Modals */}
      <PolicyModals
        type={activePolicyType}
        onClose={() => setActivePolicyType(null)}
      />
    </div>
  );
}
