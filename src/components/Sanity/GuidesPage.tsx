import React from 'react';
import { BookOpen, MapPin } from 'lucide-react';
import { useSanityQuery } from '../../lib/sanity/useSanityQuery';
import { urlFor } from '../../lib/sanity/image';
import { GUIDES_QUERY } from '../../lib/sanity/queries';
import { SanityGuide } from '../../lib/sanity/types';
import { SanityLoadingState, SanityErrorState, SanityEmptyState } from './SanityStateViews';

interface GuidesPageProps {
  onSelectGuide: (slug: string) => void;
}

const formatDate = (iso?: string) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
};

export const GuidesPage: React.FC<GuidesPageProps> = ({ onSelectGuide }) => {
  const { data, loading, error } = useSanityQuery<SanityGuide[]>(GUIDES_QUERY);
  const guides = data || [];

  return (
    <section id="guides-section" className="w-full py-16 lg:py-24 bg-[#FAF9F6]">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-widest mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Travel Guides</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-black tracking-tight">Guides & Insights</h2>
          <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-2xl">
            Expert tips and itineraries, managed from our Sanity Studio.
          </p>
        </div>

        {loading && <SanityLoadingState label="Loading guides…" />}
        {!loading && error && <SanityErrorState message={error} />}
        {!loading && !error && guides.length === 0 && (
          <SanityEmptyState
            title="No guides yet"
            description="Add a Guide document in the Sanity Studio and it will show up here automatically."
          />
        )}

        {!loading && !error && guides.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <button
                key={guide._id}
                onClick={() => onSelectGuide(guide.slug)}
                className="text-left group bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-black/30 shadow-xs hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {guide.coverImage && (
                    <img
                      src={urlFor(guide.coverImage).width(700).height(500).fit('crop').url()}
                      alt={guide.coverImage.alt || guide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="p-5">
                  {guide.relatedDestination && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#FF6B00] mb-1.5">
                      <MapPin className="w-3 h-3" />
                      <span>{guide.relatedDestination.title}</span>
                    </div>
                  )}
                  <h3 className="font-serif font-bold text-lg text-slate-900 leading-snug">{guide.title}</h3>
                  <div className="mt-2 text-xs text-gray-500 font-medium">
                    {guide.author && <span>{guide.author}</span>}
                    {guide.author && guide.publishedDate && <span> • </span>}
                    {guide.publishedDate && <span>{formatDate(guide.publishedDate)}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
