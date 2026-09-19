import React, { useState } from 'react';
import { Destination, Package } from '../../types';
import { packagesData } from '../../data/packagesData';
import { AIIcon } from '../AIIcon';
import { DestinationInteractiveMap } from './DestinationInteractiveMap';
import { FloatingShareButton } from '../FloatingShareButton';
import { ExpertVerifiedBadge } from '../ExpertVerifiedBadge';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Thermometer, 
  Plane, 
  Train, 
  Car, 
  Compass, 
  CheckCircle2, 
  HelpCircle, 
  Phone, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  ShieldCheck,
  Star,
  Flame
} from 'lucide-react';
import { GST_NOTE } from '../../lib/seo/siteConfig';

interface DestinationDetailViewProps {
  destination: Destination;
  onBack: () => void;
  onSelectPackage: (pkg: Package) => void;
  onStartAIPlan: (destinationName: string) => void;
  onOpenQuoteModal: (summary?: string, destinationName?: string) => void;
}

export const DestinationDetailView: React.FC<DestinationDetailViewProps> = ({
  destination,
  onBack,
  onSelectPackage,
  onStartAIPlan,
  onOpenQuoteModal
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'attractions' | 'packages' | 'travel-guide'>('overview');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  /**
   * Packages shown under "TOUR PACKAGES FOR <destination>".
   *
   * This used to be nine chained substring tests with hardcoded escapes for
   * andaman, northeast, chardham and uttarakhand - each one patching around the
   * same root cause, that package.destination is display copy ("Andaman",
   * "Chardham Yatra, Uttarakhand") and never matched a destination name. It also
   * matched on state, so both Chardham packages appeared under Uttarakhand and
   * an Auli retreat appeared under a heading reading "TOUR PACKAGES FOR CHARDHAM
   * YATRA".
   *
   * Every package now carries destinationSlug, so this is one comparison - and,
   * importantly, the same comparison the prerender uses, so what a crawler reads
   * and what a visitor sees no longer differ.
   */
  const destinationPackages = packagesData.filter((p) =>
    p.destinationSlug
      ? p.destinationSlug === destination.slug
      : p.destination.toLowerCase() === destination.name.toLowerCase(),
  );

  return (
    <div id="destination-detail-page" className="w-full pt-20 pb-24 bg-[#FAF9F6]">
      {/* Top Breadcrumbs & Back Bar */}
      <div className="w-full bg-white border-b border-gray-200 py-3.5">
        <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex flex-wrap items-center justify-between gap-y-2 gap-x-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:opacity-70 transition-opacity cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Destinations</span>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <FloatingShareButton
              title={`${destination.name} Travel Guide & Holiday Packages | SafarTrails`}
              text={`Explore tailored itineraries, attractions, and holiday packages for ${destination.name} (${destination.state}). Starting from ₹${destination.startingPrice.toLocaleString('en-IN')}/person.`}
              variant="pill"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
            />

            <nav aria-label="Breadcrumb" className="hidden sm:flex text-xs text-slate-500 items-center gap-1.5 font-medium">
              <span>Destinations</span>
              <span>/</span>
              <span>{destination.state}</span>
              <span>/</span>
              <span className="font-bold text-black">{destination.name}</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Hero Visual Section - Curved Bottom with Dark Vignette */}
      <section className="relative w-full bg-[#0F172A] text-white pt-6 pb-16 md:pb-24 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover opacity-40 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1329]/90 via-[#0F172A]/70 to-[#0F172A]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-6 pt-4">
          {/* Top Category Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#1E293B]/80 text-[#E6C687] border border-[#E6C687]/40 shadow-sm backdrop-blur-md">
              <Compass className="w-3.5 h-3.5 text-[#E6C687]" />
              <span>{destination.state} DESTINATION</span>
            </span>
            {destination.isTrending && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-ink text-white shadow-md">
                <Flame className="w-3.5 h-3.5 text-white fill-white shrink-0" />
                <span>Trending</span>
              </span>
            )}
            <ExpertVerifiedBadge variant="glass-dark" size="sm" showSubtitle={false} />
            {/* Was a star rating with a review count from placeholder data the
                business could not substantiate. A starting price is true, and
                it is what a traveller is actually trying to find out here. */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-white border border-white/20">
              <span className="text-[11px] font-medium text-gray-200 uppercase tracking-wide">From</span>
              <span className="text-white font-extrabold">
                ₹{destination.startingPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] font-medium text-gray-200">per person {GST_NOTE}</span>
            </span>
          </div>

          {/* Large Serif Title with Gold Accent */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight leading-tight">
            {destination.name.split(' ')[0]}{' '}
            <span className="text-[#E6A024]">
              {destination.name.split(' ').slice(1).join(' ') || destination.state}
            </span>
          </h1>

          {/* Description Paragraph */}
          <p className="text-gray-200 text-base sm:text-lg max-w-3xl leading-relaxed font-normal">
            {destination.shortDescription || destination.fullOverview.slice(0, 260) + '...'}
          </p>

          {/* Quick Stats Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-6 sm:gap-10 text-xs sm:text-sm text-gray-300 border-t border-white/10">
            <div className="flex items-center gap-2 pt-4">
              <Calendar className="w-4 h-4 text-[#E6C687]" />
              <span><strong>Best Season:</strong> {destination.bestTime}</span>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <Thermometer className="w-4 h-4 text-[#E6C687]" />
              <span><strong>Weather:</strong> {destination.temperatureRange}</span>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <MapPin className="w-4 h-4 text-[#E6C687]" />
              <span><strong>Ideal Trip:</strong> {destination.idealDays}</span>
            </div>
          </div>
        </div>

        {/* Curved Mask Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#FAF9F5] rounded-t-[50%] z-20" />
      </section>

      {/* Main Content Layout */}
      <div className="w-full max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-6 space-y-16">
        
        {/* HIGHLIGHTS SECTION (Matching Reference Image) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#B8860B]">
              HIGHLIGHTS
            </h2>
            <div className="h-[1px] w-24 bg-[#E6C687]/60" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {destination.highlights.map((hl, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-[#E6E0D4] flex items-start gap-4 shadow-xs hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[#FFFDF7] border border-[#E6C687] text-[#B8860B] flex items-center justify-center shrink-0 group-hover:bg-[#B8860B] group-hover:text-white transition-colors">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-1 pt-1">
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    {hl}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GALLERY SECTION (Matching Reference Image) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#B8860B]">
                GALLERY
              </h2>
              <div className="h-[1px] w-24 bg-[#E6C687]/60" />
            </div>

            <button
              onClick={() => setActiveTab('attractions')}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B8860B] hover:text-[#916705] transition-colors"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(destination.topAttractions.length > 0 ? destination.topAttractions : [
              { name: destination.name, image: destination.heroImage },
              { name: destination.name + ' Sights', image: destination.cardImage }
            ]).slice(0, 4).map((item, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-[#E6E0D4] shadow-xs group relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                  <span className="text-white text-xs font-medium truncate">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TOUR PACKAGES SECTION (Matching Reference Image) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#B8860B]">
              TOUR PACKAGES FOR {destination.name.toUpperCase()}
            </h2>
            <div className="h-[1px] w-32 bg-[#E6C687]/60" />
          </div>

          {destinationPackages.length > 0 ? (
            <div className="space-y-6">
              {destinationPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white border border-[#E6E0D4] rounded-3xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all relative overflow-hidden"
                >
                  {/* Left Package Image */}
                  <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden shrink-0 relative">
                    <img
                      src={pkg.heroImage}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                    {pkg.isPopular && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent-ink text-white shadow-md">
                        Popular Pick
                      </span>
                    )}
                  </div>

                  {/* Package Details */}
                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#FFF8E7] text-[#B8860B] border border-[#E6C687]/60">
                        MOST POPULAR
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#B8860B]" />
                        <span>{pkg.durationNights} Nights • {pkg.durationDays} Days</span>
                      </div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                      {pkg.title}
                    </h3>

                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                        ₹{pkg.startingPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-gray-500 font-normal">/ person {GST_NOTE}</span>
                    </div>

                    <button
                      onClick={() => onSelectPackage(pkg)}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#154238] hover:text-[#0b241e] transition-colors cursor-pointer pt-1"
                    >
                      <span>VIEW IN PACKAGES</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#E6E0D4] rounded-3xl p-8 text-center space-y-4">
              <h3 className="text-xl font-serif font-bold text-slate-900">
                Custom {destination.name} Package Available
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Starting from ₹{destination.startingPrice.toLocaleString('en-IN')}/person. Get a tailored itinerary crafted specifically for your dates & group size.
              </p>
              <button
                onClick={() => onOpenQuoteModal(`Custom Tour Request: ${destination.name}`, destination.name)}
                className="px-6 py-3 rounded-full bg-[#154238] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#0f322a] transition-colors cursor-pointer"
              >
                Request Custom Itinerary
              </button>
            </div>
          )}
        </section>

        {/* Interactive Map Section
            The "Current Travel & Weather Trends" widget used to sit beside this
            in a two-column grid. It was removed on the owner's instruction, so
            the map takes the full width rather than leaving half the row empty.
            Best season and temperature still appear in the facts row above. */}
        <section>
          <DestinationInteractiveMap
            destination={destination}
            packages={destinationPackages}
            onSelectPackage={onSelectPackage}
            onStartAIPlan={onStartAIPlan}
            onOpenQuoteModal={onOpenQuoteModal}
          />
        </section>

        {/* Overview & How to Reach */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6E0D4] shadow-xs">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              Overview & Experience
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {destination.fullOverview}
            </p>
          </div>

          <div className="space-y-4 bg-white rounded-3xl p-6 border border-[#E6E0D4] shadow-xs">
            <h3 className="text-lg font-serif font-bold text-slate-900">How to Reach {destination.name}</h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <Plane className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
                <div><strong>By Air:</strong> {destination.howToReach.air}</div>
              </div>
              <div className="flex items-start gap-2.5">
                <Train className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
                <div><strong>By Rail:</strong> {destination.howToReach.rail}</div>
              </div>
              <div className="flex items-start gap-2.5">
                <Car className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
                <div><strong>By Road:</strong> {destination.howToReach.road}</div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        {destination.faqs && destination.faqs.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {destination.faqs.map((faq, i) => (
                <div key={i} className="border border-[#E6E0D4] rounded-2xl overflow-hidden bg-white shadow-xs">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-4 text-left font-serif font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between hover:bg-[#FAF9F5] cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-4 h-4 text-slate-900 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="p-4 pt-2 text-xs sm:text-sm text-slate-600 border-t border-[#E6E0D4] font-normal leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* DUAL ACTION BUTTONS (Matching Reference Design at Bottom) */}
        <section className="pt-4 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <button
              onClick={() => onStartAIPlan(destination.name)}
              className="w-full py-4 px-6 rounded-full bg-[#154238] hover:bg-[#0e2f28] text-white font-bold text-base tracking-wide shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer text-center"
            >
              <AIIcon className="w-5 h-5 text-white shrink-0" />
              <span>Plan {destination.name} with AI</span>
            </button>

            <button
              onClick={() => onOpenQuoteModal(`Booking Request for ${destination.name}`, destination.name)}
              className="w-full py-4 px-6 rounded-full bg-[#D4820A] hover:bg-[#b87007] text-white font-bold text-base tracking-wide shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer text-center"
            >
              <span>Book Now</span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
        </section>

      </div>

      {/* Floating Share Button on Destination Detail View */}
      <FloatingShareButton
        title={`${destination.name} Travel Guide & Holiday Packages | SafarTrails`}
        text={`Discover bespoke itineraries and handpicked holiday packages for ${destination.name} (${destination.state}). Starting from ₹${destination.startingPrice.toLocaleString('en-IN')}/person.`}
        variant="floating"
        positionClassName="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8"
      />
    </div>
  );
};

export default DestinationDetailView;
