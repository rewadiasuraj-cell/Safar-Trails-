import React, { useState } from 'react';
import { Package } from '../../types';
import { WhatsAppIcon } from '../WhatsAppIcon';
import { AIIcon } from '../AIIcon';
import { 
  X, 
  Calendar, 
  MapPin, 
  Hotel, 
  Car, 
  Utensils, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  Share2, 
  ChevronDown, 
  ChevronUp, 
  IndianRupee, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface PackageDetailModalProps {
  packageData: Package | null;
  onClose: () => void;
  onStartAIPlanWithPackage: (pkg: Package) => void;
  onOpenQuoteModal: (summary?: string) => void;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  packageData,
  onClose,
  onStartAIPlanWithPackage,
  onOpenQuoteModal
}) => {
  if (!packageData) return null;

  const [activeTab, setActiveTab] = useState<'itinerary' | 'inclusions' | 'stays'>('itinerary');
  const [selectedHotelTier, setSelectedHotelTier] = useState<string>(packageData.hotelCategory || 'Deluxe 4★');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('Private Sedan (Dzire/Etios)');
  const [travellersCount, setTravellersCount] = useState<number>(2);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

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

    const encoded = encodeURIComponent(summary);
    window.open(`https://wa.me/918076665782?text=${encoded}`, '_blank');
  };

  const formattedQuoteSummary = `${packageData.title} (${packageData.durationDays}D/${packageData.durationNights}N) - ${selectedHotelTier} stay & ${selectedVehicle} for ${travellersCount} guests`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[1100px] rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[92vh] flex flex-col my-auto">
        {/* Sticky Header / Hero */}
        <div className="relative h-64 sm:h-72 flex-shrink-0">
          <img
            src={packageData.heroImage}
            alt={packageData.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white shadow-xs border border-white/20">
              {packageData.durationDays} Days / {packageData.durationNights} Nights
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white">
              {packageData.destination}
            </span>
          </div>

          {/* Bottom Banner Content */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight leading-tight">
              {packageData.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 line-clamp-1 font-normal">
              {packageData.overview}
            </p>
          </div>
        </div>

        {/* Dynamic Configurator Bar */}
        <div className="bg-[#FAF9F6] border-b border-gray-200 p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Hotel Category</label>
            <select
              value={selectedHotelTier}
              onChange={(e) => setSelectedHotelTier(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 bg-white font-bold text-black focus:border-black focus:outline-none"
            >
              <option value="Standard 3★">Standard 3★ Hotels</option>
              <option value="Deluxe 4★">Deluxe 4★ Resorts</option>
              <option value="Luxury 5★">Luxury 5★ / Heritage</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Dedicated Transport</label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 bg-white font-bold text-black focus:border-black focus:outline-none"
            >
              <option value="Private Sedan (Dzire/Etios)">Private AC Sedan</option>
              <option value="Private SUV (Innova/Crysta)">Private Innova Crysta (+₹1,800/pkg)</option>
              <option value="Tempo Traveller">Tempo Traveller (For Groups)</option>
            </select>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-gray-200 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Est. Starting Cost</span>
              <span className="text-base font-extrabold text-black">
                ₹{estimatedPerPersonPrice.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-gray-500">/ person</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Total ({travellersCount} Guests)</span>
              <span className="text-xs font-bold text-black">₹{estimatedTotalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-gray-200 px-6 bg-white flex-shrink-0">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === 'itinerary'
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 hover:text-black'
            }`}
          >
            Day-by-Day Itinerary ({packageData.itinerary.length} Days)
          </button>
          <button
            onClick={() => setActiveTab('inclusions')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === 'inclusions'
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 hover:text-black'
            }`}
          >
            Inclusions & Exclusions
          </button>
          <button
            onClick={() => setActiveTab('stays')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === 'stays'
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 hover:text-black'
            }`}
          >
            Stay & Vehicle Details
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'itinerary' && (
            <div className="space-y-3">
              {packageData.itinerary.map((day) => {
                const isExpanded = expandedDay === day.dayNumber;
                return (
                  <div
                    key={day.dayNumber}
                    className="border border-gray-200 rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleDay(day.dayNumber)}
                      className="w-full p-4 text-left flex items-center justify-between bg-[#FAF9F6] hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                          {day.dayNumber}
                        </span>
                        <div>
                          <h3 className="text-sm font-serif font-bold text-black">{day.title}</h3>
                          <span className="text-xs text-gray-500 font-normal">{day.location}</span>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>

                    {isExpanded && (
                      <div className="p-4 pt-2 text-xs sm:text-sm text-gray-700 bg-white border-t border-gray-100 space-y-3">
                        <p className="leading-relaxed text-gray-600 font-normal">{day.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl text-xs">
                          <div>
                            <span className="font-bold text-black block">🌅 Morning:</span>
                            <span className="text-gray-600">{day.morningActivity}</span>
                          </div>
                          <div>
                            <span className="font-bold text-black block">☀️ Afternoon:</span>
                            <span className="text-gray-600">{day.afternoonActivity}</span>
                          </div>
                          <div>
                            <span className="font-bold text-black block">🌙 Evening:</span>
                            <span className="text-gray-600">{day.eveningActivity}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                          <span>🏨 Stay: <strong className="text-black">{day.stay}</strong></span>
                          <span>🍽️ Meals: <strong className="text-black">{day.mealsIncluded}</strong></span>
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
                  <span>What’s Included</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
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
                  <span>What’s Excluded</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
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
            <div className="space-y-4 text-xs sm:text-sm text-gray-700">
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-gray-200">
                <h3 className="font-serif font-bold text-black mb-1">Handpicked Stays & Houseboats</h3>
                <p className="text-gray-600 leading-relaxed font-normal">
                  We partner directly with boutique properties rated 4.5+ on cleanliness and hospitality. Central heating / electric blankets provided in high altitude mountain stays.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-gray-200">
                <h3 className="font-serif font-bold text-black mb-1">Dedicated Chauffeur & Sanitized Fleet</h3>
                <p className="text-gray-600 leading-relaxed font-normal">
                  Private commercial tourist cab with experienced mountain driver. Includes all fuel, toll taxes, parking fees, driver night allowances, and state permits.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="bg-white border-t border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onStartAIPlanWithPackage(packageData)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-black font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer text-center"
            >
              <AIIcon className="w-3.5 h-3.5 text-black shrink-0" />
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
            onClick={() => onOpenQuoteModal(formattedQuoteSummary)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Get Exact Final Quote</span>
            <ArrowRight className="w-3.5 h-3.5 text-luxury-gold" />
          </button>
        </div>
      </div>
    </div>
  );
};
