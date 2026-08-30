import React, { useState, useEffect } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
  useLocation,
} from 'react-router';
import type { Route } from './+types/root';
import { Header } from '../src/components/Header';
import { MobileBottomNav } from '../src/components/MobileBottomNav';
import { StickyContactWidget } from '../src/components/StickyContactWidget';
import { Footer } from '../src/components/Footer';
import { GlobalSearchModal } from '../src/components/GlobalSearchModal';
import { QuoteRequestModal } from '../src/components/QuoteRequestModal';
import { PolicyModals } from '../src/components/PolicyModals';
import { initGA, trackPageView } from '../src/lib/analytics';
import { Package, TravelGuide } from '../src/types';

import stylesheet from '../src/index.css?url';

export const links: Route.LinksFunction = () => [
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  { rel: 'alternate icon', type: 'image/svg+xml', href: '/favicon.svg' },
  { rel: 'apple-touch-icon', href: '/favicon.svg' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  { rel: 'preconnect', href: 'https://images.unsplash.com' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,600&display=swap' },
  { rel: 'stylesheet', href: stylesheet },
];

export const meta: Route.MetaFunction = () => [
  { charSet: 'utf-8' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0' },
  { title: 'SafarTrails — AI-Powered India Holiday Packages & Custom Itineraries' },
  { name: 'description', content: 'AI plans. Experts perfect. Discover bespoke holiday packages across Kashmir, Goa, Kerala, Rajasthan, Himachal, Uttarakhand & beyond with SafarTrails.' },
  { name: 'keywords', content: 'India holiday packages, AI trip planner India, custom travel itineraries, Kashmir tour packages, Kerala houseboat tour, Rajasthan tour packages, Himachal holiday packages, Goa honeymoon package, luxury travel agency India, SafarTrails' },
  { name: 'author', content: 'SafarTrails' },
  { name: 'robots', content: 'index, follow' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'SafarTrails' },
  { property: 'og:url', content: 'https://safartrails.co.in/' },
  { property: 'og:title', content: 'SafarTrails — AI-Powered India Travel Packages & Custom Itineraries' },
  { property: 'og:description', content: 'AI-powered custom holiday planning handcrafted by verified destination experts. Discover India with Trust.' },
  { property: 'og:image', content: 'https://safartrails.co.in/og-image.jpg' },
  { property: 'og:image:width', content: '1200' },
  { property: 'og:image:height', content: '630' },
  { property: 'og:image:type', content: 'image/jpeg' },
  { property: 'og:image:alt', content: 'SafarTrails — AI-Powered India Travel Packages & Custom Itineraries' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:site', content: '@SafarTrails' },
  { name: 'twitter:title', content: 'SafarTrails — AI-Powered India Travel Packages & Custom Itineraries' },
  { name: 'twitter:description', content: 'AI plans. Experts perfect. Discover bespoke holiday packages across Kashmir, Goa, Kerala, Rajasthan & beyond with SafarTrails.' },
  { name: 'twitter:image', content: 'https://safartrails.co.in/og-image.jpg' },
  { name: 'twitter:image:alt', content: 'SafarTrails — AI-Powered India Travel Packages & Custom Itineraries' },
  { name: 'theme-color', content: '#1B2456' },
];

const VIEW_TO_PATH: Record<string, string> = {
  home: '/',
  destinations: '/destinations',
  packages: '/packages',
  'ai-planner': '/ai-planner',
  guides: '/guides',
  'why-us': '/about-us',
  'contact-us': '/contact-us',
};

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

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className="scroll-smooth">
      <head>
        <Meta />
        <Links />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'TravelAgency',
                  '@id': 'https://safartrails.co.in/#organization',
                  name: 'SafarTrails',
                  url: 'https://safartrails.co.in',
                  logo: 'https://safartrails.co.in/logo.svg',
                  image: 'https://safartrails.co.in/og-image.jpg',
                  slogan: 'AI Plans. Experts Perfect. Travel With Trust.',
                  description: 'Indian domestic travel agency and AI holiday package platform curating personalized vacations for couples, families, and solo travelers.',
                  telephone: '+91-8076665782',
                  email: 'info.safartrails@gmail.com',
                  areaServed: 'India',
                  priceRange: '₹₹ - ₹₹₹₹',
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://safartrails.co.in/#website',
                  url: 'https://safartrails.co.in',
                  name: 'SafarTrails Holiday Packages & AI Trip Planner',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://safartrails.co.in/?search={search_term_string}',
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="bg-[#FBFBFA] text-[#1E293B] antialiased selection:bg-[#FF6B00]/20 selection:text-[#0B2545]">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function AppRoot() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentView = pathToView(location.pathname);

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteModalInitialSummary, setQuoteModalInitialSummary] = useState<string>('');
  const [quoteModalInitialDestination, setQuoteModalInitialDestination] = useState<string>('');
  const [activePolicyType, setActivePolicyType] = useState<'privacy' | 'terms' | 'cancellation' | null>(null);

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    const params = new URLSearchParams();
    if (promptText) params.set('prompt', promptText);
    if (destinationName) params.set('dest', destinationName);
    navigate(`/ai-planner?${params.toString()}`);
  };

  const handleOpenQuoteModal = (summary?: string, destinationName?: string) => {
    console.log("=== handleOpenQuoteModal CALLED ===", { summary, destinationName });
    setQuoteModalInitialSummary(summary || '');
    setQuoteModalInitialDestination(destinationName || '');
    setQuoteModalOpen(true);
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
    <div className="min-h-screen w-full flex flex-col bg-white text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      <main className="w-full flex-grow">
        <Outlet context={{ handleOpenQuoteModal, handleStartAIPlan, setSearchModalOpen }} />
      </main>

      <Footer
        onNavigate={handleNavigate}
        onOpenPolicyModal={(policyType) => setActivePolicyType(policyType)}
      />

      <MobileBottomNav
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      <StickyContactWidget
        onOpenQuoteModal={handleOpenQuoteModal}
      />

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
    </div>
  );
}
