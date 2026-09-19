import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeroSection } from './components/HeroSection';
import { TrustStrip } from './components/TrustStrip';
import { StickyContactWidget } from './components/StickyContactWidget';
import { Footer } from './components/Footer';
import { ContactUs } from './components/ContactUs';
import { AIPlannerTeaser } from './components/AIPlannerTeaser';

import { Package, TravelGuide } from './types';
import { initGA, trackPageView } from './lib/analytics';
import { Seo } from './lib/seo/Seo';
import { NotFoundPage } from './components/NotFoundPage';

// Code-split below-the-fold sections to eliminate unused JS on initial mobile paint
const AITripPlanner = lazy(() => import('./components/AITripPlanner/AITripPlanner').then(m => ({ default: m.AITripPlanner })));
const DestinationsSection = lazy(() => import('./components/Destinations/DestinationsSection').then(m => ({ default: m.DestinationsSection })));
const PackagesSection = lazy(() => import('./components/Packages/PackagesSection').then(m => ({ default: m.PackagesSection })));
const TravelGuidesSection = lazy(() => import('./components/TravelGuides/TravelGuidesSection').then(m => ({ default: m.TravelGuidesSection })));
const TrustSection = lazy(() => import('./components/TrustSection').then(m => ({ default: m.TrustSection })));
const StatsBand = lazy(() => import('./components/StatsBand').then(m => ({ default: m.StatsBand })));
const ReviewsSection = lazy(() => import('./components/ReviewsSection').then(m => ({ default: m.ReviewsSection })));
const FAQSection = lazy(() => import('./components/FAQSection').then(m => ({ default: m.FAQSection })));
const FinalCTASection = lazy(() => import('./components/FinalCTASection').then(m => ({ default: m.FinalCTASection })));

// Code-split modals so their JS is only downloaded when opened by user
const GlobalSearchModal = lazy(() => import('./components/GlobalSearchModal').then(m => ({ default: m.GlobalSearchModal })));
const QuoteRequestModal = lazy(() => import('./components/QuoteRequestModal').then(m => ({ default: m.QuoteRequestModal })));
const PolicyModals = lazy(() => import('./components/PolicyModals').then(m => ({ default: m.PolicyModals })));

