import React, { useState } from 'react';
import { MapPin, Users, Calendar, ChevronDown, ArrowRight } from 'lucide-react';
import { AIIcon } from './AIIcon';
import { trackAIPlanRequested } from '../lib/analytics';

interface AIPlannerTeaserProps {
  onStartAIPlan: (promptText?: string) => void;
}

const DURATION_OPTIONS = ['Trip duration', '3-4 Days', '5-7 Days', '8-10 Days', '10+ Days'];

/**
 * The planner search, which used to be a banner that only said the planner
 * existed.
 *
 * It was a single blue bar reading "Plan My Trip with AI" with an arrow - a
 * link dressed as a feature. The three fields it now carries came from under
 * the hero, where they duplicated this section's job: the page had a
 * "Where to?" bar and, one scroll later, a button that opened the same
 * planner.
 *
 * The fields are optional. Submitting empty opens the planner with nothing
 * prefilled, which is the same as the old banner did, so nothing is lost for
 * someone who just wants to click through.
 */
export const AIPlannerTeaser: React.FC<AIPlannerTeaserProps> = ({ onStartAIPlan }) => {
  const [destination, setDestination] = useState('');
  const [travelers, setTravelers] = useState('');
  const [duration, setDuration] = useState('');

  const handleGenerate = () => {
    trackAIPlanRequested(destination || 'unspecified');
    if (!destination && !travelers && !duration) {
      onStartAIPlan();
      return;
    }
    const parts: string[] = [`Plan a trip${destination ? ` to ${destination}` : ''}`];
    if (travelers) parts.push(`for ${travelers} traveller${travelers === '1' ? '' : 's'}`);
    if (duration) parts.push(`for ${duration}`);
    onStartAIPlan(parts.join(' '));
  };

  return (
    <section id="ai-planner-teaser" className="w-full bg-white py-12 sm:py-16">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="relative overflow-hidden rounded-3xl bg-light-blue border border-[#D9E6F0] px-5 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D9E6F0] text-[10px] font-extrabold uppercase tracking-widest text-gold-ink">
              <AIIcon className="w-3.5 h-3.5 text-deep-emerald" aria-hidden="true" />
              <span>Smart AI Trip Planner</span>
            </span>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-stone-900 tracking-tight leading-tight">
              Where do you want to go?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-stone-700 leading-relaxed max-w-xl">
              Tell us the place, the group and roughly how long. You get a day-wise
              itinerary in seconds, and a destination specialist checks it before it
              reaches you.
            </p>
          </div>

          <div className="mt-7 sm:mt-8 bg-white rounded-2xl sm:rounded-[1.75rem] border border-[#D9E6F0] shadow-lg p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto] gap-2.5 lg:gap-0 lg:divide-x lg:divide-[#D9E6F0]">
              <div className="relative lg:pr-4">
                <label htmlFor="ai-destination" className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1 pl-10 lg:pl-9">
                  Where to?
                </label>
                <MapPin className="absolute left-3.5 lg:left-3 bottom-2.5 w-4 h-4 text-stone-500 pointer-events-none" aria-hidden="true" />
                <input
                  id="ai-destination"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Kashmir, Kerala, Ladakh…"
                  className="w-full pl-10 lg:pl-9 pr-3 py-1.5 bg-transparent text-sm text-stone-900 placeholder:text-stone-500 focus:outline-none"
                />
              </div>

              <div className="relative lg:px-4">
                <label htmlFor="ai-travelers" className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1 pl-10 lg:pl-11">
                  Travellers
                </label>
                <Users className="absolute left-3.5 lg:left-7 bottom-2.5 w-4 h-4 text-stone-500 pointer-events-none" aria-hidden="true" />
                <input
                  id="ai-travelers"
                  type="number"
                  min={1}
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  placeholder="Add guests"
                  className="w-full pl-10 lg:pl-11 pr-3 py-1.5 bg-transparent text-sm text-stone-900 placeholder:text-stone-500 focus:outline-none"
                />
              </div>

              <div className="relative lg:px-4">
                <label htmlFor="ai-duration" className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1 pl-10 lg:pl-11">
                  Duration
                </label>
                <Calendar className="absolute left-3.5 lg:left-7 bottom-2.5 w-4 h-4 text-stone-500 pointer-events-none z-10" aria-hidden="true" />
                <select
                  id="ai-duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full pl-10 lg:pl-11 pr-8 py-1.5 bg-transparent text-sm text-stone-900 focus:outline-none appearance-none cursor-pointer"
                >
                  {DURATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt === 'Trip duration' ? '' : opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 bottom-2.5 w-4 h-4 text-stone-500 pointer-events-none" aria-hidden="true" />
              </div>

              <div className="lg:pl-4 flex items-end">
                <button
                  id="ai-generate-itinerary-btn"
                  type="button"
                  onClick={handleGenerate}
                  className="w-full lg:w-auto bg-deep-emerald hover:bg-forest-green text-white px-6 py-3 rounded-xl sm:rounded-2xl lg:rounded-full transition-colors cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <AIIcon className="w-4 h-4 text-white shrink-0" aria-hidden="true" />
                  <span className="font-bold text-sm">Generate AI Itinerary</span>
                  <ArrowRight className="w-4 h-4 text-white shrink-0" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
