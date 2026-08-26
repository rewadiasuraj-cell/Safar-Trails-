import React, { useState } from 'react';
import { Destination, Package } from '../../types';
import { packagesData } from '../../data/packagesData';
import { AIIcon } from '../AIIcon';
import { DestinationInteractiveMap } from './DestinationInteractiveMap';
import { SeasonalWeatherWidget } from './SeasonalWeatherWidget';
import { FloatingShareButton } from '../FloatingShareButton';
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
  CloudSun,
  Star
} from 'lucide-react';

interface DestinationDetailViewProps {
  destination: Destination;
  onBack: () => void;
  onSelectPackage: (pkg: Package) => void;
  onStartAIPlan: (destinationName: string) => void;
  onOpenQuoteModal: (summary?: string) => void;
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

  // Filter packages for this destination
  const destinationPackages = packagesData.filter(
    (p) => p.destination.toLowerCase() === destination.name.toLowerCase() ||
      p.state.toLowerCase().includes(destination.state.toLowerCase())
  );

  return (
    <div id="destination-detail-page" className="w-full pt-20 pb-24 bg-[#FAF9F6]">
      {/* Top Breadcrumbs & Back Bar */}
      <div className="w-full bg-white border-b border-gray-200 py-3.5">
        <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:opacity-70 transition-opacity cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Destinations</span>
          </button>

          <div className="flex items-center gap-3">
            <FloatingShareButton
              title={`${destination.name} Travel Guide & Holiday Packages | SafarTrails`}
              text={`Explore tailored itineraries, attractions, and holiday packages for ${destination.name} (${destination.state}). Starting from ₹${destination.startingPrice.toLocaleString('en-IN')}/person.`}
              variant="pill"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
            />

            <div className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
              <span>Destinations</span>
              <span>/</span>
              <span>{destination.state}</span>
              <span>/</span>
              <span className="font-bold text-black">{destination.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Visual Section */}
      <section className="relative w-full h-[420px] sm:h-[500px] overflow-hidden">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute bottom-8 left-0 right-0 w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 text-white space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black text-white border border-white/20">
              {destination.state}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md text-white">
              Ideal: {destination.idealDays}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-gray-900 border border-white/90 shadow-md">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span className="text-black font-extrabold">{destination.rating ? destination.rating.toFixed(1) : '4.9'} / 5.0</span>
              {destination.reviewCount && (
                <span className="text-[11px] font-medium text-gray-600">({destination.reviewCount.toLocaleString()} reviews)</span>
              )}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
            {destination.name}
          </h1>

          <p className="text-sm sm:text-lg text-gray-200 max-w-3xl leading-relaxed font-normal">
            {destination.tagline}
          </p>

          {/* Quick Stats Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-8 text-xs text-gray-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-white" />
              <span><strong>Best Season:</strong> {destination.bestTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-white" />
              <span>{destination.temperatureRange}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Floating CTA / AI Prompt Bar */}
      <div className="w-full bg-[#0A0A0A] text-white py-4 border-y border-gray-800">
        <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-normal">
            <AIIcon className="w-4 h-4 text-white" />
            <span>Customize a bespoke {destination.name} itinerary in 10 seconds.</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onStartAIPlan(destination.name)}
              className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-black text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-sm text-center"
            >
              <AIIcon className="w-3.5 h-3.5 text-black shrink-0" />
              <span className="whitespace-nowrap">Plan {destination.name} with AI</span>
            </button>
            <button
              onClick={() => onOpenQuoteModal(`Enquiry for ${destination.name} Holiday`)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
            >
              Request Quote
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left 2 Cols: Main Editorial Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-black tracking-tight">
                Overview & Experience
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-normal">
                {destination.fullOverview}
              </p>

              {/* Highlights Checklist */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-3 mt-4 shadow-xs">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Signature SafarTrails Experiences
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {destination.highlights.map((hl, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 font-normal">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Seasonal Weather Summary & Best Time to Visit Widget */}
            <SeasonalWeatherWidget
              destination={destination}
              onStartAIPlan={onStartAIPlan}
              onOpenQuoteModal={onOpenQuoteModal}
            />

            {/* Interactive Mock Map with Major Attractions & Package Pins */}
            <DestinationInteractiveMap
              destination={destination}
              packages={destinationPackages}
              onSelectPackage={onSelectPackage}
              onStartAIPlan={onStartAIPlan}
              onOpenQuoteModal={onOpenQuoteModal}
            />

            {/* Top Attractions Grid */}
            <section className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-black tracking-tight">
                Top Places & Sights in {destination.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {destination.topAttractions.map((att, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:border-black transition-all"
                  >
                    <div className="h-44 overflow-hidden">
                      <img src={att.image} alt={att.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 space-y-1">
                      <h4 className="font-serif font-bold text-base text-black">{att.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-normal">{att.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* How to Reach Guide */}
            <section className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-black tracking-tight">
                How to Reach {destination.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black">
                    <Plane className="w-4 h-4 text-black" />
                    <span>By Air</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-normal">{destination.howToReach.air}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black">
                    <Train className="w-4 h-4 text-black" />
                    <span>By Rail</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-normal">{destination.howToReach.rail}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black">
                    <Car className="w-4 h-4 text-black" />
                    <span>By Road</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-normal">{destination.howToReach.road}</p>
                </div>
              </div>
            </section>

            {/* Stay Categories & Recommendations */}
            <section className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-black tracking-tight">
                Where to Stay: Verified Tiers
              </h2>
              <div className="space-y-3">
                {destination.stayCategories.map((stay, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white shadow-xs">
                    <div>
                      <div className="text-sm font-bold text-black">{stay.category}</div>
                      <div className="text-xs text-gray-500 font-normal">{stay.recommendation}</div>
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-black whitespace-nowrap bg-gray-100 px-3 py-1.5 rounded-xl">
                      {stay.priceRange}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Curated Packages for this Destination */}
            {destinationPackages.length > 0 && (
              <section className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-serif font-bold text-black tracking-tight">
                    Popular {destination.name} Packages
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destinationPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:border-black transition-all flex flex-col justify-between"
                    >
                      <div className="relative h-44">
                        <img src={pkg.heroImage} alt={pkg.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/80 text-white backdrop-blur-xs">
                          {pkg.durationDays}D / {pkg.durationNights}N
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="font-serif font-bold text-base text-black line-clamp-1">{pkg.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2 font-normal">{pkg.overview}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Starting from</span>
                            <span className="text-xs font-extrabold text-black">
                              ₹{pkg.startingPrice.toLocaleString('en-IN')}/person
                            </span>
                          </div>
                          <button
                            onClick={() => onSelectPackage(pkg)}
                            className="px-3 py-1.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            View Itinerary
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQs */}
            {destination.faqs && destination.faqs.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-bold text-black tracking-tight">
                  Frequently Asked Questions about {destination.name}
                </h2>
                <div className="space-y-2.5">
                  {destination.faqs.map((faq, i) => (
                    <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full p-4 text-left font-serif font-bold text-sm sm:text-base text-black flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        {openFaq === i ? (
                          <ChevronUp className="w-4 h-4 text-black flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {openFaq === i && (
                        <div className="p-4 pt-2 text-xs sm:text-sm text-gray-600 border-t border-gray-100 font-normal">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Col: Sticky Booking / Expert Box */}
          <div className="space-y-6">
            <div className="sticky top-28 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  Indicative Package Starting Cost
                </span>
                <div className="text-3xl font-serif font-bold text-black mt-1">
                  ₹{destination.startingPrice.toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-gray-400 ml-1">/ person</span>
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  ✓ Includes Stay, Private Cab & Daily Meals
                </div>

                {/* Best Season Quick Pill */}
                <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium flex items-center gap-1.5">
                    <CloudSun className="w-3.5 h-3.5 text-orange-500" />
                    <span>Best Time:</span>
                  </span>
                  <span className="font-bold text-slate-900 text-[11px] text-right truncate max-w-[170px]" title={destination.bestTime}>
                    {destination.bestTime.split('|')[0].trim()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => onStartAIPlan(destination.name)}
                  className="w-full py-3.5 px-4 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  <AIIcon className="w-4 h-4 text-white shrink-0" />
                  <span className="whitespace-nowrap">Generate {destination.name} Plan</span>
                </button>

                <button
                  onClick={() => onOpenQuoteModal(`Interested in visiting ${destination.name}`)}
                  className="w-full py-3.5 rounded-xl border border-gray-200 hover:border-black text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Request Custom Quote</span>
                </button>

                <a
                  href={`https://wa.me/918076665782?text=${encodeURIComponent(`Hi SafarTrails! I want to plan a trip to ${destination.name}. Can a specialist assist me?`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Trust signals */}
              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500 font-normal">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified 4.5+ Star Hotels & Chauffeurs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>100% Tailored to your dates & family</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-black" />
                  <span>24/7 On-Trip WhatsApp Concierge</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
