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
  ArrowRight,
  MapPin,
  Compass,
  ShieldCheck,
  Car,
  Hotel,
  Utensils,
  Sparkles,
  Clock,
  Layers
} from 'lucide-react';
import { openWhatsApp } from '../../lib/contact';
import { packageGallery } from '../../lib/packageMedia';
import { PackageGallery } from './PackageGallery';

interface PackageDetailPageProps {
  onStartAIPlan: (promptText?: string, destinationName?: string) => void;
  onOpenQuoteModal: (summary?: string, destinationName?: string) => void;
}

/**
 * Organic torn paper edge divider for the adventure/expedition theme
 */
const TornPaperDivider: React.FC<{ flip?: boolean; className?: string; color?: string }> = ({
  flip = false,
  className = '',
  color = 'text-[#FBF9F5]'
}) => (
  <div className={`w-full overflow-hidden leading-none pointer-events-none ${className} ${flip ? 'rotate-180' : ''}`}>
    <svg
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      className={`w-full h-4 sm:h-6 ${color} fill-current block`}
    >
      <path d="M0,0 L0,12 Q25,20 50,11 Q75,4 100,16 Q130,24 160,9 Q190,2 220,15 Q255,23 285,8 Q315,1 345,18 Q380,24 410,10 Q440,3 470,16 Q505,23 535,9 Q565,2 595,19 Q630,24 660,11 Q690,3 720,16 Q755,23 785,9 Q815,2 845,17 Q880,24 910,11 Q940,3 970,16 Q1005,23 1035,8 Q1065,1 1095,18 Q1130,24 1160,9 Q1185,3 1200,14 L1200,24 L0,24 Z" />
    </svg>
  </div>
);

