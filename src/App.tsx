import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeroSection } from './components/HeroSection';
import { HandpickedExperiencesSection } from './components/HandpickedExperiencesSection';
import { StickyContactWidget } from './components/StickyContactWidget';
import { Footer } from './components/Footer';
import { ContactUs } from './components/ContactUs';
import { AIPlannerTeaser } from './components/AIPlannerTeaser';

import { Package, TravelGuide } from './types';
import { initGA, trackPageView } from './lib/analytics';

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

// Code-split modals so their JS is only downloaded when opened by user
const GlobalSearchModal = lazy(() => import('./components/GlobalSearchModal').then(m => ({ default: m.GlobalSearchModal })));
const QuoteRequestModal = lazy(() => import('./components/QuoteRequestModal').then(m => ({ default: m.QuoteRequestModal })));
const PolicyModals = lazy(() => import('./components/PolicyModals').then(m => ({ default: m.PolicyModals })));

// Sanity-backed pages: the standalone Destinations/Packages/Guides pages fetch
// live content from the Sanity Studio, replacing the hardcoded data files.
// The curated Home-page teaser sections above keep using the static mock data.
const SanityDestinationsPage = lazy(() => import('./components/Sanity/DestinationsPage').then(m => ({ default: m.DestinationsPage })));
const SanityDestinationDetailPage = lazy(() => import('./components/Sanity/DestinationDetailPage').then(m => ({ default: m.DestinationDetailPage })));
const SanityPackagesPage = lazy(() => import('./components/Sanity/PackagesPage').then(m => ({ default: m.PackagesPage })));
const SanityPackageDetailPage = lazy(() => import('./components/Sanity/PackageDetailPage').then(m => ({ default: m.PackageDetailPage })));
const LocalPackageDetailPage = lazy(() => import('./components/Packages/PackageDetailPage').then(m => ({ default: m.PackageDetailPage })));
const SanityGuidesPage = lazy(() => import('./components/Sanity/GuidesPage').then(m => ({ default: m.GuidesPage })));
const SanityGuideDetailPage = lazy(() => import('./components/Sanity/GuideDetailPage').then(m => ({ default: m.GuideDetailPage })));

// Lightweight section skeleton for smooth progressive hydration
function SectionSkeleton() {
  return <div className="w-full py-12 flex items-center justify-center min-h-[140px]" />;
}

// Maps a legacy view id (still used by Header/Footer/MobileBottomNav) to its route path
const VIEW_TO_PATH: Record<string, string> = {
  home: '/',
  destinations: '/destinations',
  packages: '/packages',
  'ai-planner': '/ai-planner',
  guides: '/guides',
  'why-us': '/about-us',
  'contact-us': '/contact-us',
};

