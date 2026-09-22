import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { packagesData } from '../../data/packagesData';
import { GST_NOTE } from '../../lib/seo/siteConfig';
import { WhatsAppIcon } from '../WhatsAppIcon';
import { AIIcon } from '../AIIcon';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from 'lucide-react';
import { openWhatsApp } from '../../lib/contact';
import { packageGallery } from '../../lib/packageMedia';
import { PackageGallery } from './PackageGallery';

interface PackageDetailPageProps {
  onStartAIPlan: (promptText?: string, destinationName?: string) => void;
  onOpenQuoteModal: (summary?: string, destinationName?: string) => void;
}

export const PackageDetailPage: React.FC<PackageDetailPageProps> = ({
  onStartAIPlan,
  onOpenQuoteModal
}) => {
  const navigate = useNavigate();
  const { slug = '', pkgSlug = '' } = useParams<{ slug?: string; pkgSlug?: string }>();
  const targetSlug = pkgSlug || slug;
  const packageData = packagesData.find((p) => p.slug === targetSlug || p.id === targetSlug);

  const [activeTab, setActiveTab] = useState<'itinerary' | 'inclusions' | 'stays'>('itinerary');
  const [selectedHotelTier, setSelectedHotelTier] = useState<string>(packageData?.hotelCategory || 'Deluxe 4★');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('Private Sedan (Dzire/Etios)');
  const [travellersCount] = useState<number>(2);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  if (!packageData) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-serif font-bold text-stone-900 mb-3">Package not found</h1>
        <p className="text-sm text-stone-500 mb-6">
          No tour package with slug "{slug}" exists.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-midnight-blue text-white text-xs font-bold uppercase tracking-wide cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>
    );
  }

  // Dynamic calculated price based on selections
  let tierMultiplier = 1.0;
  if (selectedHotelTier.includes('Luxury') || selectedHotelTier.includes('5★')) {
    tierMultiplier = 1.65;
  } else if (selectedHotelTier.includes('Deluxe') || selectedHotelTier.includes('4★')) {
    tierMultiplier = 1.25;
  }

  let vehicleSurcharge = 0;
  if (selectedVehicle.includes('Innova') || selectedVehicle.includes('SUV')) {
    vehicleSurcharge = 1800;
  }

  const estimatedPerPersonPrice = Math.round(
    packageData.startingPrice * tierMultiplier + (vehicleSurcharge / travellersCount)
  );
  const estimatedTotalPrice = estimatedPerPersonPrice * travellersCount;

  const toggleDay = (dayNum: number) => {
    setExpandedDay(expandedDay === dayNum ? null : dayNum);
  };

  const handleWhatsApp = () => {
    const summary = `*SafarTrails Package: ${packageData.title}*\n` +
      `📍 Destination: ${packageData.destination} (${packageData.durationDays}D/${packageData.durationNights}N)\n` +
      `🏨 Selected Stay: ${selectedHotelTier}\n` +
      `🚗 Transport: ${selectedVehicle}\n` +
      `👥 Travellers: ${travellersCount}\n` +
      `💰 Est. Price: ₹${estimatedPerPersonPrice.toLocaleString('en-IN')}/person (Total: ₹${estimatedTotalPrice.toLocaleString('en-IN')})\n\n` +
      `Please provide the final quote and verified hotel options for this itinerary!`;

    openWhatsApp(summary, 'package_detail', packageData.destination);
  };

  const formattedQuoteSummary = `${packageData.title} (${packageData.durationDays}D/${packageData.durationNights}N) - ${selectedHotelTier} stay & ${selectedVehicle} for ${travellersCount} guests`;

  const handleBack = () => {
    navigate('/');
  };

  const gallery = packageGallery(packageData);

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 flex-shrink-0">
        <img
          src={packageData.heroImage}
          alt={packageData.title}
          className="w-full h-full object-cover"
        />
        {/* Was `from-black via-black/60 to-black/30`, which is solid black exactly
            where the photograph's subject sits - the hero image may as well not
            have been there. .photo-text-scrim keeps the title's contrast at the
            bottom while letting the picture through above it. */}
        <div className="absolute inset-0 photo-text-scrim pointer-events-none" />

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-20 left-4 sm:top-24 sm:left-6 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-stone-900 text-xs font-bold uppercase tracking-wide shadow-md cursor-pointer z-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        {/* Top Badges */}
        {/* max-w + wrap because these two chips are wider than the gap left by the
            Back button at 390px: unconstrained, the row ran back across the button
            and covered it, so Back could not be read or tapped on a phone. */}
        <div className="absolute top-20 right-4 sm:top-24 sm:right-6 max-w-[55%] sm:max-w-none flex flex-wrap justify-end items-center gap-2 z-10">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white shadow-xs border border-white/20">
            {packageData.durationDays} Days / {packageData.durationNights} Nights
          </span>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white">
            {packageData.destination}
          </span>
        </div>

        {/* Bottom Banner Content */}
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
          <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight leading-tight">
            {packageData.title}
          </h1>
          <p className="text-xs sm:text-sm text-white mt-1 line-clamp-2 font-normal max-w-2xl">
            {packageData.overview}
          </p>
        </div>
      </div>

      {/* Dynamic Configurator Bar */}
      <div className="bg-[#F2F8FC] border-b border-stone-200 p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs flex-shrink-0">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Hotel Category</label>
          <select
            value={selectedHotelTier}
            onChange={(e) => setSelectedHotelTier(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-bold text-stone-900 focus:border-deep-emerald focus:outline-none"
          >
            <option value="Standard 3★">Standard 3★ Hotels</option>
            <option value="Deluxe 4★">Deluxe 4★ Resorts</option>
            <option value="Luxury 5★">Luxury 5★ / Heritage</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Dedicated Transport</label>
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-bold text-stone-900 focus:border-deep-emerald focus:outline-none"
          >
            <option value="Private Sedan (Dzire/Etios)">Private AC Sedan</option>
            <option value="Private SUV (Innova/Crysta)">Private Innova Crysta (+₹1,800/pkg)</option>
            <option value="Tempo Traveller">Tempo Traveller (For Groups)</option>
          </select>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block">Est. Starting Cost</span>
            <span className="text-base font-extrabold text-stone-900">
              ₹{estimatedPerPersonPrice.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-stone-500">/ person {GST_NOTE}</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-stone-400 block uppercase tracking-wider">Total ({travellersCount} Guests)</span>
            {/* One figure, because it is now the payable one. This used to print
                the pre-tax total and a second "with GST" line underneath. */}
            <span className="text-xs font-bold text-stone-900">₹{estimatedTotalPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Photographs, above the tabs.
          The page used to be a hero image and then three tabs of text, and that
          is what buyers were reacting to. It renders nothing when a package has
          fewer than three distinct photographs, which is still true of six of
          them - padding that out with the same picture twice would be worse
          than the gap. */}
      <PackageGallery shots={gallery} destination={packageData.destination} />

      {/* Tabs */}
      <div className="flex border-b border-stone-200 px-4 sm:px-6 bg-white flex-shrink-0 sticky top-16 sm:top-20 z-10 overflow-x-auto">
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'itinerary'
              ? 'border-deep-emerald text-midnight-blue'
              : 'border-transparent text-stone-500 hover:text-midnight-blue'
          }`}
        >
          Day-by-Day Itinerary ({packageData.itinerary.length} Days)
        </button>
        <button
          onClick={() => setActiveTab('inclusions')}
          className={`py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'inclusions'
              ? 'border-deep-emerald text-midnight-blue'
              : 'border-transparent text-stone-500 hover:text-midnight-blue'
          }`}
        >
          Inclusions & Exclusions
        </button>
        <button
          onClick={() => setActiveTab('stays')}
          className={`py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'stays'
              ? 'border-deep-emerald text-midnight-blue'
              : 'border-transparent text-stone-500 hover:text-midnight-blue'
          }`}
        >
          Stay & Vehicle Details
        </button>
      </div>

      {/* Tab Body - full page height/scroll, no fixed-height container */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 flex-1">
        {activeTab === 'itinerary' && (
          <div className="space-y-3">
            {packageData.itinerary.map((day) => {
              const isExpanded = expandedDay === day.dayNumber;
              return (
                <div
                  key={day.dayNumber}
                  className="border border-stone-200 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleDay(day.dayNumber)}
                    className="w-full p-4 text-left flex items-center justify-between bg-[#F2F8FC] hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-deep-emerald text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {day.dayNumber}
                      </span>
                      <div>
                        <h3 className="text-sm font-serif font-bold text-stone-900">{day.title}</h3>
                        <span className="text-xs text-stone-500 font-normal">{day.location}</span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />}
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-2 text-xs sm:text-sm text-stone-700 bg-white border-t border-stone-100 space-y-3">
                      {/* Two packages carry a photograph per day and neither
                          ever showed it. Lazy, because only one day is open at
                          a time and the rest are below the fold. */}
                      {day.image && (
                        <img
                          src={day.image}
                          alt={`${day.title} — ${day.location}`}
                          loading="lazy"
                          className="w-full h-44 sm:h-56 object-cover rounded-xl"
                        />
                      )}
                      <p className="leading-relaxed text-stone-600 font-normal">{day.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-stone-50 p-3 rounded-xl text-xs">
                        <div>
                          <span className="font-bold text-stone-900 block">🌅 Morning:</span>
                          <span className="text-stone-600">{day.morningActivity}</span>
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 block">☀️ Afternoon:</span>
                          <span className="text-stone-600">{day.afternoonActivity}</span>
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 block">🌙 Evening:</span>
                          <span className="text-stone-600">{day.eveningActivity}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-stone-500 pt-2 border-t border-stone-100">
                        <span>🏨 Stay: <strong className="text-stone-900">{day.stay}</strong></span>
                        <span>🍽️ Meals: <strong className="text-stone-900">{day.mealsIncluded}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'inclusions' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-200">
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>What's Included</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                {packageData.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50/30 p-5 rounded-2xl border border-red-200">
              <h3 className="text-xs font-bold uppercase tracking-widest text-red-900 mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span>What's Excluded</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                {packageData.exclusions.map((exc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'stays' && (
          <div className="space-y-4 text-xs sm:text-sm text-stone-700">
            <div className="p-4 rounded-2xl bg-[#F2F8FC] border border-stone-200">
              <h3 className="font-serif font-bold text-stone-900 mb-1">Handpicked Stays & Houseboats</h3>
              <p className="text-stone-600 leading-relaxed font-normal">
                We partner directly with boutique properties rated 4.5+ on cleanliness and hospitality. Central heating / electric blankets provided in high altitude mountain stays.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F2F8FC] border border-stone-200">
              <h3 className="font-serif font-bold text-stone-900 mb-1">Dedicated Chauffeur & Sanitized Fleet</h3>
              <p className="text-stone-600 leading-relaxed font-normal">
                Private commercial tourist cab with experienced mountain driver. Includes all fuel, toll taxes, parking fees, driver night allowances, and state permits.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F2F8FC] border border-stone-200">
              <h3 className="font-serif font-bold text-stone-900 mb-1">Selected Configuration</h3>
              <div className="flex items-center gap-2 text-stone-600">
                <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{selectedHotelTier} stay with {selectedVehicle} for {travellersCount} travellers.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Common questions.
          Rendered here as well as in the prerendered HTML on purpose. React
          replaces everything inside #root on mount, so anything the prerender
          writes but no component renders would be text only a crawler ever sees -
          which is cloaking. Both must agree.

          <details> rather than a JS accordion: it is open-able without
          JavaScript, keyboard-operable for free, and Chrome's find-in-page
          searches inside collapsed ones. */}
      {packageData.faqs && packageData.faqs.length > 0 && (
        <section
          aria-labelledby="package-faqs-heading"
          className="border-t border-stone-200 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-[#F2F8FC]"
        >
          <div className="mx-auto w-full max-w-3xl">
            <h2
              id="package-faqs-heading"
              className="font-serif text-xl sm:text-2xl font-bold text-stone-900 tracking-tight"
            >
              Common questions
            </h2>
            <div className="mt-4 divide-y divide-stone-200 border-y border-stone-200">
              {packageData.faqs.map((faq) => (
                <details key={faq.question} className="group py-3">
                  <summary className="flex cursor-pointer items-start justify-between gap-3 list-none text-sm font-bold text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-emerald">
                    <span>{faq.question}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-stone-500 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-2 pr-7 text-sm leading-relaxed text-stone-700 font-normal">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky Bottom CTA Bar (offset above the mobile bottom nav bar, which is hidden at lg+) */}
      <div className="sticky bottom-[58px] lg:bottom-0 bg-white border-t border-stone-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => onStartAIPlan(`Customize ${packageData.title}`, packageData.destination)}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer text-center"
          >
            <AIIcon className="w-3.5 h-3.5 text-deep-emerald shrink-0" />
            <span className="whitespace-nowrap">Customize in AI Studio</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors inline-flex items-center justify-center cursor-pointer shrink-0"
            title="Chat on WhatsApp"
          >
            <WhatsAppIcon className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => onOpenQuoteModal(formattedQuoteSummary, packageData.destination)}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-warm-orange hover:brightness-105 text-cta-ink font-black text-xs uppercase tracking-wider shadow-[0_8px_26px_-8px_rgba(255,133,52,0.85)] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Get Exact Final Quote</span>
          <ArrowRight className="w-3.5 h-3.5 text-cta-ink" />
        </button>
      </div>
    </div>
  );
};