export const PackageDetailPage: React.FC<PackageDetailPageProps> = ({
  onStartAIPlan,
  onOpenQuoteModal
}) => {
  const navigate = useNavigate();
  const { slug = '', pkgSlug = '' } = useParams<{ slug?: string; pkgSlug?: string }>();
  const targetSlug = pkgSlug || slug;
  const packageData = packagesData.find((p) => p.slug === targetSlug || p.id === targetSlug);

  const [activeTab, setActiveTab] = useState<'itinerary' | 'inclusions' | 'stays'>('itinerary');
  const [selectedHotelTier, setSelectedHotelTier] = useState<string>(packageData?.hotelCategory || 'Standard 3★');
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
    const summary = `*SafarTrails Expedition: ${packageData.title}*\n` +
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
    <div className="w-full min-h-screen bg-[#FBF9F5] text-stone-900 flex flex-col selection:bg-warm-orange/20 selection:text-stone-900">
      {/* Cinematic Adventure Hero */}
      <section className="relative w-full h-[380px] sm:h-[460px] lg:h-[500px] flex flex-col justify-between overflow-hidden bg-stone-950">
        {/* Background Image */}
        <img
          src={packageData.heroImage}
          alt={packageData.title}
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Artistic Atmospheric Gradients & Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-warm-orange/20 via-transparent to-transparent pointer-events-none" />

        {/* Top Floating Navigation & Badges */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tours</span>
          </button>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {packageData.badge && (
              <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-warm-orange text-cta-ink shadow-[0_4px_16px_rgba(255,133,52,0.8)] border border-warm-orange/50">
                {packageData.badge}
              </span>
            )}
            <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black/60 backdrop-blur-md text-white border border-white/20">
              <Compass className="w-3 h-3 inline mr-1 text-luxury-gold" />
              {packageData.durationDays}D / {packageData.durationNights}N
            </span>
            <span className="hidden sm:inline-flex px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md text-white border border-white/20">
              <MapPin className="w-3 h-3 inline mr-1 text-warm-orange" />
              {packageData.destination}
            </span>
          </div>
        </div>

        {/* Hero Title & Script Accent */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold tracking-widest uppercase text-luxury-gold mb-3">
            <Sparkles className="w-3 h-3 text-warm-orange" />
            <span>Safar Trails Signature Route</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-white tracking-tight leading-none drop-shadow-md mb-3">
            {packageData.title}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-stone-200/90 font-normal max-w-3xl leading-relaxed line-clamp-3 drop-shadow">
            {packageData.overview}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-stone-300">
            <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10">
              <Car className="w-3.5 h-3.5 text-warm-orange" />
              <span>Dedicated Chauffeur</span>
            </span>
            <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10">
              <Hotel className="w-3.5 h-3.5 text-luxury-gold" />
              <span>Handpicked Stays</span>
            </span>
            <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Verified Circuit</span>
            </span>
          </div>
        </div>

        {/* Torn Edge Transition to Body */}
        <TornPaperDivider className="relative z-10" />
      </section>

      {/* Interactive Expedition Ledger / Configurator Bar */}
      <section className="relative z-20 -mt-2 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] border border-stone-200/80 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Hotel Tier Selector */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-stone-400">
              <Hotel className="w-3.5 h-3.5 text-deep-emerald" />
              <span>Hotel Category</span>
            </label>
            <select
              value={selectedHotelTier}
              onChange={(e) => setSelectedHotelTier(e.target.value)}
              className="w-full p-3 rounded-2xl border border-stone-200 bg-[#FBF9F5] font-bold text-xs sm:text-sm text-stone-900 focus:border-deep-emerald focus:bg-white focus:outline-none transition-colors cursor-pointer shadow-xs"
            >
              {packageData.hotelCategory === 'Budget / 3★' && (
                <option value="Budget / 3★">Budget / 3★ Stays</option>
              )}
              <option value="Standard 3★">Standard 3★ Hotels</option>
              <option value="Deluxe 4★">Deluxe 4★ Boutique Resorts</option>
              <option value="Luxury 5★">Luxury 5★ / Royal Heritage</option>
            </select>
          </div>

          {/* Transport Selector */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-stone-400">
              <Car className="w-3.5 h-3.5 text-deep-emerald" />
              <span>Dedicated Transport</span>
            </label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full p-3 rounded-2xl border border-stone-200 bg-[#FBF9F5] font-bold text-xs sm:text-sm text-stone-900 focus:border-deep-emerald focus:bg-white focus:outline-none transition-colors cursor-pointer shadow-xs"
            >
              <option value="Private Sedan (Dzire/Etios)">Private AC Sedan (Dzire / Etios)</option>
              <option value="Private SUV (Innova/Crysta)">Private Innova Crysta (+₹1,800/pkg)</option>
              <option value="Tempo Traveller">Tempo Traveller (For Groups / Families)</option>
            </select>
          </div>

          {/* Price Calculation Card */}
          <div className="md:col-span-4 bg-gradient-to-br from-[#062B4A] to-[#0B4A78] rounded-2xl p-4 text-white shadow-md flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold block">
                Estimated Price
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-white">
                  ₹{estimatedPerPersonPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-stone-300 font-normal">/ person</span>
              </div>
              <span className="text-[9px] text-stone-300/80 block">{GST_NOTE}</span>
            </div>

            <div className="text-right border-l border-white/15 pl-4">
              <span className="text-[10px] text-luxury-gold font-bold uppercase tracking-wider block">
                Total ({travellersCount} Guests)
              </span>
              <span className="text-sm sm:text-base font-black text-warm-orange">
                ₹{estimatedTotalPrice.toLocaleString('en-IN')}
              </span>
              <button
                onClick={() => onOpenQuoteModal(formattedQuoteSummary, packageData.destination)}
                className="mt-1 text-[10px] font-bold text-white underline hover:text-luxury-gold transition-colors block"
              >
                Lock This Rate →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Gallery Strip */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 mt-8">
        <PackageGallery shots={gallery} destination={packageData.destination} />
      </div>

      {/* Expedition Navigation Tabs */}
      <div className="sticky top-16 sm:top-20 z-30 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-200 mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-center sm:justify-start gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'itinerary'
                ? 'bg-midnight-blue text-white shadow-md'
                : 'bg-white/80 text-stone-600 hover:bg-white hover:text-midnight-blue border border-stone-200/80'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-warm-orange" />
            <span>Trail Itinerary ({packageData.itinerary.length} {packageData.itinerary.length === 1 ? 'Day' : 'Days'})</span>
          </button>

          <button
            onClick={() => setActiveTab('inclusions')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'inclusions'
                ? 'bg-midnight-blue text-white shadow-md'
                : 'bg-white/80 text-stone-600 hover:bg-white hover:text-midnight-blue border border-stone-200/80'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Inclusions & Gear</span>
          </button>

          <button
            onClick={() => setActiveTab('stays')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'stays'
                ? 'bg-midnight-blue text-white shadow-md'
                : 'bg-white/80 text-stone-600 hover:bg-white hover:text-midnight-blue border border-stone-200/80'
            }`}
          >
            <Hotel className="w-3.5 h-3.5 text-luxury-gold" />
            <span>Stays & Fleet</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content Canvas */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 flex-1">
        
        {/* TAB 1: THE SIGNATURE EXPEDITION TRAIL */}
        {activeTab === 'itinerary' && (
          <div className="relative">
            
            {/* Trail Intro Header */}
            <div className="text-center mb-12">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-deep-emerald bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/60 inline-flex items-center gap-1.5 mb-2">
                <Compass className="w-3 h-3" />
                <span>Expedition Route Map</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-black text-stone-900 tracking-tight">
                Day-by-Day Expedition Trail
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto mt-1.5">
                Follow the winding trail crafted for relaxed pacing, scenic stops, and unforgettable moments.
              </p>
            </div>

            {/* Continuous Vertical Map Trail Guide */}
            <div className="relative">
              {/* Central Winding Trail Line (Desktop: Center, Mobile: Left) */}
              <div className="absolute top-8 bottom-8 left-6 sm:left-1/2 -translate-x-1/2 w-0.5 border-l-2 border-dashed border-stone-300 z-0 pointer-events-none" />

              <div className="space-y-10 sm:space-y-14 relative z-10">
                {packageData.itinerary.map((day, idx) => {
                  const isExpanded = expandedDay === day.dayNumber;
                  const isEven = idx % 2 === 0;

                  return (
                    <div
                      key={day.dayNumber}
                      className={`relative flex flex-col sm:flex-row items-center gap-6 sm:gap-10 ${
                        isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
                      }`}
                    >
                      {/* Waypoint Marker on the Trail */}
                      <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 top-4 w-9 h-9 rounded-full bg-white border-2 border-deep-emerald shadow-md flex items-center justify-center font-black text-xs text-midnight-blue z-20">
                        <span className="w-2.5 h-2.5 rounded-full bg-warm-orange animate-pulse" />
                      </div>

                      {/* Content Card */}
                      <div
                        className={`w-full sm:w-[calc(50%-2rem)] pl-14 sm:pl-0 ${
                          isEven ? 'sm:text-right' : 'sm:text-left'
                        }`}
                      >
                        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_12px_35px_-10px_rgba(0,0,0,0.06)] border border-stone-200/90 relative overflow-hidden transition-all duration-300 hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.1)] group text-left">
                          
                          {/* Large Number Watermark */}
                          <span className="absolute -bottom-4 right-4 text-7xl sm:text-8xl font-serif font-black text-stone-100 select-none pointer-events-none transition-colors group-hover:text-stone-150">
                            {String(day.dayNumber).padStart(2, '0')}
                          </span>

                          {/* Card Header & Location */}
                          <div className="flex items-center justify-between gap-3 mb-2 relative z-10">
                            <span className="px-3 py-1 rounded-full bg-[#062B4A] text-white text-[10px] font-black tracking-wider uppercase">
                              Day {day.dayNumber}
                            </span>
                            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-warm-orange shrink-0" />
                              <span>{day.location}</span>
                            </span>
                          </div>

                          {/* Day Title */}
                          <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-snug mb-2 relative z-10">
                            {day.title}
                          </h3>

                          {/* Day Image (if present) */}
                          {day.image && (
                            <div className="my-3 rounded-2xl overflow-hidden shadow-xs relative z-10">
                              <img
                                src={day.image}
                                alt={`${day.title} — ${day.location}`}
                                loading="lazy"
                                className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}

                          {/* Story Description */}
                          <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed mb-4 relative z-10">
                            {day.description}
                          </p>

                          {/* Activity Logs (Morning / Afternoon / Evening) */}
                          {(day.morningActivity || day.afternoonActivity || day.eveningActivity) && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#FBF9F5] p-3 rounded-2xl text-[11px] mb-4 border border-stone-200/60 relative z-10">
                              {day.morningActivity && (
                                <div>
                                  <span className="font-extrabold text-stone-900 block flex items-center gap-1">
                                    🌅 Morning
                                  </span>
                                  <span className="text-stone-600 line-clamp-2">{day.morningActivity}</span>
                                </div>
                              )}
                              {day.afternoonActivity && (
                                <div>
                                  <span className="font-extrabold text-stone-900 block flex items-center gap-1">
                                    ☀️ Afternoon
                                  </span>
                                  <span className="text-stone-600 line-clamp-2">{day.afternoonActivity}</span>
                                </div>
                              )}
                              {day.eveningActivity && (
                                <div>
                                  <span className="font-extrabold text-stone-900 block flex items-center gap-1">
                                    🌙 Evening
                                  </span>
                                  <span className="text-stone-600 line-clamp-2">{day.eveningActivity}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Stay & Meal Ledger Badges */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-100 text-[11px] text-stone-500 relative z-10">
                            <span className="flex items-center gap-1 font-medium">
                              <Hotel className="w-3.5 h-3.5 text-deep-emerald" />
                              <span>{day.stay}</span>
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <Utensils className="w-3.5 h-3.5 text-warm-orange" />
                              <span>{day.mealsIncluded}</span>
                            </span>
                          </div>

                        </div>
                      </div>

                      {/* Spacer for opposite side on desktop */}
                      <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: INCLUSIONS & GEAR */}
        {activeTab === 'inclusions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Inclusions Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-200/80 shadow-[0_12px_35px_-10px_rgba(0,0,0,0.05)] relative overflow-hidden">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-stone-900">What's Covered in Package</h3>
                  <span className="text-xs text-stone-500">Zero hidden surcharges</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
                {packageData.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      ✓
                    </span>
                    <span className="leading-relaxed">{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-200/80 shadow-[0_12px_35px_-10px_rgba(0,0,0,0.05)] relative overflow-hidden">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-stone-900">Out-of-Pocket / Exclusions</h3>
                  <span className="text-xs text-stone-500">Personal & optional choices</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
                {packageData.exclusions.map((exc, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      ✕
                    </span>
                    <span className="leading-relaxed">{exc}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}

        {/* TAB 3: STAYS & VEHICLE FLEET */}
        {activeTab === 'stays' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F2F8FC] text-deep-emerald flex items-center justify-center shrink-0">
                <Hotel className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">
                  Handpicked Stays & Heritage Havelis
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal mb-3">
                  We partner directly with verified boutique properties rated 4.5+ on cleanliness and hospitality. Central heating / electric blankets provided in high altitude mountain stays.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified 4.5★ Guest Rating Standard</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F2F8FC] text-deep-emerald flex items-center justify-center shrink-0">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">
                  Dedicated Chauffeur & Sanitized Fleet
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal mb-3">
                  Private commercial tourist cab with an experienced mountain driver. Includes all fuel, interstate road taxes, toll charges, parking fees, driver night allowances, and state permits.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>All Toll, Fuel & Chauffeur Allowances Included</span>
                </div>
              </div>
            </div>

            <div className="bg-[#062B4A] text-white p-6 sm:p-8 rounded-3xl shadow-md flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-luxury-gold block mb-1">
                  Active Expedition Configuration
                </span>
                <h4 className="text-base sm:text-lg font-serif font-bold">
                  {selectedHotelTier} stay with {selectedVehicle}
                </h4>
                <p className="text-xs text-stone-300 mt-0.5">Calculated for {travellersCount} travellers on twin-sharing basis.</p>
              </div>

              <button
                onClick={() => onOpenQuoteModal(formattedQuoteSummary, packageData.destination)}
                className="px-6 py-2.5 rounded-full bg-warm-orange text-cta-ink font-bold text-xs uppercase tracking-wider hover:brightness-105 transition-all shadow-md cursor-pointer"
              >
                Book This Configuration
              </button>
            </div>
          </div>
        )}

      </main>

      {/* FAQs Section */}
      {packageData.faqs && packageData.faqs.length > 0 && (
        <section
          aria-labelledby="package-faqs-heading"
          className="border-t border-stone-200/80 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-white"
        >
          <div className="mx-auto w-full max-w-4xl">
            <div className="text-center mb-8">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-deep-emerald bg-emerald-50 px-3 py-1 rounded-full inline-block mb-1.5">
                Need to Know
              </span>
              <h2
                id="package-faqs-heading"
                className="font-serif text-2xl sm:text-3xl font-black text-stone-900 tracking-tight"
              >
                Frequently Asked Questions
              </h2>
            </div>

            <div className="divide-y divide-stone-200 border-y border-stone-200">
              {packageData.faqs.map((faq) => (
                <details key={faq.question} className="group py-4">
                  <summary className="flex cursor-pointer items-start justify-between gap-3 list-none text-sm sm:text-base font-serif font-bold text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-emerald">
                    <span>{faq.question}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className="mt-1 h-4 w-4 shrink-0 text-stone-400 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-2 pr-7 text-xs sm:text-sm leading-relaxed text-stone-600 font-normal">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-stone-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => onStartAIPlan(`Customize ${packageData.title}`, packageData.destination)}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer text-center shadow-xs"
          >
            <AIIcon className="w-3.5 h-3.5 text-deep-emerald shrink-0" />
            <span className="whitespace-nowrap">Customize with AI</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors inline-flex items-center justify-center cursor-pointer shrink-0 border border-emerald-200/60"
            title="Chat on WhatsApp"
          >
            <WhatsAppIcon className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => onOpenQuoteModal(formattedQuoteSummary, packageData.destination)}
          className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-warm-orange hover:brightness-105 text-cta-ink font-black text-xs uppercase tracking-widest shadow-[0_8px_26px_-8px_rgba(255,133,52,0.85)] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Get Exact Final Quote</span>
          <ArrowRight className="w-4 h-4 text-cta-ink" />
        </button>
      </div>
    </div>
  );
};
