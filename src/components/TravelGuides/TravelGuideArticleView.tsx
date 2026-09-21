import React, { useState } from 'react';
import { TravelGuide, Package } from '../../types';
import { packagesData } from '../../data/packagesData';
import { AIIcon } from '../AIIcon';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Search,
  Sparkles,
  Info,
  Send
} from 'lucide-react';
import { formatPublishedDate } from '../../lib/seo/textUtils';
import { openWhatsApp } from '../../lib/contact';
import { GST_NOTE } from '../../lib/seo/siteConfig';

interface TravelGuideArticleViewProps {
  guide: TravelGuide;
  onBack: () => void;
  onSelectPackage: (pkg: Package) => void;
  onStartAIPlan: (destinationName: string) => void;
  onOpenQuoteModal: (summary?: string) => void;
}

export const TravelGuideArticleView: React.FC<TravelGuideArticleViewProps> = ({
  guide,
  onBack,
  onSelectPackage,
  onStartAIPlan,
  onOpenQuoteModal
}) => {
  const [quickSearch, setQuickSearch] = useState('');

  // Find Category Related Packages matching destination or category tags
  const categoryRelatedPackages = packagesData.filter((p) =>
    guide.relatedPackageSlugs?.includes(p.slug) ||
    p.destination.toLowerCase() === guide.destinationName.toLowerCase() ||
    p.state.toLowerCase() === guide.destinationName.toLowerCase()
  );

  const displayPackages = categoryRelatedPackages.length > 0 
    ? categoryRelatedPackages 
    : packagesData.slice(0, 4);

  const handleWhatsAppShare = () =>
    openWhatsApp(
      `Hi Safar Trails! I just read your guide "${guide.title}". Can you help me plan this trip?`,
      'guide_article',
      guide.destinationName,
    );

  return (
    <article id="travel-guide-article-page" className="w-full pt-16 pb-24 bg-[#F2F8FC]">
      {/* Top Navigation & Search Bar */}
      <div className="w-full bg-white border-b border-stone-200 py-3.5 sticky top-16 z-20 shadow-2xs">
        <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-luxury-gold transition-colors cursor-pointer self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Blogs & Guides</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onBack();
                  }
                }}
                placeholder="Search blogs..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-luxury-gold bg-stone-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Article Header - ONLY ONE SINGLE HEADING */}
      <header className="w-full max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex items-center gap-2 text-xs text-luxury-gold font-bold uppercase tracking-wider mb-3">
          <span>{guide.destinationName} Travel Guide</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-[1.2]">
          {guide.title}
        </h1>

        {/* Author Bio & Date Bar */}
        <div className="mt-6 pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* object-cover is right for the portrait photos some guides use, but it
                crops anything wide to its middle: /logo.svg is a 200x40 wordmark and
                rendered here as an unreadable sliver of "TRAVEL WITH TRUST". The
                brand-marked guides now point at the square /favicon.svg instead, and
                avatars are expected to be square. bg-white backs the transparent SVG. */}
            <img
              src={guide.author.avatar}
              alt={guide.author.name}
              className="w-11 h-11 rounded-full object-cover bg-white border border-stone-300"
            />
            <div>
              <div className="text-sm font-bold text-stone-900">{guide.author.name}</div>
              <div className="text-xs text-stone-500 font-medium">{guide.author.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-stone-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatPublishedDate(guide.publishedDate)}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{guide.readTime}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="w-full max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="rounded-2xl overflow-hidden shadow-xs h-[340px] sm:h-[440px] border border-stone-200">
          <img
            src={guide.heroImage}
            alt={guide.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Content Sections */}
      <div className="w-full max-w-3xl xl:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Intro Excerpt */}
        <p className="text-lg sm:text-xl text-stone-800 font-serif leading-relaxed italic border-l-3 border-luxury-gold pl-4">
          "{guide.excerpt}"
        </p>

        {guide.contentSections.map((sec, idx) => (
          <section key={idx} className="space-y-4 pt-2">
            <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
              {sec.heading}
            </h2>
            <p className="text-stone-700 text-base leading-relaxed font-normal">
              {sec.content}
            </p>

            {sec.bulletPoints && sec.bulletPoints.length > 0 && (
              <ul className="space-y-2 bg-white p-5 rounded-2xl border border-stone-200 text-sm text-stone-700 font-normal shadow-2xs">
                {sec.bulletPoints.map((bp, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-luxury-gold font-bold text-base">•</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            )}

            {sec.highlightQuote && (
              <div className="p-4 rounded-xl bg-orange-50/70 text-stone-900 text-sm font-semibold border-l-3 border-luxury-gold">
                💡 {sec.highlightQuote}
              </div>
            )}
          </section>
        ))}

        {/* Embedded Interactive AI Trip Planner Box */}
        <div className="my-10 bg-stone-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-800 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest">
            <AIIcon className="w-3.5 h-3.5 text-white" />
            <span>Interactive Trip Planner</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
            Inspired to visit {guide.destinationName}?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl font-normal">
            Get an instant custom {guide.destinationName} day-by-day itinerary tailored to your group size, budget, and travel preferences.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onStartAIPlan(guide.destinationName)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-accent-ink text-white font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer hover:bg-[#9A3412] transition-colors shadow-xs text-center"
            >
              <Sparkles className="w-4 h-4 text-white shrink-0" />
              <span className="whitespace-nowrap">Plan {guide.destinationName} Itinerary</span>
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer transition-colors text-center"
            >
              <span>Ask Specialist on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Category Related Packages Section */}
        <div className="pt-10 border-t border-stone-200">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              Category Related Packages
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Handcrafted tour packages matching {guide.destinationName} and related holiday experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {displayPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-luxury-gold transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img 
                      src={pkg.heroImage} 
                      alt={pkg.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/80 text-white backdrop-blur-xs">
                      {pkg.durationDays}D / {pkg.durationNights}N
                    </span>
                    <span className="absolute bottom-3 left-3 text-white text-xs font-bold">
                      {pkg.hotelCategory}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-serif font-bold text-base text-stone-900 line-clamp-2 leading-snug">
                      {pkg.title}
                    </h3>
                    <div className="text-sm font-black text-stone-900">
                      ₹{pkg.startingPrice.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-stone-500">/ person {GST_NOTE}</span>
                    </div>
                  </div>
                </div>

                {/* 2 CTA Buttons: More Info & Book Now */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className="py-2.5 px-3 rounded-xl border border-stone-200 text-stone-800 font-bold text-xs uppercase tracking-wider hover:border-black hover:bg-stone-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-stone-600" />
                    <span>More Info</span>
                  </button>
                  <button
                    onClick={() => onOpenQuoteModal(`Booking Inquiry: ${pkg.title} (${pkg.durationDays}D/${pkg.durationNights}N - ₹${pkg.startingPrice})`)}
                    className="py-2.5 px-3 rounded-xl bg-accent-ink text-white font-bold text-xs uppercase tracking-wider hover:bg-[#9A3412] transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default TravelGuideArticleView;