// Maps the current URL back to the legacy view id used for nav active-state highlighting
function pathToView(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname === '/destinations') return 'destinations';
  if (pathname.startsWith('/destinations/')) return 'destination-detail';
  if (pathname === '/packages') return 'packages';
  if (pathname === '/ai-planner') return 'ai-planner';
  if (pathname === '/guides') return 'guides';
  if (pathname.startsWith('/guides/')) return 'guide-detail';
  if (pathname === '/about-us') return 'why-us';
  if (pathname === '/contact-us') return 'contact-us';
  return 'home';
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentView = pathToView(location.pathname);

  // Modals & Overlays
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchModalMounted, setSearchModalMounted] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteModalInitialSummary, setQuoteModalInitialSummary] = useState<string>('');
  const [quoteModalInitialDestination, setQuoteModalInitialDestination] = useState<string>('');
  const [activePolicyType, setActivePolicyType] = useState<'privacy' | 'terms' | 'cancellation' | null>(null);

  // AI Planner Context Seed
  const [aiPlannerSeedPrompt, setAiPlannerSeedPrompt] = useState<string>('');
  const [aiPlannerSeedDestination, setAiPlannerSeedDestination] = useState<string>('');

  // Initialize GA4 once (auto-pageview disabled; page_view is sent per-route below)
  useEffect(() => {
    initGA();
  }, []);

  // Scroll to top and record a GA4 page_view on every route change (including initial load)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackPageView(location.pathname);
  }, [location.pathname]);

  const handleNavigate = (view: string, param?: string) => {
    if (view === 'destination-detail' && param) {
      navigate(`/destinations/${param}`);
    } else if (view === 'guide-detail' && param) {
      navigate(`/guides/${param}`);
    } else {
      navigate(VIEW_TO_PATH[view] || '/');
    }
  };

  const handleStartAIPlan = (promptText?: string, destinationName?: string) => {
    if (promptText) setAiPlannerSeedPrompt(promptText);
    if (destinationName) setAiPlannerSeedDestination(destinationName);
    navigate('/ai-planner');
  };

  const handleOpenQuoteModal = (summary?: string, destinationName?: string) => {
    setQuoteModalInitialSummary(summary || '');
    setQuoteModalInitialDestination(destinationName || '');
    setQuoteModalOpen(true);
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
    <div className="min-h-screen w-full flex flex-col bg-white text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* Primary Desktop & Mobile Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => {
          setSearchModalMounted(true);
          setSearchModalOpen(true);
        }}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      {/* Main Content Router */}
      <main className="w-full flex-grow">
        <Routes>
          {/* ROUTE: HOME (Master Editorial Layout) */}
          <Route
            path="/"
            element={
              <>
                <HeroSection
                  onStartAIPlan={(prompt) => handleStartAIPlan(prompt)}
                  onExplorePackages={() => {
                    const el = document.getElementById('packages-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else navigate('/packages');
                  }}
                />

                <HandpickedExperiencesSection
                  onSelectDestination={(slug) => handleSelectDestination(slug)}
                  onSelectCategory={() => {
                    const el = document.getElementById('destinations-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else navigate('/destinations');
                  }}
                  onViewAll={() => {
                    const el = document.getElementById('destinations-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else navigate('/destinations');
                  }}
                  onOpenQuoteModal={handleOpenQuoteModal}
                />

                <AIPlannerTeaser />

                <Suspense fallback={<SectionSkeleton />}>
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
            }
          />

          {/* ROUTE: ALL DESTINATIONS (live from Sanity) */}
          <Route
            path="/destinations"
            element={
              <div className="pt-20">
                <Suspense fallback={<SectionSkeleton />}>
                  <SanityDestinationsPage
                    onSelectDestination={handleSelectDestination}
                    onPlanDestinationWithAI={(destName) => handleStartAIPlan(undefined, destName)}
                    onOpenQuoteModal={handleOpenQuoteModal}
                  />
                </Suspense>
              </div>
            }
          />

          {/* ROUTE: SINGLE DESTINATION DETAIL (live from Sanity) */}
          <Route
            path="/destinations/:slug"
            element={
              <Suspense fallback={<SectionSkeleton />}>
                <SanityDestinationDetailPage
                  onStartAIPlan={(destName) => handleStartAIPlan(undefined, destName)}
                  onOpenQuoteModal={handleOpenQuoteModal}
                />
              </Suspense>
            }
          />

          {/* ROUTE: ALL PACKAGES (live from Sanity) */}
          <Route
            path="/packages"
            element={
              <div className="pt-20">
                <Suspense fallback={<SectionSkeleton />}>
                  <SanityPackagesPage />
                </Suspense>
              </div>
            }
          />

          {/* ROUTE: SINGLE PACKAGE DETAIL (live from Sanity) */}
          <Route
            path="/packages/:slug"
            element={
              <Suspense fallback={<SectionSkeleton />}>
                <SanityPackageDetailPage onOpenQuoteModal={handleOpenQuoteModal} />
              </Suspense>
            }
          />

          {/* ROUTE: DESTINATION-SPECIFIC PACKAGE DETAIL */}
          <Route
            path="/destinations/:destSlug/packages/:pkgSlug"
            element={
              <Suspense fallback={<SectionSkeleton />}>
                <LocalPackageDetailPage
                  onStartAIPlan={handleStartAIPlan}
                  onOpenQuoteModal={handleOpenQuoteModal}
                />
              </Suspense>
            }
          />

          {/* ROUTE: SINGLE PACKAGE DETAIL (curated Home-page teaser packages, static data) */}
          <Route
            path="/tour-packages/:slug"
            element={
              <Suspense fallback={<SectionSkeleton />}>
                <LocalPackageDetailPage
                  onStartAIPlan={handleStartAIPlan}
                  onOpenQuoteModal={handleOpenQuoteModal}
                />
              </Suspense>
            }
          />

          {/* ROUTE: STANDALONE AI TRIP PLANNER */}
          <Route
            path="/ai-planner"
            element={
              <div className="pt-20 pb-16">
                <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-4">
                  <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-gray-200 hover:border-black text-slate-800 hover:text-black text-xs font-bold uppercase tracking-wide transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Home</span>
                  </button>
                </div>
                <Suspense fallback={<SectionSkeleton />}>
                  <AITripPlanner
                    initialPrompt={aiPlannerSeedPrompt}
                    initialDestination={aiPlannerSeedDestination}
                    onOpenQuoteModal={handleOpenQuoteModal}
                  />
                </Suspense>
              </div>
            }
          />

          {/* ROUTE: TRAVEL GUIDES HUB (live from Sanity) */}
          <Route
            path="/guides"
            element={
              <div className="pt-20">
                <Suspense fallback={<SectionSkeleton />}>
                  <SanityGuidesPage onSelectGuide={(slug) => navigate(`/guides/${slug}`)} />
                </Suspense>
              </div>
            }
          />

          {/* ROUTE: SINGLE TRAVEL GUIDE ARTICLE (live from Sanity) */}
          <Route
            path="/guides/:slug"
            element={
              <Suspense fallback={<SectionSkeleton />}>
                <SanityGuideDetailPage />
              </Suspense>
            }
          />

          {/* ROUTE: ABOUT US / WHY SAFARTRAILS */}
          <Route
            path="/about-us"
            element={
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
            }
          />

          {/* ROUTE: CONTACT US */}
          <Route
            path="/contact-us"
            element={
              <div className="pt-20">
                <ContactUs onOpenQuoteModal={handleOpenQuoteModal} />
              </div>
            }
          />

          {/* Unknown paths fall back to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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

        {searchModalMounted && (
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
