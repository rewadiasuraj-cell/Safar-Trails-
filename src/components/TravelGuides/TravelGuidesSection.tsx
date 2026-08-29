import React, { useState } from 'react';
import { guidesData } from '../../data/guidesData';
import { TravelGuide } from '../../types';
import { Clock, ArrowRight, Search } from 'lucide-react';

interface TravelGuidesSectionProps {
  onSelectGuide: (guide: TravelGuide) => void;
}

export const TravelGuidesSection: React.FC<TravelGuidesSectionProps> = ({
  onSelectGuide
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuides = guidesData.filter((g) => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.destinationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <section id="travel-guides-section" className="w-full py-12 lg:py-20 bg-[#FAF9F6] border-t border-gray-200">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Section Header with Single Clean Heading and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-gray-200 pb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight">
              Travel Guides & Blogs
            </h1>
            <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl font-normal">
              Insider insights, transparent cost breakdowns, and seasonal tips curated by on-ground destination specialists.
            </p>
          </div>

          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blogs & travel guides..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none focus:border-[#FF6B00] bg-white shadow-xs"
            />
          </div>
        </div>

        {/* Guides Grid */}
        {filteredGuides.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 text-sm font-medium">No guides or blogs found matching "{searchQuery}".</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 px-4 py-1.5 text-xs font-semibold text-[#FF6B00] hover:underline"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide) => (
              <article
                key={guide.slug}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#FF6B00] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
                onClick={() => onSelectGuide(guide)}
              >
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={guide.heroImage}
                      alt={guide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-black/80 text-white backdrop-blur-xs">
                        {guide.destinationName}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3.5 text-gray-200 text-xs flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{guide.readTime}</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900 group-hover:text-[#FF6B00] transition-colors line-clamp-2 leading-snug">
                      {guide.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
                      {guide.excerpt}
                    </p>
                  </div>
                </div>

                {/* Read CTA */}
                <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-end mt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 group-hover:text-[#FF6B00] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

