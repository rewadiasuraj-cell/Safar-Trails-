import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useSanityQuery } from '../../lib/sanity/useSanityQuery';
import { urlFor } from '../../lib/sanity/image';
import { GUIDE_BY_SLUG_QUERY } from '../../lib/sanity/queries';
import { SanityGuide } from '../../lib/sanity/types';
import { SanityLoadingState, SanityErrorState, SanityEmptyState } from './SanityStateViews';

const formatDate = (iso?: string) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
};

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="text-2xl font-serif font-bold text-slate-900 mt-8 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-serif font-bold text-slate-900 mt-6 mb-2">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-luxury-gold pl-4 my-6 italic text-slate-700">{children}</blockquote>
    ),
    normal: ({ children }) => <p className="text-base text-slate-700 leading-relaxed mb-4">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-700">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-slate-700">{children}</ol>,
  },
  types: {
    image: ({ value }) => (
      <div className="my-6 rounded-xl overflow-hidden bg-gray-100">
        <img src={urlFor(value).width(1200).url()} alt={value.alt || ''} className="w-full h-auto" />
      </div>
    ),
  },
};

export const GuideDetailPage: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: guide, loading, error } = useSanityQuery<SanityGuide | null>(GUIDE_BY_SLUG_QUERY, { slug });

  if (loading) return <SanityLoadingState label="Loading guide…" />;
  if (error) return <SanityErrorState message={error} />;
  if (!guide) {
    return (
      <SanityEmptyState
        title="Guide not found"
        description={`No guide with slug "${slug}" exists yet in the Sanity Studio.`}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="relative w-full h-[40vh] min-h-[280px] max-h-[480px] overflow-hidden bg-gray-100">
        {guide.coverImage && (
          <img
            src={urlFor(guide.coverImage).width(1600).height(900).fit('crop').url()}
            alt={guide.coverImage.alt || guide.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        <button
          onClick={() => navigate('/guides')}
          className="absolute top-6 left-4 sm:left-8 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-black text-xs font-bold uppercase tracking-wide shadow-md cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Guides</span>
        </button>

        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8 max-w-3xl mx-auto w-full">
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight drop-shadow-sm">
            {guide.title}
          </h1>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
          {guide.author && <span className="font-semibold text-slate-800">{guide.author}</span>}
          {guide.publishedDate && <span>{formatDate(guide.publishedDate)}</span>}
          {guide.relatedDestination && (
            <Link
              to={`/destinations/${guide.relatedDestination.slug}`}
              className="inline-flex items-center gap-1 text-luxury-gold font-semibold hover:underline"
            >
              <MapPin className="w-3.5 h-3.5" />
              {guide.relatedDestination.title}
            </Link>
          )}
        </div>

        {guide.body && guide.body.length > 0 ? (
          <PortableText value={guide.body as never} components={portableTextComponents} />
        ) : (
          <p className="text-gray-500 italic">This guide doesn't have any content yet.</p>
        )}
      </div>
    </div>
  );
};
