import React, { useState } from 'react';
import { 
  Sun, 
  CloudRain, 
  Snowflake, 
  CloudSun, 
  Wind, 
  Calendar, 
  Thermometer, 
  Droplets, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Shirt, 
  Compass, 
  Info,
  ChevronRight,
  Star
} from 'lucide-react';
import { AIIcon } from '../AIIcon';
import { getDestinationWeather, MonthlyWeather, SeasonInfo } from '../../data/destinationsWeather';
import { Destination } from '../../types';

interface SeasonalWeatherWidgetProps {
  destination: Destination;
  onStartAIPlan: (prompt?: string) => void;
  onOpenQuoteModal: (notes?: string) => void;
}

export const SeasonalWeatherWidget: React.FC<SeasonalWeatherWidgetProps> = ({
  destination,
  onStartAIPlan,
  onOpenQuoteModal
}) => {
  const weatherData = getDestinationWeather(destination.slug);
  const currentMonthIndex = new Date().getMonth(); // 0-11
  
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(currentMonthIndex);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(
    weatherData.seasons[0]?.id || 'peak'
  );

  const selectedMonth: MonthlyWeather = weatherData.monthlyData[selectedMonthIndex] || weatherData.monthlyData[0];
  const selectedSeason: SeasonInfo = weatherData.seasons.find(s => s.id === selectedSeasonId) || weatherData.seasons[0];

  // Helper to get weather icon
  const getWeatherIcon = (condition: string, className = "w-4 h-4") => {
    switch (condition) {
      case 'Heavy Snow':
      case 'Snowfall':
        return <Snowflake className={`${className} text-sky-500`} />;
      case 'Monsoon Rain':
      case 'Light Showers':
        return <CloudRain className={`${className} text-blue-500`} />;
      case 'Tropical Breeze':
      case 'Pleasant':
        return <CloudSun className={`${className} text-amber-500`} />;
      case 'Warm & Sunny':
      case 'Sunny':
      default:
        return <Sun className={`${className} text-orange-500`} />;
    }
  };

  // Helper for season badge styling
  const getTagBadgeStyle = (tag: string) => {
    switch (tag) {
      case 'Peak Season':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Winter Wonder':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Shoulder Season':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Best For Adventures':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Value / Monsoon':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <section id="seasonal-weather-widget" className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-8 shadow-xs">
      
      {/* Widget Header & Current Trend Advice Banner */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200/80 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Current Travel & Weather Trends</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-black tracking-tight">
              Best Time to Visit & Seasonal Weather
            </h2>
          </div>

          {/* Overall Best Time summary pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FAF9F6] border border-gray-200 self-start sm:self-auto">
            <Calendar className="w-4 h-4 text-black shrink-0" />
            <div className="text-xs">
              <span className="text-gray-400 font-semibold block text-[10px] uppercase tracking-wider">Overall Recommended</span>
              <span className="font-bold text-black">{destination.bestTime || weatherData.overallBestTime}</span>
            </div>
          </div>
        </div>

        {/* Live Trend Intelligence Callout */}
        <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-5 rounded-2xl space-y-2.5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{weatherData.currentTrendAdvice.status}</span>
            </div>
            <span className="text-xs text-gray-300 font-medium">
              Prime Window: <strong className="text-white">{weatherData.currentTrendAdvice.recommendedMonths}</strong>
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-tight">
            {weatherData.currentTrendAdvice.headline}
          </h3>

          <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed">
            {weatherData.currentTrendAdvice.advice}
          </p>
        </div>
      </div>

      {/* 12-Month Interactive Climate Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-600" />
            <span>Monthly Climate & Crowd Trends (Click month to explore)</span>
          </h3>
          <span className="text-xs text-gray-500 hidden sm:inline-block">
            Current Month: <strong>{weatherData.monthlyData[currentMonthIndex]?.fullName}</strong>
          </span>
        </div>

        {/* 12 Month Grid / Scrollable Cards */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
          {weatherData.monthlyData.map((m, idx) => {
            const isSelected = selectedMonthIndex === idx;
            const isCurrent = currentMonthIndex === idx;

            return (
              <button
                key={m.month}
                type="button"
                onClick={() => setSelectedMonthIndex(idx)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-sm ring-2 ring-black/10 scale-102'
                    : isCurrent
                    ? 'bg-orange-50/80 border-orange-300 text-slate-900 hover:border-orange-400'
                    : 'bg-[#FAF9F6] border-gray-200 text-slate-800 hover:bg-gray-100/80 hover:border-gray-300'
                }`}
              >
                {/* Month Name & Current Badge */}
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold">{m.month}</span>
                  {isCurrent && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-orange-400' : 'bg-orange-500'}`} title="Current Month" />
                  )}
                </div>

                {/* Weather Icon */}
                <div className="my-0.5">
                  {getWeatherIcon(m.condition, "w-4 h-4")}
                </div>

                {/* High / Low Temp */}
                <div className="text-[11px] font-bold leading-tight">
                  <span>{m.tempHigh}°</span>
                  <span className={`text-[9px] font-normal ml-0.5 ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                    {m.tempLow}°
                  </span>
                </div>

                {/* Recommendation Pill */}
                {m.isRecommended ? (
                  <span className={`text-[8px] font-extrabold uppercase px-1 py-0.2 rounded-sm ${
                    isSelected ? 'bg-white/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Ideal
                  </span>
                ) : (
                  <span className={`text-[8px] font-medium uppercase px-1 py-0.2 rounded-sm ${
                    isSelected ? 'text-gray-400' : 'text-gray-400'
                  }`}>
                    {m.condition === 'Monsoon Rain' ? 'Rain' : 'Value'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Month Detailed Breakdown Card */}
        <div className="bg-[#FAF9F6] rounded-2xl p-4 sm:p-5 border border-gray-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm sm:text-base font-serif font-bold text-black">
                {selectedMonth.fullName} in {destination.name}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-700">
                {selectedMonth.condition}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedMonth.crowdLevel.includes('High') 
                  ? 'bg-orange-100 text-orange-800' 
                  : selectedMonth.crowdLevel.includes('Moderate')
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {selectedMonth.crowdLevel} Crowds
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 font-normal leading-relaxed">
              <strong className="text-black font-semibold">Activity Highlight: </strong>
              {selectedMonth.activityHighlight}.
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-6 shrink-0">
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Day / Night</span>
              <div className="text-base font-serif font-bold text-black">
                {selectedMonth.tempHigh}°C <span className="text-xs text-gray-400 font-normal">/ {selectedMonth.tempLow}°C</span>
              </div>
            </div>

            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Rain / Snow</span>
              <div className="text-sm font-bold text-gray-800 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>{selectedMonth.rainfallMm} mm</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onStartAIPlan(`${destination.name} in ${selectedMonth.fullName}`)}
              className="px-3.5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <AIIcon className="w-3 h-3 text-white" />
              <span>Plan for {selectedMonth.month}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Seasonal Deep-Dive Tabbed Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <h3 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-black" />
            <span>Explore by Travel Season</span>
          </h3>

          {/* Season Selector Tabs */}
          <div className="flex items-center flex-wrap gap-1.5">
            {weatherData.seasons.map((season) => (
              <button
                key={season.id}
                type="button"
                onClick={() => setSelectedSeasonId(season.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSeasonId === season.id
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-[#FAF9F6] text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {season.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Season Detailed Card */}
        {selectedSeason && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getTagBadgeStyle(selectedSeason.tag)}`}>
                    {selectedSeason.tag}
                  </span>
                  <div className="flex items-center text-amber-500 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < Math.floor(selectedSeason.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-xs font-bold text-gray-700 ml-1">{selectedSeason.rating}/5</span>
                  </div>
                </div>

                <h4 className="text-xl font-serif font-bold text-black">
                  {selectedSeason.name} <span className="text-sm font-sans font-normal text-gray-500">({selectedSeason.period})</span>
                </h4>
              </div>

              <div className="flex items-center gap-4 bg-[#FAF9F6] px-4 py-2.5 rounded-xl border border-gray-200/80 self-start md:self-auto">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Avg Temperature</span>
                  <span className="text-sm font-bold text-black">{selectedSeason.tempSummary}</span>
                </div>
                <div className="h-6 w-px bg-gray-200" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Best For</span>
                  <span className="text-xs font-bold text-emerald-700">{selectedSeason.idealFor[0]}</span>
                </div>
              </div>
            </div>

            {/* Weather Description */}
            <p className="text-xs sm:text-sm text-gray-600 font-normal leading-relaxed">
              {selectedSeason.weatherDescription}
            </p>

            {/* Key Experiences & Clothing in 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Highlights */}
              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-gray-200/60 space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Signature Experiences this Season</span>
                </div>
                <ul className="space-y-2">
                  {selectedSeason.highlights.map((hl, i) => (
                    <li key={i} className="text-xs text-gray-700 flex items-start gap-2 font-normal">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clothing & Suitability */}
              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-gray-200/60 space-y-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5 mb-1.5">
                    <Shirt className="w-3.5 h-3.5 text-orange-600" />
                    <span>What to Pack & Wear</span>
                  </div>
                  <p className="text-xs text-gray-600 font-normal leading-relaxed">
                    {selectedSeason.clothingAdvice}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                    Recommended Traveler Profiles:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSeason.idealFor.map((profile, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-full bg-white text-gray-700 border border-gray-200 text-[11px] font-medium">
                        {profile}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Seasonal CTA Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-xs text-gray-500 font-normal text-center sm:text-left">
                Ready to travel during <strong className="text-black">{selectedSeason.name}</strong>? Generate a customized itinerary in seconds.
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onStartAIPlan(`${destination.name} during ${selectedSeason.name} (${selectedSeason.period})`)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <AIIcon className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>AI Plan for {selectedSeason.name}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenQuoteModal(`Inquiring about ${destination.name} for ${selectedSeason.name} (${selectedSeason.period})`)}
                  className="px-3.5 py-2.5 rounded-xl border border-gray-200 hover:border-black text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Request Quote
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Destination-Specific Packing Essentials Accordion / Box */}
      {weatherData.packingTips && weatherData.packingTips.length > 0 && (
        <div className="bg-[#FAF9F6] rounded-2xl p-5 border border-gray-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black">
            <Info className="w-4 h-4 text-black" />
            <span>Local Weather & Packing Advisory for {destination.name}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {weatherData.packingTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-600 font-normal">
                <CheckCircle2 className="w-3.5 h-3.5 text-black flex-shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
