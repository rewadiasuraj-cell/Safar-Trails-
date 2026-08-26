import React, { useState } from 'react';
import { guidesData } from '../../data/guidesData';
import { TravelGuide } from '../../types';
import { BookOpen, Clock, User, ArrowRight, Search } from 'lucide-react';

interface TravelGuidesSectionProps {
  onSelectGuide: (guide: TravelGuide) => void;
}

export const TravelGuidesSection: React.FC<TravelGuidesSectionProps> = ({
  onSelectGuide
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Best Time', 'Cost Breakdown', 'Itinerary', 'Offbeat'];

  const filteredGuides = guidesData.filter((g) => {
    const matchesCat = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.destinationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="travel-guides-section" className="w-full py-16 lg:py-24 bg-[#FAF9F6] border-t border-gray-200">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-black text-[10px] font-bold uppercase tracking-widest mb-3">
              <BookOpen className="w-3.5 h-3.5 text-black" />
              <span>Editorial Travel Guides & Cost Insights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black tracking-tight">
              SafarTrails Travel Journal
            </h2>
            <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-2xl font-normal">
              Transparent cost breakdowns, month-by-month weather guides, and insider tips written by on-ground destination specialists.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides & costs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black bg-white"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-black'
              }`}
            >
              {cat === 'All' ? 'All Guides' : cat}
            </button>
          ))}
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGuides.map((guide) => (
            <article
              key={guide.slug}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-black shadow-xs transition-all duration-300 flex flex-col justify-between cursor-pointer"
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
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/90 text-white backdrop-blur-xs">
                      {guide.destinationName}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-black shadow-xs">
                      {guide.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3.5 text-gray-200 text-xs flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{guide.readTime}</span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-black group-hover:text-[#FF6B00] transition-colors line-clamp-2 leading-snug">
                    {guide.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed font-normal">
                    {guide.excerpt}
                  </p>
                </div>
              </div>

              {/* Author & Read CTA */}
              <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between mt-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={guide.author.avatar}
                    alt={guide.author.name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-black leading-tight">
                      {guide.author.name}
                    </div>
                    <div className="text-[10.5px] text-gray-400">
                      {guide.publishedDate}
                    </div>
                  </div>
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-black group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

