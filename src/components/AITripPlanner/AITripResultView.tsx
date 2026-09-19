import React, { useState } from 'react';
import { WhatsAppIcon } from '../WhatsAppIcon';
import { AIIcon } from '../AIIcon';
import { 
  Calendar, 
  MapPin, 
  Users, 
  IndianRupee, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Hotel, 
  Car, 
  Share2, 
  Printer, 
  MessageCircle, 
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { openWhatsApp } from '../../lib/contact';
import { AITripPlanResult } from '../../types';

interface AITripResultViewProps {
  plan: AITripPlanResult;
  onReset: () => void;
  onOpenQuoteModal: (summary?: string) => void;
}

export const AITripResultView: React.FC<AITripResultViewProps> = ({
  plan,
  onReset,
  onOpenQuoteModal
}) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const toggleDay = (dayNum: number) => {
    setExpandedDay(expandedDay === dayNum ? null : dayNum);
  };

  const handleWhatsAppShare = () => {
    const summaryText = `*SafarTrails AI Itinerary: ${plan.title}*\n` +
      `📍 Destination: ${plan.destination}\n` +
      `⏱️ Duration: ${plan.durationDays} Days / ${plan.durationNights} Nights\n` +
      `👥 Travellers: ${plan.travellersCount} (${plan.tripType})\n` +
      `💰 Estimated Starting Price: ₹${plan.estimatedBudget.min.toLocaleString('en-IN')} – ₹${plan.estimatedBudget.max.toLocaleString('en-IN')} total (approx. ₹${plan.estimatedBudget.perPerson.toLocaleString('en-IN')}/person)\n\n` +
      `Please connect me with a Destination Specialist to finalize hotel choices and lock this package!`;

    openWhatsApp(summaryText, 'ai_planner_result', plan.destination);
  };

  const handlePrint = () => {
    window.print();
  };

  const formattedSummary = `${plan.destination} (${plan.durationDays}D/${plan.durationNights}N) for ${plan.travellersCount} guests [${plan.hotelCategory} + ${plan.transportType}]`;

  return (
    <div id="ai-trip-plan-result" className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
      {/* Top Banner Header */}
      <div className="bg-[#1C1917] p-6 sm:p-8 md:p-10 text-white relative border-b border-stone-800">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-stone-300 text-xs font-bold uppercase tracking-widest backdrop-blur-xs">
            <AIIcon className="w-3.5 h-3.5 text-white" />
            <span>AI Customized Plan #{plan.planId}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Modify Details</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 transition-colors cursor-pointer"
              title="Print Itinerary"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight text-white">
          {plan.title}
        </h2>
        <p className="mt-3 text-stone-400 text-sm sm:text-base max-w-3xl leading-relaxed font-normal">
          {plan.summary}
        </p>

        {/* Quick Spec Pills */}
        <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3 text-xs font-semibold">
          <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs flex items-center gap-1.5 text-stone-200">
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            <span>{plan.destination}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs flex items-center gap-1.5 text-stone-200">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>{plan.durationDays} Days / {plan.durationNights} Nights</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs flex items-center gap-1.5 text-stone-200">
            <Users className="w-3.5 h-3.5 text-stone-400" />
            <span>{plan.travellersCount} Travellers ({plan.tripType})</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs flex items-center gap-1.5 text-stone-200">
            <Hotel className="w-3.5 h-3.5 text-stone-400" />
            <span>{plan.hotelCategory}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs flex items-center gap-1.5 text-stone-200">
            <Car className="w-3.5 h-3.5 text-stone-400" />
            <span>{plan.transportType}</span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 md:p-10 space-y-10">
        {/* Estimated Pricing Card */}
        <div className="bg-[#FAF9F6] border border-stone-200 rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>Indicative Package Estimate (Excluding Airfare)</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                ₹{plan.estimatedBudget.min.toLocaleString('en-IN')} – ₹{plan.estimatedBudget.max.toLocaleString('en-IN')}
                <span className="text-xs sm:text-sm font-normal text-stone-500 ml-2">
                  Total for {plan.travellersCount} guests
                </span>
              </div>
            </div>

            <div className="bg-white px-4 py-2.5 rounded-xl border border-stone-200 shadow-xs self-start md:self-auto">
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Approx. Per Person</div>
              <div className="text-lg font-black text-black">
                ₹{plan.estimatedBudget.perPerson.toLocaleString('en-IN')} <span className="text-xs font-normal text-stone-500">/ person</span>
              </div>
            </div>
          </div>

          {/* Cost Breakdown Grid */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-stone-200">
              <span className="text-stone-400 text-[11px] font-bold uppercase tracking-wider block">Stays & Resorts</span>
              <span className="text-sm font-bold text-black mt-1 block">~₹{plan.estimatedBudget.breakdown.hotels.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-stone-200">
              <span className="text-stone-400 text-[11px] font-bold uppercase tracking-wider block">Cab & Chauffeur</span>
              <span className="text-sm font-bold text-black mt-1 block">~₹{plan.estimatedBudget.breakdown.transport.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-stone-200">
              <span className="text-stone-400 text-[11px] font-bold uppercase tracking-wider block">Sightseeing & Permits</span>
              <span className="text-sm font-bold text-black mt-1 block">~₹{plan.estimatedBudget.breakdown.sightseeingAndPermits.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-stone-200">
              <span className="text-stone-400 text-[11px] font-bold uppercase tracking-wider block">Meals & Guide</span>
              <span className="text-sm font-bold text-black mt-1 block">~₹{plan.estimatedBudget.breakdown.foodAndMisc.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-stone-500">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{plan.disclaimer}</span>
          </div>
        </div>

        {/* Day-by-Day Timeline */}
        <div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-black mb-6 flex items-center gap-2">
            <span>Day-by-Day Itinerary</span>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800">
              {plan.durationDays} Days
            </span>
          </h3>

          <div className="space-y-4">
            {plan.itinerary.map((day) => {
              const isExpanded = expandedDay === day.dayNumber;
              return (
                <div
                  key={day.dayNumber}
                  className={`border rounded-2xl transition-all overflow-hidden ${
                    isExpanded ? 'border-black/30 shadow-xs bg-white' : 'border-stone-200 bg-[#FAF9F6]'
                  }`}
                >
                  <button
                    onClick={() => toggleDay(day.dayNumber)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {day.dayNumber}
                      </span>
                      <div>
                        <h4 className="text-sm sm:text-base font-serif font-bold text-black">
                          {day.title}
                        </h4>
                        <span className="text-xs text-stone-500 font-normal">
                          {day.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-stone-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-stone-100 text-sm text-stone-700 space-y-4 animate-in fade-in duration-200">
                      <p className="text-stone-600 leading-relaxed font-normal">
                        {day.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 p-3.5 rounded-xl text-xs">
                        {day.morningActivity && (
                          <div>
                            <span className="font-bold text-black block mb-0.5">🌅 Morning</span>
                            <span className="text-stone-600">{day.morningActivity}</span>
                          </div>
                        )}
                        {day.afternoonActivity && (
                          <div>
                            <span className="font-bold text-black block mb-0.5">☀️ Afternoon</span>
                            <span className="text-stone-600">{day.afternoonActivity}</span>
                          </div>
                        )}
                        {day.eveningActivity && (
                          <div>
                            <span className="font-bold text-black block mb-0.5">🌙 Evening</span>
                            <span className="text-stone-600">{day.eveningActivity}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-stone-500">Stay: <strong className="text-black">{day.stay}</strong></span>
                          {day.mealsIncluded && (
                            <span className="font-semibold text-stone-500">• Meals: <strong className="text-black">{day.mealsIncluded}</strong></span>
                          )}
                        </div>

                        {day.insiderTip && (
                          <div className="text-[11.5px] text-stone-800 bg-stone-100 px-2.5 py-1 rounded-md">
                            💡 <strong>Tip:</strong> {day.insiderTip}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Highlights & Inclusions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="bg-[#FAF9F6] rounded-2xl p-5 border border-stone-200">
            <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Standard Package Inclusions</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-600 font-normal">
              {plan.includedHighlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#FAF9F6] rounded-2xl p-5 border border-stone-200">
            <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>Specialist Tips & Packing Advice</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-600 font-normal">
              {plan.expertTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-black font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Conversion Action Bar */}
        <div className="bg-[#1C1917] rounded-2xl p-6 sm:p-8 text-white flex flex-col lg:flex-row items-center justify-between gap-6 border border-stone-800">
          <div>
            <div className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mb-1">
              Ready to Lock Your Dates?
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Get an exact finalized quote with hotel room photos
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl font-normal">
              A dedicated SafarTrails destination specialist will review your plan, verify live room availability, and assist with customization on WhatsApp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => onOpenQuoteModal(formattedSummary)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-stone-200 text-black font-bold text-xs uppercase tracking-wider shadow-md transition-all text-center cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Get Final Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-whatsapp hover:bg-whatsapp-hover text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <WhatsAppIcon className="w-4.5 h-4.5" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
