import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SafarLogo } from './SafarLogo';
import { WhatsAppIcon } from './WhatsAppIcon';
import { AIIcon } from './AIIcon';
import { enquiryMessage, openWhatsApp } from '../lib/contact';
import { trackPhoneCallClick } from '../lib/analytics';
import { PRIMARY_PHONE, PRIMARY_PHONE_DISPLAY } from '../lib/seo/siteConfig';
import { Search, X, ChevronDown } from 'lucide-react';

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
  const [contactDropdown, setContactDropdown] = useState(false);
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
        setContactDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Six, not eight, and the same six the footer shows. A dropdown that lists
     eight of the twelve destinations is not a shortlist, it is a second
     /destinations page - and the two extras it used to carry (Northeast India,
     Uttarakhand) are still one click away behind "View all destinations". */
  const popularDestinations = [
    { name: 'Kashmir', slug: 'kashmir' },
    { name: 'Goa', slug: 'goa' },
    { name: 'Kerala', slug: 'kerala' },
    { name: 'Rajasthan', slug: 'rajasthan' },
    { name: 'Himachal Pradesh', slug: 'himachal-pradesh' },
    { name: 'Andaman & Nicobar', slug: 'andaman' }
  ];

  const handleWhatsAppClick = () => openWhatsApp(enquiryMessage(), 'header');

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-200 bg-ivory/95 backdrop-blur-md border-b border-[#D9E6F0] ${
          isScrolled
            ? 'shadow-[0_2px_15px_-3px_rgba(0,0,0,0.08)] py-2 sm:py-2.5 md:py-3'
            : 'py-2.5 sm:py-3 md:py-3.5'
        }`}
      >
        <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex items-center justify-between gap-1.5 sm:gap-3 md:gap-4">
          {/* Brand Logo (Clean left alignment on Mobile, Tablet & Desktop) */}
          <div className="flex items-center flex-shrink-0">
            <button
              id="brand-logo-btn"
              type="button"
              onClick={() => onNavigate('home')}
              aria-label="Safar Trails — go to homepage"
              className="cursor-pointer flex items-center flex-shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink"
            >
              <SafarLogo variant="light" size="responsive" />
            </button>
          </div>

          {/* Four links, not seven.
           *
           * What came out, and where it went instead of disappearing:
           *   Home       -> the logo to the left of this nav already goes home.
           *   Blogs      -> "Travel guides" at the foot of the Destination
           *                 dropdown, and the footer's Explore column.
           *   About Us   -> inside the Contact Us dropdown, which is the whole
           *                 reason that link is still a top-level item: a
           *                 stranger deciding whether to wire money to a travel
           *                 agency wants "who are you" and "how do I reach you"
           *                 in the same place, so they are one menu.
           *
           * Every one of those URLs is still in SITE_NAV_LINKS in
           * src/lib/seo/routes.ts, so the prerendered HTML keeps linking to
           * them - and each still has a real React link a visitor can click,
           * which is the rule: nothing may exist for the crawler alone. */}
          <nav
            ref={navContainerRef}
            className="hidden lg:flex items-center gap-4 xl:gap-7 text-[14px] xl:text-[14.5px] font-medium text-stone-800 whitespace-nowrap"
          >
            {/* 1. Destination with Dropdown */}
            <div className="relative group">
              <button
                id="nav-link-destinations"
                onClick={() => {
                  setDestinationsDropdown(!destinationsDropdown);
                  setContactDropdown(false);
                }}
                onMouseEnter={() => {
                  setDestinationsDropdown(true);
                  setContactDropdown(false);
                }}
                className={`py-1.5 transition-colors inline-flex items-center gap-1 cursor-pointer select-none whitespace-nowrap ${
                  currentView === 'destinations' || currentView === 'destination-detail'
                    ? 'text-accent-ink font-bold underline decoration-2 underline-offset-8 decoration-accent-ink'
                    : 'text-stone-800 hover:text-accent-ink'
                }`}
              >
                <span className="whitespace-nowrap">Destination</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-accent-ink group-hover:rotate-180 transition-transform duration-200 flex-shrink-0" />
              </button>

              {/* Destinations Mega Dropdown */}
              <AnimatePresence>
                {destinationsDropdown && (
                  <motion.div
                    onMouseLeave={() => setDestinationsDropdown(false)}
                    initial={{ opacity: 0, scale: 0.96, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -8 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    style={{ transformOrigin: 'top left' }}
                    className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-100 p-4 grid grid-cols-1 gap-1 z-50"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 border-b border-stone-100 mb-1">
                      Popular Domestic Destinations
                    </div>
                    {popularDestinations.map((dest) => (
                      <button
                        key={dest.slug}
                        onClick={() => {
                          onNavigate('destination-detail', dest.slug);
                          setDestinationsDropdown(false);
                        }}
                        className="text-left px-3 py-2 rounded-xl hover:bg-[#F2F8FC] transition-colors flex group/item cursor-pointer"
                      >
                        <span className="text-sm font-semibold text-stone-900 group-hover/item:text-luxury-gold transition-colors whitespace-nowrap">
                          {dest.name}
                        </span>
                      </button>
                    ))}
                    <div className="pt-2 border-t border-stone-100 mt-1 grid grid-cols-2 gap-1">
                      <button
                        id="nav-link-all-destinations"
                        onClick={() => {
                          onNavigate('destinations');
                          setDestinationsDropdown(false);
                        }}
                        className="w-full text-center py-1.5 text-xs font-bold text-stone-900 hover:text-luxury-gold uppercase tracking-wider cursor-pointer whitespace-nowrap"
                      >
                        All destinations →
                      </button>
                      {/* Where "Blogs" went. The guides are destination reading,
                          so this is where someone is already looking for them. */}
                      <button
                        id="nav-link-blogs"
                        onClick={() => {
                          onNavigate('guides');
                          setDestinationsDropdown(false);
                        }}
                        className="w-full text-center py-1.5 text-xs font-bold text-stone-900 hover:text-luxury-gold uppercase tracking-wider cursor-pointer whitespace-nowrap"
                      >
                        Travel guides →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Tour Packages */}
            <button
              id="nav-link-packages"
              onClick={() => {
                onNavigate('packages');
                setDestinationsDropdown(false);
                setContactDropdown(false);
              }}
              className={`py-1.5 transition-colors inline-flex items-center cursor-pointer select-none whitespace-nowrap ${
                currentView === 'packages'
                  ? 'text-accent-ink font-bold underline decoration-2 underline-offset-8 decoration-accent-ink'
                  : 'text-stone-800 hover:text-accent-ink'
              }`}
            >
              <span className="whitespace-nowrap">Tour Packages</span>
            </button>

            {/* 3. Plan with AI */}
            <button
              id="nav-link-ai-planner"
              onClick={() => {
                onNavigate('ai-planner');
                setDestinationsDropdown(false);
                setContactDropdown(false);
              }}
              className={`py-1.5 transition-colors inline-flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap ${
                currentView === 'ai-planner'
                  ? 'text-accent-ink font-bold underline decoration-2 underline-offset-8 decoration-accent-ink'
                  : 'text-stone-800 hover:text-accent-ink'
              }`}
            >
              <AIIcon className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Plan with AI</span>
            </button>

            {/* 4. Contact Us, carrying About Us with it.
                Right-aligned because this is the last item before the button
                cluster - a left-aligned panel would run off the viewport. */}
            <div className="relative group">
              <button
                id="nav-link-contact-us"
                onClick={() => {
                  setContactDropdown(!contactDropdown);
                  setDestinationsDropdown(false);
                }}
                onMouseEnter={() => {
                  setContactDropdown(true);
                  setDestinationsDropdown(false);
                }}
                aria-expanded={contactDropdown}
                className={`py-1.5 transition-colors inline-flex items-center gap-1 cursor-pointer select-none whitespace-nowrap ${
                  currentView === 'contact-us' || currentView === 'why-us'
                    ? 'text-accent-ink font-bold underline decoration-2 underline-offset-8 decoration-accent-ink'
                    : 'text-stone-800 hover:text-accent-ink'
                }`}
              >
                <span className="whitespace-nowrap">Contact Us</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-accent-ink group-hover:rotate-180 transition-transform duration-200 flex-shrink-0" />
              </button>

              <AnimatePresence>
                {contactDropdown && (
                  <motion.div
                    onMouseLeave={() => setContactDropdown(false)}
                    initial={{ opacity: 0, scale: 0.96, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -8 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    style={{ transformOrigin: 'top right' }}
                    className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-100 p-4 grid grid-cols-1 gap-1 z-50"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 border-b border-stone-100 mb-1">
                      Safar Trails
                    </div>
                    {[
                      {
                        id: 'contact-me',
                        label: 'Contact Us',
                        view: 'contact-us',
                        desc: 'Call, WhatsApp or send us your dates',
                      },
                      {
                        id: 'contact-about',
                        label: 'About Us',
                        view: 'why-us',
                        desc: 'Who we are and why people book with us',
                      },
                    ].map((item) => (
                      <button
                        key={item.view}
                        id={`nav-contact-${item.view}`}
                        onClick={() => {
                          onNavigate(item.view);
                          setContactDropdown(false);
                        }}
                        className="text-left px-3 py-2 rounded-xl hover:bg-[#F2F8FC] transition-colors cursor-pointer group/item"
                      >
                        <span className="block text-sm font-semibold text-stone-900 group-hover/item:text-luxury-gold transition-colors">
                          {item.label}
                        </span>
                        <span className="block text-xs text-stone-600 mt-0.5">
                          {item.desc}
                        </span>
                      </button>
                    ))}
                    <div className="pt-2 border-t border-stone-100 mt-1">
                      <a
                        href={`tel:${PRIMARY_PHONE}`}
                        onClick={() => {
                          trackPhoneCallClick('header_contact_menu');
                          setContactDropdown(false);
                        }}
                        className="block px-3 py-1.5 text-xs font-bold text-stone-900 hover:text-luxury-gold tracking-wider cursor-pointer whitespace-nowrap"
                      >
                        {PRIMARY_PHONE_DISPLAY}
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Action CTAs (Desktop & Mobile view matching reference image) */}
          <div className="flex items-center gap-0.5 min-[360px]:gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
            {/* Search Button */}
            <button
              id="global-search-btn"
              onClick={onOpenSearch}
              className="w-7 h-7 sm:w-8.5 sm:h-8.5 md:w-9.5 md:h-9.5 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-900 hover:bg-stone-200/70 transition-colors cursor-pointer flex-shrink-0"
              title="Search destinations & packages (Cmd+K)"
              aria-label="Search destinations and packages"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 stroke-[2]" aria-hidden="true" />
            </button>

            {/* WhatsApp Circular Button with Original Logo */}
            <button
              id="header-whatsapp-btn"
              onClick={handleWhatsAppClick}
              className="w-7 h-7 sm:w-8.5 sm:h-8.5 md:w-9.5 md:h-9.5 rounded-full border border-[#D9E6F0] hover:border-forest-green bg-white hover:bg-white flex items-center justify-center transition-all shadow-2xs cursor-pointer flex-shrink-0"
              title="Chat with an expert on WhatsApp"
              aria-label="Chat with a Safar Trails travel specialist on WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5" aria-hidden="true" />
            </button>

            {/* Plan My Trip CTA Button */}
            <button
              id="header-plan-trip-cta"
              onClick={() => onOpenQuoteModal()}
              className="inline-flex items-center justify-center bg-warm-orange hover:brightness-95 text-cta-ink text-[10px] sm:text-xs md:text-sm font-bold px-2.5 sm:px-4 md:px-5 py-2 sm:py-2 md:py-2.5 rounded-full transition-all duration-200 active:scale-95 shadow-xs cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <span>Plan My Trip</span>
            </button>

            {/* Mobile & Tablet Hamburger Menu Toggle Button (Placed after Plan My Trip on the Right) */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-stone-800 hover:bg-stone-200/70 hover:text-stone-900 border border-[#D9E6F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink cursor-pointer flex items-center justify-center flex-shrink-0 transition-colors"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              title="Menu"
            >
              <span className="relative w-4.5 h-4.5 sm:w-5 sm:h-5">
                <motion.span
                  className="absolute left-0 w-full h-[2.2px] bg-stone-800 rounded-full"
                  style={{ top: 'calc(50% - 1.1px)' }}
                  animate={mobileMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                />
                <motion.span
                  className="absolute left-0 w-full h-[2.2px] bg-stone-800 rounded-full"
                  style={{ top: 'calc(50% - 1.1px)' }}
                  animate={mobileMenuOpen ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15 }}
                />
                <motion.span
                  className="absolute left-0 w-full h-[2.2px] bg-stone-800 rounded-full"
                  style={{ top: 'calc(50% - 1.1px)' }}
                  animate={mobileMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <SafarLogo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full text-stone-500 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* This drawer only carries what the bottom bar does not.
               *
               * MobileBottomNav is fixed to the bottom of every viewport this
               * drawer can open in - both are lg:hidden - and it already holds
               * Home, Explore (destinations), AI Plan, Trips (packages) and
               * WhatsApp. The drawer used to repeat all of those and then add
               * six destination chips on top, so the hamburger opened onto
               * fifteen controls, nine of them a second copy of the bar the
               * user could already see.
               *
               * The chips went with them. One of the six was broken anyway -
               * "Himachal" built the slug `himachal`, and the destination is
               * `himachal-pradesh`, so that chip led to a not-found page. */}
              <div className="mt-6">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 px-4">
                  More
                </div>
                <div className="space-y-1 text-sm font-medium text-stone-800">
                  {[
                    { label: 'Travel Guides', view: 'guides', active: currentView === 'guides' || currentView === 'guide-detail' },
                    { label: 'About Us', view: 'why-us', active: currentView === 'why-us' },
                    { label: 'Contact Us', view: 'contact-us', active: currentView === 'contact-us' },
                  ].map((item) => (
                    <button
                      key={item.view}
                      onClick={() => {
                        onNavigate(item.view);
                        setMobileMenuOpen(false);
                      }}
                      aria-current={item.active ? 'page' : undefined}
                      className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold transition-colors ${
                        item.active ? 'bg-[#E4EFF7] text-[#075985]' : 'hover:bg-stone-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Footer CTAs */}
            <div className="pt-6 border-t border-stone-100 space-y-3">
              <button
                onClick={() => {
                  onOpenQuoteModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-full bg-warm-orange text-cta-ink font-bold text-sm shadow-xs text-center flex items-center justify-center cursor-pointer"
              >
                <span>Plan My Trip</span>
              </button>
              <button
                onClick={handleWhatsAppClick}
                className="w-full py-3 rounded-full border border-stone-200 text-stone-800 font-semibold text-sm hover:bg-stone-50 text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span>Expert Help on WhatsApp</span>
              </button>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
