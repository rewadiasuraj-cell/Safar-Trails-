import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useSanityQuery } from '../../lib/sanity/useSanityQuery';
import { urlFor } from '../../lib/sanity/image';
import { DESTINATION_BY_SLUG_QUERY, PACKAGES_BY_DESTINATION_SLUG_QUERY } from '../../lib/sanity/queries';
import { SanityDestination, SanityTourPackage } from '../../lib/sanity/types';
import { SanityLoadingState, SanityErrorState, SanityEmptyState } from './SanityStateViews';

interface DestinationDetailPageProps {
  onStartAIPlan: (destinationName: string) => void;
  onOpenQuoteModal: (summary?: string, destinationName?: string) => void;
}

export const DestinationDetailPage: React.FC<DestinationDetailPageProps> = ({
  onStartAIPlan,
  onOpenQuoteModal,
}) => {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: destination, loading, error } = useSanityQuery<SanityDestination | null>(
    DESTINATION_BY_SLUG_QUERY,
    { slug }
  );
  const { data: packages } = useSanityQuery<SanityTourPackage[]>(PACKAGES_BY_DESTINATION_SLUG_QUERY, { slug });

  if (loading) return <SanityLoadingState label="Loading destination…" />;
  if (error) return <SanityErrorState message={error} />;
  if (!destination) {
    return (
      <SanityEmptyState
        title="Destination not found"
        description={`No destination with slug "${slug}" exists yet in the Sanity Studio.`}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <div className="relative w-full h-[45vh] min-h-[320px] max-h-[560px] overflow-hidden bg-gray-100">
        {destination.heroImage && (
          <img
            src={urlFor(destination.heroImage).width(1600).height(900).fit('crop').url()}
            alt={destination.heroImage.alt || destination.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        <button
          onClick={() => navigate('/destinations')}
          className="absolute top-6 left-4 sm:left-8 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-black text-xs font-bold uppercase tracking-wide shadow-md cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Destinations</span>
        </button>

        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8 max-w-5xl mx-auto w-full">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight drop-shadow-sm">
            {destination.title}
          </h1>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        {destination.description && (
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-10">
            {destination.description}
          </p>
        )}

        {destination.highlights && destination.highlights.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">Highlights</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {destination.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4.5 h-4.5 text-luxury-gold flex-shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {destination.gallery && destination.gallery.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {destination.gallery.map((img, i) => (
                <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={urlFor(img).width(600).height(450).fit('crop').url()}
                    alt={img.alt || `${destination.title} gallery image ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {packages && packages.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">
              Tour Packages for {destination.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="p-5 rounded-2xl border border-gray-200 hover:border-luxury-gold transition-colors"
                >
                  <div className="font-bold text-slate-900">{pkg.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{pkg.duration}</div>
                  <div className="text-sm font-extrabold text-black mt-2">
                    ₹{pkg.price?.toLocaleString('en-IN')} <span className="font-normal text-gray-500">/ person</span>
                  </div>
                  <Link
                    to="/packages"
                    className="mt-3 inline-block text-xs font-bold uppercase tracking-wide text-deep-emerald hover:underline"
                  >
                    View in Packages →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Row */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={() => onStartAIPlan(destination.title)}
            className="flex-1 py-3.5 rounded-full bg-deep-emerald hover:bg-forest-green text-white font-bold text-sm text-center transition-colors cursor-pointer"
          >
            Plan {destination.title} with AI
          </button>
          <button
            onClick={() => onOpenQuoteModal(`Booking Request: ${destination.title}`, destination.title)}
            className="flex-1 py-3.5 rounded-full bg-warm-orange hover:brightness-95 text-white font-bold text-sm text-center transition-colors cursor-pointer"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
