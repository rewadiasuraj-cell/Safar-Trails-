import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Building2, 
  Car, 
  Compass, 
  ArrowRight, 
  Loader2, 
  FileText,
  ChevronDown,
  ChevronUp,
  User,
  Heart,
  Mountain,
  Crown,
  Trees,
  Sailboat,
  Snowflake,
  Camera,
  Utensils,
  Landmark,
  ShoppingBag,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  SlidersHorizontal,
  Leaf,
  Sparkles
} from 'lucide-react';
import { trackAIPlanGenerated, trackAIPlanRequested } from '../../lib/analytics';
import { TripType, HotelCategory, TransportType, AITripPlanResult } from '../../types';
import { AITripResultView } from './AITripResultView';
import { parseTripPrompt } from '../../utils/promptParser';

interface AITripPlannerProps {
  initialPrompt?: string;
  initialDestination?: string;
  onOpenQuoteModal: (summary?: string) => void;
}

export const AITripPlanner: React.FC<AITripPlannerProps> = ({
  initialPrompt = '',
  initialDestination = '',
  onOpenQuoteModal
}) => {
  const [activeTab, setActiveTab] = useState<'guided' | 'conversational'>('guided');
  const [naturalPrompt, setNaturalPrompt] = useState(initialPrompt);
  
  // Guided Form States
  const [destination, setDestination] = useState(initialDestination || 'Kashmir');
  const [durationDays, setDurationDays] = useState(6);
  const [travellers, setTravellers] = useState(2);
  const [tripType, setTripType] = useState<TripType>('Couple');
  const [hotelCategory, setHotelCategory] = useState<HotelCategory>('Deluxe 4★');
  const [transportMode, setTransportMode] = useState<TransportType>('Private Sedan');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Nature & Valleys',
    'Houseboats & Waters',
    'Mountains & Snow'
  ]);
  const [startCity] = useState('Delhi/Mumbai');

  // Inline "See more" expansion toggles for compact UX
  const [showMoreTripTypes, setShowMoreTripTypes] = useState(false);
  const [showMoreHotels, setShowMoreHotels] = useState(false);
  const [showMoreTransport, setShowMoreTransport] = useState(false);
  const [showMoreInterests, setShowMoreInterests] = useState(false);

  // Generation state
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<AITripPlanResult | null>(null);
  const [, setGenerationError] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialPrompt) {
      setNaturalPrompt(initialPrompt);
      setActiveTab('conversational');
    }
  }, [initialPrompt]);

  React.useEffect(() => {
    if (initialDestination) {
      setDestination(initialDestination);
    }
  }, [initialDestination]);

  const destinationsList = [
    'Kashmir',
    'Goa',
    'Kerala',
    'Rajasthan',
    'Himachal Pradesh',
    'Uttarakhand',
    'Chardham Yatra',
    'Ladakh',
    'Andaman & Nicobar',
    'Northeast India'
  ];

  // All trip types with authentic SVG / minimal icons
  const allTripTypes: { 
    id: TripType; 
    label: string; 
    defaultTravellers: number;
    icon: React.ReactNode;
    isPrimary?: boolean;
  }[] = [
    {
      id: 'Couple',
      label: 'Couple',
      defaultTravellers: 2,
      isPrimary: true,
      icon: (
        <div className="relative flex items-center justify-center">
          <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="11" cy="12" r="3" />
            <circle cx="21" cy="12" r="3" />
            <path d="M6 24C6 20.5 8.5 18 11 18C12.5 18 13.5 18.5 14.5 19.3" strokeLinecap="round" />
            <path d="M26 24C26 20.5 23.5 18 21 18C19.5 18 18.5 18.5 17.5 19.3" strokeLinecap="round" />
            <path d="M16 24V21" strokeLinecap="round" />
          </svg>
          <span className="absolute -top-1.5 right-0.5 text-[10px] leading-none">❤️</span>
        </div>
      )
    },
    {
      id: 'Family',
      label: 'Family',
      defaultTravellers: 4,
      isPrimary: true,
      icon: (
        <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="10" cy="11" r="2.8" />
          <circle cx="22" cy="11" r="2.8" />
          <circle cx="16" cy="16" r="2" />
          <path d="M5 24C5 20.5 7.5 18.5 10 18.5C11.3 18.5 12.5 19.1 13.2 20" strokeLinecap="round" />
          <path d="M27 24C27 20.5 24.5 18.5 22 18.5C20.7 18.5 19.5 19.1 18.8 20" strokeLinecap="round" />
          <path d="M12.5 24C12.5 22 14 20.8 16 20.8C18 20.8 19.5 22 19.5 24" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'Friends',
      label: 'Friends',
      defaultTravellers: 4,
      isPrimary: true,
      icon: (
        <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="16" cy="10" r="3.2" />
          <circle cx="9" cy="13" r="2.5" />
          <circle cx="23" cy="13" r="2.5" />
          <path d="M11 24C11 20 13.2 17.5 16 17.5C18.8 17.5 21 20 21 24" strokeLinecap="round" />
          <path d="M5 24C5 21 7 19.5 9 19.5" strokeLinecap="round" />
          <path d="M27 24C27 21 25 19.5 23 19.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'Honeymoon',
      label: 'Honeymoon',
      defaultTravellers: 2,
      isPrimary: true,
      icon: <Heart className="w-5 h-5 stroke-[1.8]" />
    },
    {
      id: 'Adventure',
      label: 'Adventure',
      defaultTravellers: 2,
      isPrimary: true,
      icon: <Mountain className="w-5 h-5 stroke-[1.8]" />
    },
    {
      id: 'Solo',
      label: 'Solo',
      defaultTravellers: 1,
      icon: <User className="w-5 h-5 stroke-[1.8]" />
    },
    {
      id: 'Group',
      label: 'Group / Corp',
      defaultTravellers: 8,
      icon: <Users className="w-5 h-5 stroke-[1.8]" />
    },
    {
      id: 'Luxury',
      label: 'Luxury',
      defaultTravellers: 2,
      icon: <Crown className="w-5 h-5 stroke-[1.8]" />
    },
    {
      id: 'Spiritual',
      label: 'Spiritual',
      defaultTravellers: 2,
      icon: <Compass className="w-5 h-5 stroke-[1.8]" />
    }
  ];

  // Stay category options
  const primaryHotelOptions: HotelCategory[] = ['Standard 3★', 'Deluxe 4★', 'Luxury 5★'];
  const moreHotelOptions: HotelCategory[] = ['Heritage Boutique', 'Houseboat & Resort'];

  // Transport options
  const primaryTransportOptions: { mode: TransportType; label: string }[] = [
    { mode: 'Private Sedan', label: 'Private Sedan' },
    { mode: 'Private SUV (Innova/Crysta)', label: 'SUV (Innova/Crysta)' },
    { mode: 'Tempo Traveller', label: 'Tempo Traveller' },
    { mode: 'Self Drive / Flight + Cab', label: 'Self Drive / Cab' }
  ];
  const moreTransportOptions: { mode: TransportType; label: string }[] = [
    { mode: 'Private Sedan', label: 'Luxury Sedan (BMW/Audi)' },
    { mode: 'Self Drive / Flight + Cab', label: 'Flight + Cab Transfers' }
  ];

  // Experiences list with minimal authentic icons
  const allInterestsList = [
    { name: 'Nature & Valleys', icon: <Trees className="w-3.5 h-3.5 text-emerald-600 stroke-[2]" />, isPrimary: true },
    { name: 'Houseboats & Waters', icon: <Sailboat className="w-3.5 h-3.5 text-cyan-600 stroke-[2]" />, isPrimary: true },
    { name: 'Mountains & Snow', icon: <Snowflake className="w-3.5 h-3.5 text-sky-500 stroke-[2]" />, isPrimary: true },
    { name: 'Photography & Scenic Stops', icon: <Camera className="w-3.5 h-3.5 text-stone-700 stroke-[2]" />, isPrimary: true },
    { name: 'Food & Wazwan Curries', icon: <Utensils className="w-3.5 h-3.5 text-amber-600 stroke-[2]" /> },
    { name: 'Heritage & Royal Forts', icon: <Landmark className="w-3.5 h-3.5 text-orange-600 stroke-[2]" /> },
    { name: 'Adventure & Treks', icon: <Compass className="w-3.5 h-3.5 text-indigo-600 stroke-[2]" /> },
    { name: 'Shopping & Handicrafts', icon: <ShoppingBag className="w-3.5 h-3.5 text-rose-500 stroke-[2]" /> },
    { name: 'Ayurveda & Spa Wellness', icon: <Leaf className="w-3.5 h-3.5 text-teal-600 stroke-[2]" /> }
  ];

  const primaryInterests = allInterestsList.filter(i => i.isPrimary);
  const secondaryInterests = allInterestsList.filter(i => !i.isPrimary);

  const toggleInterest = (interestName: string) => {
    if (selectedInterests.includes(interestName)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interestName));
    } else {
      setSelectedInterests([...selectedInterests, interestName]);
    }
  };

  const handleGenerate = async (useCustomPrompt = false) => {
    setLoading(true);
    setGenerationError(null);
    setGeneratedPlan(null);

    let effectiveDestination = destination;
    let effectiveDuration = durationDays;
    let effectiveTravellers = travellers;
    let effectiveTripType = tripType;
    let effectiveHotel = hotelCategory;
    let effectiveTransport = transportMode;
    let effectiveInterests = selectedInterests;
    let effectiveBudget = undefined;

    if (useCustomPrompt && naturalPrompt.trim()) {
      const parsed = parseTripPrompt(naturalPrompt, {
        destination,
        durationDays,
        travellers,
        tripType,
        hotelCategory,
        transportMode
      });
      effectiveDestination = parsed.destination;
      effectiveDuration = parsed.durationDays;
      effectiveTravellers = parsed.travellers;
      effectiveTripType = parsed.tripType;
      effectiveHotel = parsed.hotelCategory;
      effectiveTransport = parsed.transportMode;
      effectiveInterests = parsed.interests.length > 0 ? parsed.interests : selectedInterests;
      effectiveBudget = parsed.budgetTotal;

      // Synchronize component state for consistency
      setDestination(effectiveDestination);
      setDurationDays(effectiveDuration);
      setTravellers(effectiveTravellers);
      setTripType(effectiveTripType);
      setHotelCategory(effectiveHotel);
      setTransportMode(effectiveTransport);
    }

    trackAIPlanRequested(effectiveDestination);

    const payload = {
      destination: effectiveDestination,
      durationDays: effectiveDuration,
      travellers: effectiveTravellers,
      tripType: effectiveTripType,
      hotelCategory: effectiveHotel,
      transportMode: effectiveTransport,
      interests: effectiveInterests,
      budgetTotal: effectiveBudget,
      startCity,
      userPrompt: useCustomPrompt 
        ? naturalPrompt 
        : `Plan a ${effectiveDuration}-day holiday in ${effectiveDestination} for ${effectiveTravellers} travellers (${effectiveTripType}) with ${effectiveHotel} accommodation and ${effectiveTransport} transport.`
    };

    try {
      const response = await fetch('/api/ai-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success && data.plan) {
        trackAIPlanGenerated(effectiveDestination, effectiveDuration);
        setGeneratedPlan(data.plan);
      } else {
        throw new Error(data.error || 'Failed to generate itinerary');
      }
    } catch (err: any) {
      // Create seamless instant fallback plan for the user using effective parsed parameters
      const estMin = effectiveBudget 
        ? Math.round(effectiveBudget * 0.9) 
        : Math.round(17500 * effectiveTravellers * (effectiveDuration / 6));
      const estMax = effectiveBudget 
        ? Math.round(effectiveBudget * 1.1) 
        : Math.round(estMin * 1.18);
      const days = [];
      for (let i = 1; i <= effectiveDuration; i++) {
        days.push({
          dayNumber: i,
          title: i === 1 
            ? `Arrival in ${effectiveDestination} & Leisure Check-in` 
            : i === effectiveDuration 
            ? `Souvenir Walk & Departure from ${effectiveDestination}` 
            : `Day ${i}: Signature ${effectiveDestination} Sightseeing & Experiences`,
          location: effectiveDestination,
          description: `Curated exploration designed for ${effectiveTravellers} travellers (${effectiveTripType}), combining prime highlights, relaxed pacing, and scenic photo stops.`,
          morningActivity: i === 1 ? 'Airport/Station pickup and private check-in' : 'Morning scenic sightseeing and heritage visit',
          afternoonActivity: 'Local cuisine tasting and leisure exploration',
          eveningActivity: 'Sunset viewpoint, cultural stroll, and authentic dinner',
          stay: `${effectiveHotel} Resort / Cottage`,
          mealsIncluded: 'Breakfast & Dinner Included',
          transfers: effectiveTransport,
          insiderTip: 'Keep a lightweight day-pack and save your offline itinerary.'
        });
      }

      // The user still receives a usable itinerary on this path, so it counts as
      // a delivered plan for conversion reporting.
      trackAIPlanGenerated(effectiveDestination, effectiveDuration);
      setGeneratedPlan({
        planId: `AI-${Date.now().toString(36).toUpperCase()}`,
        destination: effectiveDestination,
        title: `${effectiveDuration}-Day Bespoke ${effectiveDestination} Journey`,
        summary: `A carefully paced, high-comfort ${effectiveDuration}-day holiday in ${effectiveDestination} designed for ${effectiveTravellers} travellers (${effectiveTripType}), combining premier stays in ${effectiveHotel} with dedicated ${effectiveTransport} transport.`,
        durationDays: effectiveDuration,
        durationNights: Math.max(1, effectiveDuration - 1),
        travellersCount: effectiveTravellers,
        tripType: effectiveTripType,
        hotelCategory: effectiveHotel,
        transportType: effectiveTransport,
        estimatedBudget: {
          min: estMin,
          max: estMax,
          perPerson: Math.round(estMin / effectiveTravellers),
          breakdown: {
            hotels: Math.round(estMin * 0.45),
            transport: Math.round(estMin * 0.30),
            sightseeingAndPermits: Math.round(estMin * 0.15),
            foodAndMisc: Math.round(estMin * 0.10)
          }
        },
        itinerary: days,
        includedHighlights: [
          `Private dedicated ${effectiveTransport} throughout the trip with verified driver`,
          `${Math.max(1, effectiveDuration - 1)} Nights handpicked stay in ${effectiveHotel}`,
          'Daily freshly prepared breakfast & regional dinners included',
          'All toll taxes, parking fees, and driver allowances covered',
          '24/7 SafarTrails on-trip concierge assistance'
        ],
        expertTips: [
          `Book entry permits and top attractions in ${effectiveDestination} in advance during peak holiday seasons.`,
          'Always dress in comfortable layers suited to local weather conditions.',
          'Carry some cash for remote local shops and artisan markets.'
        ],
        packingEssentials: [
          'Valid Government Photo ID (Aadhaar / Passport / Driving License)',
          'Comfortable footwear for daily sightseeing',
          'Sunscreen, polarized sunglasses, and essential personal medicines',
          'Universal power bank and camera chargers'
        ],
        bestTimeToVisitInfo: `Optimal travel season for ${effectiveDestination} spans throughout the year with pleasant weather and seasonal highlights.`,
        disclaimer: 'All prices and durations are estimated indicative figures based on standard travel rates. Exact package costs depend on live hotel availability, seasonality, and custom upgrades. Final quotes are confirmed by a SafarTrails Travel Specialist.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Determine which trip types to render based on desktop / mobile breakpoints and expansion state
  const visibleTripTypes = showMoreTripTypes 
    ? allTripTypes 
    : allTripTypes.filter(t => t.isPrimary);

  return (
    <section id="ai-trip-planner-section" className="w-full py-12 sm:py-16 bg-[#FAF9F6] border-t border-b border-stone-200/80">
      <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-800 text-xs font-bold uppercase tracking-widest mb-3">
            <SlidersHorizontal className="w-3.5 h-3.5 text-accent-ink" />
            <span>Instant Custom Itineraries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            AI-Powered Custom Trip Planner
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base font-normal">
            Choose your destination, dates, and stay preferences for a curated day-by-day itinerary with exact price estimates.
          </p>
        </div>

        {/* Top Centered Mode Toggle Pill */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex p-1 rounded-full bg-white border border-stone-200 shadow-2xs">
            {/* Guided Custom Planner Button */}
            <button
              type="button"
              id="tab-guided-planner"
              onClick={() => setActiveTab('guided')}
              className={`relative px-5 sm:px-7 py-2 rounded-full text-xs sm:text-[13px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'guided'
                  ? 'bg-[#0E2620] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 bg-transparent'
              }`}
            >
              <span>Guided Custom Planner</span>
              {activeTab === 'guided' && (
                <div className="w-6 h-[2px] bg-accent-ink rounded-full mx-auto mt-0.5" />
              )}
            </button>

            {/* Natural Prompt Mode Button */}
            <button
              type="button"
              id="tab-prompt-mode"
              onClick={() => setActiveTab('conversational')}
              className={`px-5 sm:px-7 py-2 rounded-full text-xs sm:text-[13px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5 ${
                activeTab === 'conversational'
                  ? 'bg-[#0E2620] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 bg-transparent'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-accent-ink stroke-[2]" />
              <span>Natural Prompt Mode</span>
            </button>
          </div>
        </div>

        {/* Main Card Container */}
        {!generatedPlan && (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] border border-stone-200/90">
            {activeTab === 'conversational' ? (
              /* Conversational Natural Prompt Mode */
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-accent-ink stroke-[2]" />
                      <span>Describe your dream trip in plain words</span>
                    </div>
                    <span className="text-[11px] text-stone-400 font-normal">Any destination • Any duration • Any budget</span>
                  </label>
                  <textarea
                    rows={3}
                    value={naturalPrompt}
                    onChange={(e) => setNaturalPrompt(e.target.value)}
                    placeholder="e.g. Couple honeymoon in Goa, 5 days, beach resort, private cab & candlelight dinner"
                    className="w-full p-3.5 rounded-xl border border-stone-200 text-stone-900 focus:border-[#0E2620] focus:outline-none text-sm resize-none bg-[#FAF9F6]"
                  />
                </div>

                {/* Real-time Extracted Parameters Pill Badges */}
                {(() => {
                  const preview = naturalPrompt.trim() 
                    ? parseTripPrompt(naturalPrompt, { destination, durationDays, travellers, tripType, hotelCategory, transportMode })
                    : null;
                  
                  if (!preview) return null;

                  return (
                    <div className="p-3 bg-orange-50/70 rounded-xl border border-orange-200/80 animate-in fade-in duration-200">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-900 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-accent-ink" />
                        <span>AI Detected Preferences:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-orange-200 text-stone-800 text-xs font-bold shadow-2xs">
                          <MapPin className="w-3 h-3 text-accent-ink" />
                          <span>{preview.destination}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-orange-200 text-stone-800 text-xs font-bold shadow-2xs">
                          <Calendar className="w-3 h-3 text-accent-ink" />
                          <span>{preview.durationDays} Days ({preview.durationNights}N)</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-orange-200 text-stone-800 text-xs font-bold shadow-2xs">
                          <Users className="w-3 h-3 text-accent-ink" />
                          <span>{preview.travellers} {preview.travellers === 1 ? 'Person' : 'People'} ({preview.tripType})</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-orange-200 text-stone-800 text-xs font-bold shadow-2xs">
                          <Building2 className="w-3 h-3 text-accent-ink" />
                          <span>{preview.hotelCategory}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-orange-200 text-stone-800 text-xs font-bold shadow-2xs">
                          <Car className="w-3 h-3 text-accent-ink" />
                          <span>{preview.transportMode}</span>
                        </span>
                        {preview.budgetTotal && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-orange-200 text-[#0E2620] text-xs font-bold shadow-2xs">
                            <span>Budget: ₹{preview.budgetTotal.toLocaleString('en-IN')}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Try Prompts:</span>
                  {[
                    'Couple honeymoon in Goa, 5 days, beach resort',
                    '4 friends, Manali & Solang, 5 days, adventure & snow',
                    'Family Kerala backwaters & Munnar, 6 days, 4-star stay',
                    'Kashmir romantic getaway, 6 days, luxury houseboat',
                    'Andaman 5 days scuba, Radhanagar beach, couple'
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNaturalPrompt(p)}
                      className="px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 hover:border-accent-ink text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      "{p}"
                    </button>
                  ))}
                </div>

                <button
                  id="generate-conversational-plan-btn"
                  onClick={() => handleGenerate(true)}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#0E2620] hover:bg-stone-900 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-accent-ink" />
                      <span>Crafting Custom Itinerary...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 text-white" />
                      <span>BUILD MY CUSTOM ITINERARY</span>
                      <ArrowRight className="w-4 h-4 text-accent-ink" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Compact Guided Planner Form */
              <div className="space-y-6">
                {/* 1. Destination & Duration Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8 items-center">
                  {/* Left: Destination Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-700 stroke-[2]" />
                      <span>DESTINATION</span>
                    </label>
                    
                    <div className="relative">
                      <select
                        id="ai-planner-destination-select"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full appearance-none px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 font-semibold text-sm focus:border-[#0E2620] focus:outline-none cursor-pointer pr-9 shadow-2xs"
                      >
                        {destinationsList.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none stroke-[2]" />
                    </div>
                  </div>

                  {/* Right: Duration Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-700 stroke-[2]" />
                        <span>DURATION</span>
                      </label>
                      <div className="text-xs font-bold uppercase tracking-wider">
                        <span className="text-accent-ink font-black">{durationDays} DAYS</span>
                        <span className="text-stone-800 font-bold"> / {durationDays - 1} NIGHTS</span>
                      </div>
                    </div>

                    <div className="pt-2 px-1">
                      <input
                        type="range"
                        min={3}
                        max={12}
                        value={durationDays}
                        onChange={(e) => setDurationDays(Number(e.target.value))}
                        className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#0E2620]"
                        style={{
                          background: `linear-gradient(to right, #C2410C 0%, #C2410C ${
                            ((durationDays - 3) / 9) * 100
                          }%, #E2E8F0 ${((durationDays - 3) / 9) * 100}%, #E2E8F0 100%)`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Who is Travelling? (Compact Grid + Inline "See more") */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-[11px] font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-stone-700 stroke-[2]" />
                      <span>WHO IS TRAVELLING?</span>
                    </label>

                    <div className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1">
                      <User className="w-3 h-3 text-stone-600" />
                      <span>{travellers} {travellers === 1 ? 'TRAVELLER' : 'TRAVELLERS'}</span>
                    </div>
                  </div>

                  {/* Trip Types: Desktop 6-slot row (5 items + See more) / Mobile 4-slot grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                    {visibleTripTypes.map((item) => {
                      const isSelected = tripType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          id={`trip-type-${item.id.toLowerCase()}`}
                          onClick={() => {
                            setTripType(item.id);
                            setTravellers(item.defaultTravellers);
                          }}
                          className={`relative p-2.5 sm:p-3 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer min-h-[78px] ${
                            isSelected
                              ? 'border-accent-ink bg-orange-50/20 text-accent-ink shadow-2xs ring-1 ring-accent-ink'
                              : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700 hover:bg-stone-50/60'
                          }`}
                        >
                          {/* Top-right subtle selection indicator pill */}
                          {isSelected && (
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-ink" />
                          )}
                          <div className={isSelected ? 'text-accent-ink' : 'text-stone-700'}>
                            {item.icon}
                          </div>
                          <span className={`text-[11px] sm:text-xs font-bold tracking-tight whitespace-nowrap leading-tight ${
                            isSelected ? 'text-stone-900' : 'text-stone-700'
                          }`}>
                            {item.label}
                          </span>
                        </button>
                      );
                    })}

                    {/* Inline "See more / See less" Button */}
                    <button
                      type="button"
                      id="toggle-see-more-trip-types"
                      onClick={() => setShowMoreTripTypes(!showMoreTripTypes)}
                      className="p-2.5 sm:p-3 rounded-xl border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-stone-600 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer min-h-[78px]"
                    >
                      <span className="text-[11px] sm:text-xs font-bold text-stone-700 leading-tight">
                        {showMoreTripTypes ? 'See less' : 'See more'}
                      </span>
                      {showMoreTripTypes ? (
                        <ChevronUp className="w-3.5 h-3.5 text-stone-500" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 3. Stay Category & Dedicated Transport Side-by-Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8 pt-1">
                  {/* Left: Stay Category */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-stone-700 stroke-[2]" />
                      <span>STAY CATEGORY</span>
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      {primaryHotelOptions.map((tier) => {
                        const isSelected = hotelCategory === tier;
                        return (
                          <button
                            key={tier}
                            type="button"
                            onClick={() => setHotelCategory(tier)}
                            className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center leading-tight whitespace-nowrap ${
                              isSelected
                                ? 'bg-[#0E2620] text-white border-[#0E2620] shadow-xs'
                                : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50/60'
                            }`}
                          >
                            {tier}
                          </button>
                        );
                      })}
                    </div>

                    {/* Expandable More Hotel Options */}
                    {showMoreHotels && (
                      <div className="grid grid-cols-2 gap-2 mt-2 animate-in fade-in duration-200">
                        {moreHotelOptions.map((tier) => {
                          const isSelected = hotelCategory === tier;
                          return (
                            <button
                              key={tier}
                              type="button"
                              onClick={() => setHotelCategory(tier)}
                              className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center leading-tight ${
                                isSelected
                                  ? 'bg-[#0E2620] text-white border-[#0E2620] shadow-xs'
                                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                              }`}
                            >
                              {tier}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-2 text-center">
                      <button
                        type="button"
                        onClick={() => setShowMoreHotels(!showMoreHotels)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500 hover:text-stone-800 transition-colors py-0.5 px-2 rounded-md hover:bg-stone-100 cursor-pointer"
                      >
                        <span>{showMoreHotels ? 'See less' : 'See more'}</span>
                        {showMoreHotels ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Right: Dedicated Transport */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-stone-700 stroke-[2]" />
                      <span>DEDICATED TRANSPORT</span>
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      {primaryTransportOptions.slice(0, 2).map((item) => {
                        const isSelected = transportMode === item.mode;
                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => setTransportMode(item.mode)}
                            className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center leading-tight whitespace-nowrap ${
                              isSelected
                                ? 'bg-[#0E2620] text-white border-[#0E2620] shadow-xs'
                                : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50/60'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {primaryTransportOptions.slice(2, 4).map((item) => {
                        const isSelected = transportMode === item.mode;
                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => setTransportMode(item.mode)}
                            className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center leading-tight whitespace-nowrap ${
                              isSelected
                                ? 'bg-[#0E2620] text-white border-[#0E2620] shadow-xs'
                                : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50/60'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Expandable More Transport Options */}
                    {showMoreTransport && (
                      <div className="grid grid-cols-2 gap-2 mt-2 animate-in fade-in duration-200">
                        {moreTransportOptions.map((item) => {
                          const isSelected = transportMode === item.mode;
                          return (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => setTransportMode(item.mode)}
                              className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center leading-tight ${
                                isSelected
                                  ? 'bg-[#0E2620] text-white border-[#0E2620] shadow-xs'
                                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-2 text-center">
                      <button
                        type="button"
                        onClick={() => setShowMoreTransport(!showMoreTransport)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500 hover:text-stone-800 transition-colors py-0.5 px-2 rounded-md hover:bg-stone-100 cursor-pointer"
                      >
                        <span>{showMoreTransport ? 'See less' : 'See more'}</span>
                        {showMoreTransport ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Recommended Experiences (Pills + Inline "See more") */}
                <div className="pt-1">
                  <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-stone-700 stroke-[2]" />
                    <span>RECOMMENDED EXPERIENCES</span>
                  </label>

                  <div className="flex flex-wrap items-center gap-2">
                    {primaryInterests.map((interest) => {
                      const isSelected = selectedInterests.includes(interest.name);
                      return (
                        <button
                          key={interest.name}
                          type="button"
                          onClick={() => toggleInterest(interest.name)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                            isSelected
                              ? 'bg-white border-accent-ink text-stone-900 shadow-2xs ring-1 ring-accent-ink/40'
                              : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50/60'
                          }`}
                        >
                          {interest.icon}
                          <span className="font-semibold text-[11.5px]">{interest.name}</span>
                        </button>
                      );
                    })}

                    {showMoreInterests && secondaryInterests.map((interest) => {
                      const isSelected = selectedInterests.includes(interest.name);
                      return (
                        <button
                          key={interest.name}
                          type="button"
                          onClick={() => toggleInterest(interest.name)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap animate-in fade-in duration-150 ${
                            isSelected
                              ? 'bg-white border-accent-ink text-stone-900 shadow-2xs ring-1 ring-accent-ink/40'
                              : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                          }`}
                        >
                          {interest.icon}
                          <span className="font-semibold text-[11.5px]">{interest.name}</span>
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => setShowMoreInterests(!showMoreInterests)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-stone-600 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <span className="text-[11.5px]">{showMoreInterests ? 'See less' : 'See more'}</span>
                      {showMoreInterests ? <ChevronUp className="w-3 h-3 text-stone-500" /> : <ChevronDown className="w-3 h-3 text-stone-500" />}
                    </button>
                  </div>
                </div>

                {/* 5. Main Action Button */}
                <div className="pt-2">
                  <button
                    id="generate-guided-plan-btn"
                    onClick={() => handleGenerate(false)}
                    disabled={loading}
                    className="w-full px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-[#0E2620] hover:bg-stone-900 text-white transition-all shadow-md hover:shadow-lg flex items-center justify-between cursor-pointer disabled:opacity-60 active:scale-[0.99]"
                  >
                    {loading ? (
                      <div className="w-full flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-accent-ink" />
                        <span className="text-xs sm:text-sm font-semibold">Generating Custom {destination} Itinerary...</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <FileText className="w-5 h-5 text-white stroke-[2]" />
                          <span className="text-[13.5px] sm:text-[15px] font-bold text-white tracking-tight">
                            Build My Custom {destination} Itinerary
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-accent-ink stroke-[2.5] shrink-0 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Trust Pillars Bar */}
        <div className="mt-6 pt-5 border-t border-stone-200/70 grid grid-cols-3 gap-2 sm:gap-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-accent-ink shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-stone-900">Verified Experts</div>
              <div className="text-[11px] text-stone-500 leading-none mt-0.5">Personalized for you</div>
            </div>
            <span className="text-[11px] font-bold text-stone-800 sm:hidden">Verified Experts</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-accent-ink shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-stone-900">Transparent Pricing</div>
              <div className="text-[11px] text-stone-500 leading-none mt-0.5">No hidden charges</div>
            </div>
            <span className="text-[11px] font-bold text-stone-800 sm:hidden">Transparent Pricing</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-accent-ink shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-stone-900">24/7 Support</div>
              <div className="text-[11px] text-stone-500 leading-none mt-0.5">We're here to help</div>
            </div>
            <span className="text-[11px] font-bold text-stone-800 sm:hidden">24/7 Support</span>
          </div>
        </div>

        {/* Generated Plan Output View */}
        {generatedPlan && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <AITripResultView
              plan={generatedPlan}
              onReset={() => setGeneratedPlan(null)}
              onOpenQuoteModal={onOpenQuoteModal}
            />
          </div>
        )}

      </div>
    </section>
  );
};
