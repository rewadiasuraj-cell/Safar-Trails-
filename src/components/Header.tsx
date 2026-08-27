import React, { useState, useEffect, useRef } from 'react';
import { SafarLogo } from './SafarLogo';
import { WhatsAppIcon } from './WhatsAppIcon';
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown,
  BookOpen,
  ShieldCheck,
  Star,
  Phone,
  Compass
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenSearch: () => void;
  onOpenQuoteModal: (itinerarySummary?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  onOpenQuoteModal
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destinationsDropdown, setDestinationsDropdown] = useState(false);
  const [moreDropdown, setMoreDropdown] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        setDestinationsDropdown(false);
        setMoreDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const popularDestinations = [
    { name: 'Kashmir', slug: 'kashmir', tag: 'Paradise on Earth • Houseboats & Snow' },
    { name: 'Goa', slug: 'goa', tag: 'Beaches, Heritage & Latin Quarters' },
    { name: 'Kerala', slug: 'kerala', tag: 'Backwaters, Tea Hills & Ayurveda' },
    { name: 'Rajasthan', slug: 'rajasthan', tag: 'Royal Palaces & Thar Desert' },
    { name: 'Himachal Pradesh', slug: 'himachal-pradesh', tag: 'Alpine Valleys & Snow Peaks' },
    { name: 'Andaman & Nicobar', slug: 'andaman', tag: 'Emerald Isles & Coral Reefs' },
    { name: 'Northeast India', slug: 'northeast-india', tag: 'Living Root Bridges & Tea Gardens' },
    { name: 'Uttarakhand', slug: 'uttarakhand', tag: 'Ganga Ghats & Himalayan Treks' }
  ];

  const moreNavItems = [
    { label: 'Travel Guides', id: 'guides', desc: 'Expert tips, best seasons & itineraries', icon: BookOpen },
    { label: 'Why Us', id: 'why-us', desc: 'Verified partners, 0 hidden costs', icon: ShieldCheck },
    { label: 'Destinations Guide', id: 'destinations', desc: 'Explore all 28+ states & circuits', icon: Compass },
    { label: 'Guest Reviews', id: 'reviews', desc: '4.9★ rated by 12,000+ travellers', icon: Star },
  ];

  const handleWhatsAppClick = () => {
    const text = encodeURIComponent("Hi SafarTrails Expert! I am planning a holiday in India. Please assist me with customized packages and travel estimates.");
    window.open(`https://wa.me/918076665782?text=${text}`, '_blank');
  };

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_15px_-3px_rgba(0,0,0,0.06)] border-b border-gray-100 py-2 sm:py-2.5 md:py-3'
            : 'bg-white border-b border-gray-100 py-2.5 sm:py-3 md:py-3.5'
        }`}
      >
        <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
          {/* Brand Logo (Clean left alignment on Mobile, Tablet & Desktop) */}
          <div className="flex items-center flex-shrink-0">
            <div
              id="brand-logo-btn"
              onClick={() => onNavigate('home')}
              className="cursor-pointer flex items-center flex-shrink-0"
            >
              <SafarLogo size="responsive" />
            </div>
          </div>

          {/* Desktop & Tablet Navigation Links - Exactly Home / Destination / Tour Packages / Blogs / About Us / Contact Us */}
          <nav 
            ref={navContainerRef}
            className="hidden lg:flex items-center gap-4 xl:gap-7 text-[14px] xl:text-[14.5px] font-medium text-slate-800 whitespace-nowrap"
          >
            {/* 1. Home */}
            <button
              id="nav-link-home"
              onClick={() => {
                onNavigate('home');
                setDestinationsDropdown(false);
                setMoreDropdown(false);
              }}
              className={`py-1.5 transition-colors inline-flex items-center cursor-pointer select-none whitespace-nowrap ${
                currentView === 'home'
                  ? 'text-[#FF6B00] font-semibold'
                  : 'text-slate-800 hover:text-[#FF6B00]'
              }`}
            >
              <span className="whitespace-nowrap">Home</span>
            </button>

            {/* 2. Destination with Dropdown */}
            <div className="relative group">
              <button
                id="nav-link-destinations"
                onClick={() => {
                  setDestinationsDropdown(!destinationsDropdown);
                  setMoreDropdown(false);
                }}
                onMouseEnter={() => {
                  setDestinationsDropdown(true);
                  setMoreDropdown(false);
                }}
                className={`py-1.5 transition-colors inline-flex items-center gap-1 cursor-pointer select-none whitespace-nowrap ${
                  currentView === 'destinations' || currentView === 'destination-detail'
                    ? 'text-[#FF6B00] font-semibold'
                    : 'text-slate-800 hover:text-[#FF6B00]'
                }`}
              >
                <span className="whitespace-nowrap">Destination</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#FF6B00] group-hover:rotate-180 transition-transform duration-200 flex-shrink-0" />
              </button>

              {/* Destinations Mega Dropdown */}
              {destinationsDropdown && (
                <div
                  onMouseLeave={() => setDestinationsDropdown(false)}
                  className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 grid grid-cols-1 gap-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 mb-1">
                    Popular Domestic Destinations
                  </div>
                  {popularDestinations.map((dest) => (
                    <button
                      key={dest.slug}
                      onClick={() => {
                        onNavigate('destination-detail', dest.slug);
                        setDestinationsDropdown(false);
                      }}
                      className="text-left px-3 py-2 rounded-xl hover:bg-[#FAF9F6] transition-colors flex flex-col group/item cursor-pointer"
                    >
                      <span className="text-sm font-semibold text-slate-900 group-hover/item:text-[#FF6B00] transition-colors whitespace-nowrap">
                        {dest.name}
                      </span>
                      <span className="text-[11px] text-gray-500 truncate">
                        {dest.tag}
                      </span>
                    </button>
                  ))}
                  <div className="pt-2 border-t border-gray-100 mt-1">
                    <button
                      onClick={() => {
                        onNavigate('destinations');
                        setDestinationsDropdown(false);
                      }}
                      className="w-full text-center py-1.5 text-xs font-bold text-slate-900 hover:text-[#FF6B00] uppercase tracking-wider cursor-pointer whitespace-nowrap"
                    >
                      View All Destinations →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Tour Packages */}
            <button
              id="nav-link-packages"
              onClick={() => {
                onNavigate('packages');
                setDestinationsDropdown(false);
                setMoreDropdown(false);
              }}
              className={`py-1.5 transition-colors inline-flex items-center cursor-pointer select-none whitespace-nowrap ${
                currentView === 'packages'
                  ? 'text-[#FF6B00] font-semibold'
                  : 'text-slate-800 hover:text-[#FF6B00]'
              }`}
            >
              <span className="whitespace-nowrap">Tour Packages</span>
            </button>

            {/* 4. Blogs */}
            <button
              id="nav-link-blogs"
              onClick={() => {
                onNavigate('guides');
                setDestinationsDropdown(false);
                setMoreDropdown(false);
              }}
              className={`py-1.5 transition-colors inline-flex items-center cursor-pointer select-none whitespace-nowrap ${
                currentView === 'guides' || currentView === 'guide-detail'
                  ? 'text-[#FF6B00] font-semibold'
                  : 'text-slate-800 hover:text-[#FF6B00]'
              }`}
            >
              <span className="whitespace-nowrap">Blogs</span>
            </button>

            {/* 5. About Us */}
            <button
              id="nav-link-about-us"
              onClick={() => {
                onNavigate('why-us');
                setDestinationsDropdown(false);
                setMoreDropdown(false);
              }}
              className={`py-1.5 transition-colors inline-flex items-center cursor-pointer select-none whitespace-nowrap ${
                currentView === 'why-us'
                  ? 'text-[#FF6B00] font-semibold'
                  : 'text-slate-800 hover:text-[#FF6B00]'
              }`}
            >
              <span className="whitespace-nowrap">About Us</span>
            </button>

            {/* 6. Contact Us */}
            <button
              id="nav-link-contact-us"
              onClick={() => {
                onNavigate('contact-us');
                setDestinationsDropdown(false);
                setMoreDropdown(false);
              }}
              className={`py-1.5 transition-colors inline-flex items-center cursor-pointer select-none whitespace-nowrap ${
                currentView === 'contact-us'
                  ? 'text-[#FF6B00] font-semibold'
                  : 'text-slate-800 hover:text-[#FF6B00]'
              }`}
            >
              <span className="whitespace-nowrap">Contact Us</span>
            </button>
          </nav>

          {/* Right Action CTAs (Desktop & Mobile view matching reference image) */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
            {/* Search Button */}
            <button
              id="global-search-btn"
              onClick={onOpenSearch}
              className="w-7 h-7 sm:w-8.5 sm:h-8.5 md:w-9.5 md:h-9.5 rounded-full flex items-center justify-center text-slate-800 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer flex-shrink-0"
              title="Search destinations & packages (Cmd+K)"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 stroke-[2]" />
            </button>

            {/* WhatsApp Circular Button with Original Logo */}
            <button
              id="header-whatsapp-btn"
              onClick={handleWhatsAppClick}
              className="w-7 h-7 sm:w-8.5 sm:h-8.5 md:w-9.5 md:h-9.5 rounded-full border border-gray-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/50 flex items-center justify-center transition-all shadow-2xs cursor-pointer flex-shrink-0"
              title="Chat with an Expert on WhatsApp"
              aria-label="WhatsApp Expert Help"
            >
              <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5" />
            </button>

            {/* Plan My Trip CTA Button */}
            <button
              id="header-plan-trip-cta"
              onClick={() => onOpenQuoteModal()}
              className="inline-flex items-center justify-center bg-[#FF6B00] hover:bg-[#E55F00] text-white text-[11px] sm:text-xs md:text-sm font-bold px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full transition-all duration-200 active:scale-95 shadow-xs cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <span>Plan My Trip</span>
            </button>

            {/* Mobile & Tablet Hamburger Menu Toggle Button (Placed after Plan My Trip on the Right) */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-800 hover:bg-gray-100 hover:text-black border border-gray-200/80 focus:outline-none cursor-pointer flex items-center justify-center flex-shrink-0 transition-colors"
              aria-label="Toggle navigation menu"
              title="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.2] text-slate-900" />
              ) : (
                <Menu className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.2] text-slate-900" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <SafarLogo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 space-y-1 text-sm font-medium text-slate-800">
                <button
                  onClick={() => {
                    onNavigate('home');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-colors ${
                    currentView === 'home' ? 'bg-orange-50 text-[#FF6B00]' : 'hover:bg-gray-50'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    onNavigate('destinations');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-colors ${
                    currentView === 'destinations' ? 'bg-orange-50 text-[#FF6B00]' : 'hover:bg-gray-50'
                  }`}
                >
                  Destination
                </button>
                <button
                  onClick={() => {
                    onNavigate('packages');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-colors ${
                    currentView === 'packages' ? 'bg-orange-50 text-[#FF6B00]' : 'hover:bg-gray-50'
                  }`}
                >
                  Tour Packages
                </button>
                <button
                  onClick={() => {
                    onNavigate('guides');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-colors ${
                    currentView === 'guides' || currentView === 'guide-detail' ? 'bg-orange-50 text-[#FF6B00]' : 'hover:bg-gray-50'
                  }`}
                >
                  Blogs
                </button>
                <button
                  onClick={() => {
                    onNavigate('why-us');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-colors ${
                    currentView === 'why-us' ? 'bg-orange-50 text-[#FF6B00]' : 'hover:bg-gray-50'
                  }`}
                >
                  About Us
                </button>
                <button
                  onClick={() => {
                    onNavigate('contact-us');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-colors ${
                    currentView === 'contact-us' ? 'bg-orange-50 text-[#FF6B00]' : 'hover:bg-gray-50'
                  }`}
                >
                  Contact Us
                </button>
              </div>

              {/* Quick Destination Tags */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Trending Destinations
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Kashmir', 'Goa', 'Kerala', 'Rajasthan', 'Himachal', 'Andaman'].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        onNavigate('destination-detail', d.toLowerCase().replace(/\s+/g, '-'));
                        setMobileMenuOpen(false);
                      }}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 hover:bg-[#FF6B00] hover:text-white transition-colors cursor-pointer"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Footer CTAs */}
            <div className="pt-6 border-t border-gray-100 space-y-3">
              <button
                onClick={() => {
                  onOpenQuoteModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-full bg-[#FF6B00] text-white font-bold text-sm shadow-xs text-center flex items-center justify-center cursor-pointer"
              >
                <span>Plan My Trip</span>
              </button>
              <button
                onClick={handleWhatsAppClick}
                className="w-full py-3 rounded-full border border-gray-200 text-gray-800 font-semibold text-sm hover:bg-gray-50 text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span>Expert Help on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
