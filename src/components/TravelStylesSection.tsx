import React from 'react';
import { travelStylesData } from '../data/reviewsAndTrustData';
import { TripType } from '../types';
import { ArrowRight } from 'lucide-react';

interface TravelStylesSectionProps {
  onSelectStyle: (tripType: TripType) => void;
  onExploreStyleWithAI: (styleName: string) => void;
}

export const TravelStylesSection: React.FC<TravelStylesSectionProps> = ({
  onSelectStyle,
  onExploreStyleWithAI
}) => {
  return (
    <section id="travel-styles-section" className="w-full py-16 lg:py-24 bg-[#FAF9F6]">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-widest mb-3">
            <span>Tailored For Every Traveler</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-black tracking-tight">
            Find Your Travel Style
          </h2>
          <p className="mt-2 text-gray-500 text-sm sm:text-base font-normal">
            Whether it’s a romantic candlelit houseboat in Kashmir or an adrenaline-filled river rafting circuit in Rishikesh.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {travelStylesData.map((style) => (
            <div
              key={style.id}
              className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-gray-200/80 flex flex-col justify-end h-80 cursor-pointer"
              onClick={() => onSelectStyle(style.tripType)}
            >
              {/* Background Image */}
              <img
                src={style.image}
                alt={style.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

              {/* Content Overlay */}
              <div className="relative z-10 p-6 text-white space-y-2">
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black text-white uppercase tracking-wider mb-1 border border-white/20">
                  {style.tripType}
                </div>
                <h3 className="text-2xl font-serif font-bold">
                  {style.name}
                </h3>
                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                  {style.tagline}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-gray-200 group-hover:text-white uppercase tracking-wider transition-colors">
                  <span>Explore Packages</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

