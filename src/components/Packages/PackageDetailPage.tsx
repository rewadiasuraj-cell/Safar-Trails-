import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Users,
  Share2,
  Check,
  Star,
  Info,
  PhoneCall,
  Sun,
  Sunrise,
  Moon,
  Lightbulb,
  ExternalLink,
  ChevronRight
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

  const [activeTab, setActiveTab] = useState<'itinerary' | 'stays' | 'inclusions' | 'faqs'>('itinerary');
  const [selectedHotelTier, setSelectedHotelTier] = useState<string>(packageData?.hotelCategory || 'Standard 3★');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('Private AC Sedan (Dzire / Etios)');
  const [travellersCount, setTravellersCount] = useState<number>(2);
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true });
  const [copiedLink, setCopiedLink] = useState(false);

  if (!packageData) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center bg-stone-50 px-4 py-24 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-stone-200">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-2xl">
            404
          </div>
          <h1 className="text-2xl font-serif font-black text-stone-900 mb-2">Package Not Found</h1>
          <p className="text-xs sm:text-sm text-stone-600 mb-6">
            The tour package you are looking for "{targetSlug}" is not available or has moved.
          </p>
          <button
            onClick={() => navigate('/packages')}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-midnight-blue hover:bg-royal-navy text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore All Tour Packages</span>
          </button>
        </div>
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
  } else if (selectedVehicle.includes('Tempo')) {
    vehicleSurcharge = 4500;
  }

  const estimatedPerPersonPrice = Math.round(
    packageData.startingPrice * tierMultiplier + (vehicleSurcharge / Math.max(1, travellersCount))
  );
  const estimatedTotalPrice = estimatedPerPersonPrice * travellersCount;

  const toggleDay = (dayNum: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum]
    }));
  };

  const toggleAllDays = (expand: boolean) => {
    const next: Record<number, boolean> = {};
    packageData.itinerary.forEach((d) => {
      next[d.dayNumber] = expand;
    });
    setExpandedDays(next);
  };

  const areAllExpanded = useMemo(() => {
    return packageData.itinerary.every((d) => !!expandedDays[d.dayNumber]);
  }, [expandedDays, packageData.itinerary]);

  const handleCopyShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${packageData.title} | Safar Trails`,
        text: `Check out this holiday package: ${packageData.title} (${packageData.durationDays}D/${packageData.durationNights}N) starting at ₹${packageData.startingPrice.toLocaleString('en-IN')}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const formattedQuoteSummary = `${packageData.title} (${packageData.durationDays}D/${packageData.durationNights}N) - ${selectedHotelTier} stay with ${selectedVehicle} for ${travellersCount} guests (Est. ₹${estimatedTotalPrice.toLocaleString('en-IN')})`;

  const handleWhatsApp = () => {
    const summary = `*SafarTrails Expedition Booking Enquiry*\n\n` +
      `📦 *Package:* ${packageData.title}\n` +
      `📍 *Destination:* ${packageData.destination} (${packageData.durationDays}D/${packageData.durationNights}N)\n` +
      `🏨 *Stay Tier:* ${selectedHotelTier}\n` +
      `🚗 *Transport:* ${selectedVehicle}\n` +
      `👥 *Travellers:* ${travellersCount} Guests\n` +
      `💰 *Estimated Cost:* ₹${estimatedPerPersonPrice.toLocaleString('en-IN')}/person (Total: ₹${estimatedTotalPrice.toLocaleString('en-IN')})\n\n` +
      `_Please confirm hotel availability, custom dates, and provide the exact final quote!_`;

    openWhatsApp(summary, 'package_detail', packageData.destination);
  };

  const gallery = packageGallery(packageData);

  return (
    <div className="w-full min-h-screen bg-[#FBF9F5] text-stone-900 selection:bg-warm-orange/25 selection:text-stone-900">
      
      {/* TOP HEADER / BREADCRUMB STRIP */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-stone-700 hover:text-midnight-blue font-bold px-2 py-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer mr-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <span className="text-stone-300">/</span>
            <Link to="/" className="hover:text-midnight-blue transition-colors">Home</Link>
            <span className="text-stone-300">/</span>
            <Link to="/packages" className="hover:text-midnight-blue transition-colors">Tour Packages</Link>
            <span className="text-stone-300">/</span>
            <span className="font-semibold text-stone-900 truncate max-w-[200px] sm:max-w-xs">{packageData.title}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-all cursor-pointer"
              title="Share package"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-stone-600" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Chat Expert</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO TITLE & BADGES BAR */}
      <section className="bg-white border-b border-stone-200 pt-6 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {packageData.badge && (
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-warm-orange text-cta-ink shadow-xs">
                {packageData.badge}
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-stone-100 text-midnight-blue border border-stone-200 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-warm-orange" />
              {packageData.durationDays} Days / {packageData.durationNights} Nights
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-light-blue text-deep-emerald border border-light-blue flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-deep-emerald" />
              {packageData.destination}
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 ml-auto">
              <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              <span>{packageData.ratings || 4.9} ({packageData.reviewCount || 128} reviews)</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-stone-900 tracking-tight leading-tight mb-3">
            {packageData.title}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-stone-600 font-normal max-w-4xl leading-relaxed">
            {packageData.overview}
          </p>

          {/* Quick Features Row */}
          <div className="mt-5 flex flex-wrap items-center gap-3 pt-4 border-t border-stone-100 text-xs font-semibold text-stone-700">
            <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/80">
              <Car className="w-4 h-4 text-warm-orange" />
              <span>Private Dedicated Cab</span>
            </span>
            <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/80">
              <Hotel className="w-4 h-4 text-deep-emerald" />
              <span>Handpicked Verified Stays</span>
            </span>
            <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/80">
              <Utensils className="w-4 h-4 text-warm-orange" />
              <span>Daily Breakfast & Dinner</span>
            </span>
            <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/80">
              <Sparkles className="w-4 h-4 text-deep-emerald" />
              <span>100% Customizable Route</span>
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Hidden Surcharges</span>
            </span>
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY SHOWCASE */}
      {gallery.length > 0 && (
        <section className="bg-white border-b border-stone-200">
          <PackageGallery shots={gallery} destination={packageData.destination} />
        </section>
      )}

      {/* MAIN CONTENT + STICKY BOOKING CONSOLE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: ITINERARY, DETAILS, STAYS, INCLUSIONS (8 COLS) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* TRIP HIGHLIGHTS BENTO */}
            {packageData.highlights && packageData.highlights.length > 0 && (
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-warm-orange/15 text-warm-orange flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-serif font-black text-stone-900">
                      Key Journey Highlights
                    </h2>
                    <p className="text-xs text-stone-500">Carefully curated experiences crafted for this route</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {packageData.highlights.map((hl, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FBF9F5] border border-stone-200/80"
                    >
                      <span className="w-5 h-5 rounded-full bg-warm-orange/20 text-warm-orange flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                        ✓
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-stone-800 leading-snug">
                        {hl}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STICKY TAB NAVIGATION */}
            <div className="sticky top-14 sm:top-16 z-20 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'itinerary'
                    ? 'bg-midnight-blue text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-warm-orange" />
                <span>Itinerary ({packageData.itinerary.length} Days)</span>
              </button>

              <button
                onClick={() => setActiveTab('inclusions')}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'inclusions'
                    ? 'bg-midnight-blue text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Inclusions & Exclusions</span>
              </button>

              {packageData.faqs && packageData.faqs.length > 0 && (
                <button
                  onClick={() => setActiveTab('faqs')}
                  className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'faqs'
                      ? 'bg-midnight-blue text-white shadow-sm'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <Info className="w-3.5 h-3.5 text-deep-emerald" />
                  <span>FAQs</span>
                </button>
              )}
            </div>

            {/* TAB 1: DAY BY DAY ITINERARY */}
            {activeTab === 'itinerary' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200">
                  <div>
                    <h2 className="text-base sm:text-lg font-serif font-black text-stone-900">
                      Detailed Itinerary
                    </h2>
                    <p className="text-xs text-stone-500">Day-by-day sightseeing and route schedule</p>
                  </div>
                  <button
                    onClick={() => toggleAllDays(!areAllExpanded)}
                    className="text-xs font-bold text-deep-emerald hover:text-royal-navy underline cursor-pointer px-2 py-1"
                  >
                    {areAllExpanded ? 'Collapse All' : 'Expand All'}
                  </button>
                </div>

                {/* Timeline Cards */}
                <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-stone-200">
                  {packageData.itinerary.map((day) => {
                    const isOpen = !!expandedDays[day.dayNumber];
                    return (
                      <div
                        key={day.dayNumber}
                        className="relative bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden transition-all duration-200 hover:border-stone-300"
                      >
                        {/* Timeline Pin Marker */}
                        <div className="absolute -left-6 sm:-left-8 top-5 w-6 h-6 rounded-full bg-white border-2 border-deep-emerald flex items-center justify-center shadow-xs z-10">
                          <span className="w-2 h-2 rounded-full bg-warm-orange" />
                        </div>

                        {/* Accordion Header */}
                        <button
                          type="button"
                          onClick={() => toggleDay(day.dayNumber)}
                          className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-md bg-midnight-blue text-white text-[11px] font-black uppercase tracking-wider">
                                Day {day.dayNumber}
                              </span>
                              {day.location && (
                                <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-warm-orange" />
                                  <span>{day.location}</span>
                                </span>
                              )}
                            </div>
                            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-snug">
                              {day.title}
                            </h3>
                          </div>

                          <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 text-stone-600">
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </button>

                        {/* Expandable Content Body */}
                        {isOpen && (
                          <div className="px-5 sm:px-6 pb-6 pt-0 border-t border-stone-100 space-y-4">
                            
                            {/* Day Image if available */}
                            {day.image && (
                              <div className="mt-4 rounded-2xl overflow-hidden max-h-60 sm:max-h-72 shadow-xs">
                                <img
                                  src={day.image}
                                  alt={day.title}
                                  loading="lazy"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            {/* Description narrative */}
                            {day.description && (
                              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal pt-3 whitespace-pre-line">
                                {day.description}
                              </p>
                            )}

                            {/* Morning / Afternoon / Evening Activity Grid (only if present in data) */}
                            {(day.morningActivity || day.afternoonActivity || day.eveningActivity) && (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FBF9F5] p-3.5 rounded-2xl border border-stone-200/80 text-xs">
                                {day.morningActivity && (
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1 font-bold text-stone-900 text-[11px] uppercase tracking-wider text-warm-orange">
                                      <Sunrise className="w-3.5 h-3.5" />
                                      <span>Morning</span>
                                    </div>
                                    <p className="text-stone-600 text-[11px] leading-relaxed">{day.morningActivity}</p>
                                  </div>
                                )}
                                {day.afternoonActivity && (
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1 font-bold text-stone-900 text-[11px] uppercase tracking-wider text-deep-emerald">
                                      <Sun className="w-3.5 h-3.5" />
                                      <span>Afternoon</span>
                                    </div>
                                    <p className="text-stone-600 text-[11px] leading-relaxed">{day.afternoonActivity}</p>
                                  </div>
                                )}
                                {day.eveningActivity && (
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1 font-bold text-stone-900 text-[11px] uppercase tracking-wider text-purple-600">
                                      <Moon className="w-3.5 h-3.5" />
                                      <span>Evening</span>
                                    </div>
                                    <p className="text-stone-600 text-[11px] leading-relaxed">{day.eveningActivity}</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Insider Tip if present */}
                            {day.insiderTip && (
                              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900">
                                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="font-bold block">Trip Note:</strong>
                                  <span>{day.insiderTip}</span>
                                </div>
                              </div>
                            )}

                            {/* Stay & Meal Details Bar */}
                            {(day.stay || day.mealsIncluded || day.transfers) && (
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-100 text-xs text-stone-600">
                                {day.stay && (
                                  <span className="flex items-center gap-1.5 font-medium">
                                    <Hotel className="w-4 h-4 text-deep-emerald" />
                                    <span>Stay: <strong>{day.stay}</strong></span>
                                  </span>
                                )}
                                {day.mealsIncluded && (
                                  <span className="flex items-center gap-1.5 font-medium">
                                    <Utensils className="w-4 h-4 text-warm-orange" />
                                    <span>Meals: <strong>{day.mealsIncluded}</strong></span>
                                  </span>
                                )}
                                {day.transfers && (
                                  <span className="flex items-center gap-1.5 font-medium">
                                    <Car className="w-4 h-4 text-stone-500" />
                                    <span>Transfer: <strong>{day.transfers}</strong></span>
                                  </span>
                                )}
                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: INCLUSIONS & EXCLUSIONS */}
            {activeTab === 'inclusions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Inclusions */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-emerald-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-emerald-100">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-serif font-bold text-stone-900">What is Included</h3>
                      <span className="text-[11px] text-emerald-700">Covered in package</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5">
                    {packageData.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                          ✓
                        </span>
                        <span className="leading-relaxed">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-rose-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-rose-100">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                      <XCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-serif font-bold text-stone-900">What is Excluded</h3>
                      <span className="text-[11px] text-rose-700">Personal & optional expenses</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5">
                    {packageData.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                        <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                          ✕
                        </span>
                        <span className="leading-relaxed">{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            )}

            {/* TAB 4: FAQS */}
            {activeTab === 'faqs' && packageData.faqs && packageData.faqs.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 text-midnight-blue flex items-center justify-center font-bold">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                      Frequently Asked Questions
                    </h3>
                    <span className="text-xs text-stone-500">Everything you need to know before you travel</span>
                  </div>
                </div>

                <div className="divide-y divide-stone-200 border-t border-stone-200">
                  {packageData.faqs.map((faq, idx) => (
                    <details key={idx} className="group py-3.5">
                      <summary className="flex cursor-pointer items-start justify-between gap-3 list-none text-xs sm:text-sm font-bold text-stone-900 focus:outline-none">
                        <span>{faq.question}</span>
                        <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-stone-400 transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="mt-2 pr-4 text-xs sm:text-sm leading-relaxed text-stone-600 font-normal">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: STICKY PRICE & BOOKING CONSOLE (4 COLS) */}
          <div className="lg:col-span-4 sticky top-16 space-y-4">
            
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
              
              {/* Card Header with Price */}
              <div className="bg-gradient-to-br from-midnight-blue to-royal-navy p-6 text-white">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-luxury-gold">
                    Live Calculated Pricing
                  </span>
                  {packageData.originalPrice && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Special Rate
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-3xl sm:text-4xl font-serif font-black text-white">
                    ₹{estimatedPerPersonPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-stone-300 font-normal">/ person</span>
                </div>

                {packageData.originalPrice && (
                  <div className="text-xs text-stone-300 line-through mt-0.5">
                    Original Price: ₹{(packageData.originalPrice * tierMultiplier).toLocaleString('en-IN')}/person
                  </div>
                )}

                <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between text-xs">
                  <span className="text-stone-300">Total for {travellersCount} {travellersCount === 1 ? 'Guest' : 'Guests'}:</span>
                  <span className="text-base font-black text-warm-orange">
                    ₹{estimatedTotalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[10px] text-stone-300/80 block mt-1">{GST_NOTE}</span>
              </div>

              {/* Interactive Selectors Body */}
              <div className="p-5 sm:p-6 space-y-4">
                
                {/* Hotel Tier Selector */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    <Hotel className="w-3.5 h-3.5 text-deep-emerald" />
                    <span>Hotel Category</span>
                  </label>
                  <select
                    value={selectedHotelTier}
                    onChange={(e) => setSelectedHotelTier(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-stone-200 bg-[#FBF9F5] font-semibold text-xs sm:text-sm text-stone-900 focus:border-deep-emerald focus:bg-white focus:outline-none transition-colors cursor-pointer"
                  >
                    {packageData.hotelCategory === 'Budget / 3★' && (
                      <option value="Budget / 3★">Budget / 3★ Hotels</option>
                    )}
                    <option value="Standard 3★">Standard 3★ Hotels (Included)</option>
                    <option value="Deluxe 4★">Deluxe 4★ Boutique Resorts (+25%)</option>
                    <option value="Luxury 5★">Luxury 5★ Heritage / Lake View (+65%)</option>
                  </select>
                </div>

                {/* Transport Selector */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    <Car className="w-3.5 h-3.5 text-deep-emerald" />
                    <span>Dedicated Transport</span>
                  </label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-stone-200 bg-[#FBF9F5] font-semibold text-xs sm:text-sm text-stone-900 focus:border-deep-emerald focus:bg-white focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="Private AC Sedan (Dzire / Etios)">Private AC Sedan (Dzire / Etios)</option>
                    <option value="Private Innova Crysta SUV">Private Innova Crysta (+₹1,800/pkg)</option>
                    <option value="Tempo Traveller (Group)">Tempo Traveller (12/17-Seater)</option>
                  </select>
                </div>

                {/* Number of Travellers Counter */}
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-deep-emerald" />
                      <span>Number of Travellers</span>
                    </span>
                    <span className="text-stone-400 font-normal">Twin sharing</span>
                  </label>
                  
                  <div className="flex items-center justify-between p-2 rounded-2xl border border-stone-200 bg-[#FBF9F5]">
                    <button
                      type="button"
                      onClick={() => setTravellersCount((c) => Math.max(1, c - 1))}
                      className="w-9 h-9 rounded-xl bg-white text-stone-700 hover:bg-stone-200 font-black text-base flex items-center justify-center shadow-xs cursor-pointer"
                      disabled={travellersCount <= 1}
                    >
                      -
                    </button>
                    <span className="font-serif font-black text-stone-900 text-sm sm:text-base">
                      {travellersCount} {travellersCount === 1 ? 'Guest' : 'Guests'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTravellersCount((c) => Math.min(20, c + 1))}
                      className="w-9 h-9 rounded-xl bg-white text-stone-700 hover:bg-stone-200 font-black text-base flex items-center justify-center shadow-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Primary Action Button: Lock Rate / Get Final Quote */}
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal(formattedQuoteSummary, packageData.destination)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-warm-orange hover:brightness-105 text-cta-ink font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_8px_24px_-6px_rgba(255,133,52,0.85)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Get Exact Final Quote</span>
                  <ArrowRight className="w-4 h-4 text-cta-ink" />
                </button>

                {/* WhatsApp Enquiry Button */}
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                  <span>Instant WhatsApp Quote</span>
                </button>

                {/* AI Trip Customizer Button */}
                <button
                  type="button"
                  onClick={() => onStartAIPlan(`Customize ${packageData.title} in ${packageData.destination} for ${travellersCount} travellers`, packageData.destination)}
                  className="w-full py-2.5 px-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <AIIcon className="w-3.5 h-3.5 text-deep-emerald" />
                  <span>Customize this route in AI Studio</span>
                </button>

              </div>

              {/* Trust Assurances Footer */}
              <div className="bg-stone-50 p-4 border-t border-stone-200 space-y-2 text-[11px] text-stone-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Verified Local Driver & 4.5★ Stays</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-deep-emerald shrink-0" />
                  <span>Free Date Changes up to 7 Days before travel</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-warm-orange shrink-0" />
                  <span>Dedicated 24/7 Safar Trails On-Trip Concierge</span>
                </div>
              </div>

            </div>

            {/* Need Customization Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-midnight-blue to-deep-emerald text-white shadow-md">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-luxury-gold block mb-1">
                Custom Group or Honeymoon?
              </span>
              <h4 className="text-base font-serif font-bold mb-1">
                Need extra days or special arrangements?
              </h4>
              <p className="text-xs text-stone-200 leading-relaxed mb-3">
                Talk directly to our destination specialists for candle-light dinners, floral bed decors, and flight connections.
              </p>
              <button
                onClick={handleWhatsApp}
                className="w-full py-2.5 rounded-xl bg-white text-midnight-blue font-bold text-xs uppercase tracking-wider hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Talk to Destination Specialist
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* STICKY BOTTOM BAR (Mobile Viewport) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3.5 z-40 shadow-[0_-8px_24px_rgba(0,0,0,0.1)] flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Est. Cost</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-midnight-blue">
              ₹{estimatedPerPersonPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-stone-500">/ person</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleWhatsApp}
            className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer"
            title="Chat on WhatsApp"
          >
            <WhatsAppIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => onOpenQuoteModal(formattedQuoteSummary, packageData.destination)}
            className="px-5 py-2.5 rounded-xl bg-warm-orange text-cta-ink font-black text-xs uppercase tracking-wider shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <span>Get Final Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};

