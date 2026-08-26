import React from 'react';
import { TravelGuide, Package } from '../../types';
import { packagesData } from '../../data/packagesData';
import { AIIcon } from '../AIIcon';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Share2, 
  MessageCircle,
  ArrowRight
} from 'lucide-react';

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
  // Find related packages
  const relatedPackages = packagesData.filter((p) =>
    guide.relatedPackageSlugs?.includes(p.slug) ||
    p.destination.toLowerCase() === guide.destinationName.toLowerCase()
  );

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Hi SafarTrails! I just read your guide "${guide.title}". Can you help me plan this trip?`);
    window.open(`https://wa.me/918076665782?text=${text}`, '_blank');
  };

  return (
    <article id="travel-guide-article-page" className="pt-20 pb-24 bg-[#FAF9F6]">
      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-gray-200 py-3.5">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:opacity-70 transition-opacity cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Travel Guides</span>
          </button>

          <div className="text-xs text-gray-400 hidden sm:flex items-center gap-1.5 font-medium">
            <span>Guides</span>
            <span>/</span>
            <span>{guide.destinationName}</span>
            <span>/</span>
            <span className="font-bold text-black truncate max-w-xs">{guide.title}</span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 pt-10 pb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-black text-white uppercase tracking-widest">
            {guide.category}
          </span>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-gray-200 text-black uppercase tracking-widest">
            {guide.destinationName}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black tracking-tight leading-[1.15]">
          {guide.title}
        </h1>

        {guide.subtitle && (
          <p className="mt-4 text-lg sm:text-xl text-gray-500 font-normal leading-relaxed">
            {guide.subtitle}
          </p>
        )}

        {/* Author Bio Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={guide.author.avatar}
              alt={guide.author.name}
              className="w-12 h-12 rounded-full object-cover border border-gray-300"
            />
            <div>
              <div className="text-sm font-bold text-black">{guide.author.name}</div>
              <div className="text-xs text-gray-400 font-medium">{guide.author.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{guide.publishedDate}</span>
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
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 mb-10">
        <div className="rounded-2xl overflow-hidden shadow-xs h-[360px] sm:h-[460px] border border-gray-200">
          <img
            src={guide.heroImage}
            alt={guide.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Content Sections */}
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-10 space-y-8">
        {/* Intro Excerpt */}
        <p className="text-lg sm:text-xl text-black font-serif leading-relaxed italic border-l-2 border-black pl-4">
          "{guide.excerpt}"
        </p>

        {guide.contentSections.map((sec, idx) => (
          <section key={idx} className="space-y-4 pt-4">
            <h2 className="text-2xl font-serif font-bold text-black tracking-tight">
              {sec.heading}
            </h2>
            <p className="text-gray-700 text-base leading-relaxed font-normal">
              {sec.content}
            </p>

            {sec.bulletPoints && sec.bulletPoints.length > 0 && (
              <ul className="space-y-2 bg-white p-5 rounded-2xl border border-gray-200 text-sm text-gray-700 font-normal">
                {sec.bulletPoints.map((bp, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-black font-bold text-base">•</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            )}

            {sec.highlightQuote && (
              <div className="p-4 rounded-xl bg-gray-100 text-black text-sm font-semibold border-l-2 border-black">
                💡 {sec.highlightQuote}
              </div>
            )}
          </section>
        ))}

        {/* Embedded Interactive AI CTA Box */}
        <div className="my-10 bg-[#0A0A0A] text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-800 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest">
            <AIIcon className="w-3.5 h-3.5 text-white" />
            <span>Interactive Custom Planner</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-white tracking-tight">
            Inspired to visit {guide.destinationName}?
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl font-normal">
            Get an instant customized {guide.destinationName} day-by-day plan tailored to your group size and budget.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onStartAIPlan(guide.destinationName)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors shadow-xs text-center"
            >
              <AIIcon className="w-4 h-4 text-black shrink-0" />
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

        {/* Related Packages */}
        {relatedPackages.length > 0 && (
          <div className="pt-8 border-t border-gray-200">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-black mb-6 tracking-tight">
              Recommended Holiday Packages for {guide.destinationName}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:border-black transition-all flex flex-col justify-between"
                >
                  <div className="relative h-40">
                    <img src={pkg.heroImage} alt={pkg.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/80 text-white backdrop-blur-xs">
                      {pkg.durationDays}D / {pkg.durationNights}N
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-serif font-bold text-sm text-black line-clamp-1">{pkg.title}</h4>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs font-black text-black">
                        ₹{pkg.startingPrice.toLocaleString('en-IN')}/person
                      </span>
                      <button
                        onClick={() => onSelectPackage(pkg)}
                        className="text-xs font-bold uppercase tracking-wider text-black hover:underline cursor-pointer"
                      >
                        View Package →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