// Standalone pages. Every one of these renders from content/ via
// src/data/generated, so there is no runtime CMS fetch on any route - each page
// is fully present in the prerendered HTML before JavaScript loads.
const LocalPackageDetailPage = lazy(() => import('./components/Packages/PackageDetailPage').then(m => ({ default: m.PackageDetailPage })));
const DestinationDetailRoute = lazy(() => import('./components/routes/DestinationDetailRoute').then(m => ({ default: m.DestinationDetailRoute })));
const GuideArticleRoute = lazy(() => import('./components/routes/GuideArticleRoute').then(m => ({ default: m.GuideArticleRoute })));

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
    <div className="min-h-screen w-full flex flex-col bg-white text-stone-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* Keeps <head> in sync with the route on every client-side navigation. */}
      <Seo />

      {/* WCAG 2.2 AA 2.4.1 Bypass Blocks - visible only once focused via Tab. */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

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
      <main id="main-content" tabIndex={-1} className="w-full flex-grow">
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

                {/* Trust comes second, not seventh.
                    The long version, TrustSection, used to be the only place
                    the site made its case, six screens down. This is the same
                    four promises in one band, where a first-time visitor
                    actually decides whether to keep reading. */}
                <TrustStrip />

                {/* HandpickedExperiencesSection was here: a marquee of eight
                    hardcoded destinations, sitting directly above
                    DestinationsSection, which renders the real twelve from
                    content/. Two destination sections back to back, the first
                    one a list that had to be edited by hand every time a
                    destination changed. The grid below does the job. */}

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

                  {/* TravelStylesSection and SeasonalTripsSection were here.
                      With Handpicked, Destinations and Packages above them, the
                      homepage carried five separate grids over the same 21
                      trips - the visitor scrolled the same inventory sliced five
                      ways. Both are removed; the filters on /packages do the
                      same job at the point someone is actually choosing.
                      The matching "Popular travel styles" block is out of the
                      homepage prerender too, so nothing is left in the markup
                      that the page does not show. */}

                  <TravelGuidesSection
                    onSelectGuide={handleSelectGuide}
                  />

                  {/* TrustSection is no longer here - TrustStrip carries it at
                      the top of the page, and the six-pillar version still
                      runs in full on /about-us. Repeating it in both places
                      was the site making its own case twice to the same
                      scroll. */}

                  <ReviewsSection />

                  <FAQSection />

                  <FinalCTASection
                    onStartAIPlan={() => handleStartAIPlan()}
                    onOpenQuoteModal={() => handleOpenQuoteModal()}
                  />

                  <StatsBand />
                </Suspense>
              </>
            }
          />

          {/* ROUTE: ALL DESTINATIONS */}
          <Route
            path="/destinations"
            element={
              <div className="pt-20">
                <Suspense fallback={<SectionSkeleton />}>
                  <DestinationsSection
                    asPage
                    onSelectDestination={handleSelectDestination}
                    onPlanDestinationWithAI={(destName) => handleStartAIPlan(undefined, destName)}
                    onOpenQuoteModal={handleOpenQuoteModal}
                  />
                </Suspense>
              </div>
            }
          />

          {/* ROUTE: SINGLE DESTINATION DETAIL */}
          <Route
            path="/destinations/:slug"
            element={
              <Suspense fallback={<SectionSkeleton />}>
                <DestinationDetailRoute
                  onStartAIPlan={(destName) => handleStartAIPlan(undefined, destName)}
                  onOpenQuoteModal={handleOpenQuoteModal}
                />
              </Suspense>
            }
          />

          {/* ROUTE: ALL PACKAGES */}
          <Route
            path="/packages"
            element={
              <div className="pt-20">
                <Suspense fallback={<SectionSkeleton />}>
                  <PackagesSection
                    asPage
                    onSelectPackage={handleSelectPackage}
                    onCustomizePackageWithAI={(title, dest) => handleStartAIPlan(`Customize ${title} in ${dest}`, dest)}
                    onOpenQuoteModal={handleOpenQuoteModal}
                  />
                </Suspense>
              </div>
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
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-stone-200 hover:border-black text-stone-800 hover:text-black text-xs font-bold uppercase tracking-wide transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Back to Home</span>
                  </button>

                  <h1 className="mt-6 text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                    Free AI Trip Planner for India Holidays
                  </h1>
                  <p className="mt-2.5 max-w-3xl text-sm sm:text-base text-stone-600 leading-relaxed">
                    Describe the trip you want in plain language and the planner returns a day-by-day
                    itinerary with stays, travel time and an honest cost estimate. A Safar Trails
                    specialist reviews it before you book anything.
                  </p>
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

          {/* ROUTE: TRAVEL GUIDES HUB */}
          <Route
            path="/guides"
            element={
              <div className="pt-20">
                <Suspense fallback={<SectionSkeleton />}>
                  <TravelGuidesSection asPage onSelectGuide={handleSelectGuide} />
                </Suspense>
              </div>
            }
          />

          {/* ROUTE: SINGLE TRAVEL GUIDE ARTICLE */}
          <Route
            path="/guides/:slug"
            element={
              <Suspense fallback={<SectionSkeleton />}>
                <GuideArticleRoute
                  onStartAIPlan={(destName) => handleStartAIPlan(undefined, destName)}
                />
              </Suspense>
            }
          />

          {/* ROUTE: ABOUT US / WHY SAFARTRAILS */}
          <Route
            path="/about-us"
            element={
              <div className="pt-20">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                  <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                    About Safar Trails — Travel with Trust
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm sm:text-base text-stone-600 leading-relaxed">
                    Safar Trails is a New Delhi-based travel agency planning custom holidays across
                    India and abroad. "Travel with Trust" means written inclusions and exclusions,
                    stays we have actually verified, drivers we know by name, and a human reachable
                    on WhatsApp for the whole length of your trip.
                  </p>
                </div>
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

          {/* Unknown paths render a real, noindex 404 page rather than silently
              redirecting to Home, which Google reads as a soft 404. */}
          <Route path="*" element={<NotFoundPage />} />
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
