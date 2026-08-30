import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Compass, Calendar, ArrowRight } from 'lucide-react';
import { useSanityQuery } from '../../lib/sanity/useSanityQuery';
import { urlFor } from '../../lib/sanity/image';
import { DESTINATION_BY_SLUG_QUERY, PACKAGES_BY_DESTINATION_SLUG_QUERY } from '../../lib/sanity/queries';
import { SanityDestination, SanityTourPackage } from '../../lib/sanity/types';
import { SanityLoadingState, SanityErrorState, SanityEmptyState } from './SanityStateViews';
import { AIIcon } from '../AIIcon';

import { destinationsData } from '../../data/destinationsData';
import { DestinationDetailView } from '../Destinations/DestinationDetailView';

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

  const { data: destination, loading } = useSanityQuery<SanityDestination | null>(
    DESTINATION_BY_SLUG_QUERY,
    { slug }
  );
  const { data: packages } = useSanityQuery<SanityTourPackage[]>(PACKAGES_BY_DESTINATION_SLUG_QUERY, { slug });

  // Normalize slug for aliases (e.g. andaman-nicobar <-> andaman)
  const normalizedSlug = slug === 'andaman-nicobar' ? 'andaman' : slug === 'andaman' ? 'andaman-nicobar' : slug;
  const localDest = destinationsData.find(d => d.slug === slug || d.slug === normalizedSlug);

  if (loading && !localDest) return <SanityLoadingState label="Loading destination…" />;

  // If local destination exists, use the rich DestinationDetailView system
  if (localDest) {
    return (
      <DestinationDetailView
        destination={localDest}
        onBack={() => navigate('/destinations')}
        onSelectPackage={(pkg) => navigate(`/destinations/${localDest.slug}/packages/${pkg.slug}`)}
        onStartAIPlan={onStartAIPlan}
        onOpenQuoteModal={onOpenQuoteModal}
      />
    );
  }

  if (!destination) {
    return (
      <SanityEmptyState
        title="Destination not found"
        description={`No destination with slug "${slug}" exists yet.`}
      />
    );
  }

  const titleWords = destination.title ? destination.title.split(' ') : ['Destination'];

  return (
    <div className="w-full bg-[#FAF9F5] min-h-screen pb-20">
      {/* Hero Visual Section - Curved Bottom with Dark Vignette */}
      <section className="relative w-full bg-[#0F172A] text-white pt-10 pb-20 md:pb-24 overflow-hidden">
        {destination.heroImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={urlFor(destination.heroImage).width(1600).height(900).fit('crop').url()}
              alt={destination.heroImage.alt || destination.title}
              className="w-full h-full object-cover opacity-40 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1329]/90 via-[#0F172A]/70 to-[#0F172A]" />
          </div>
        )}

        <div className="relative z-10 w-full max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-6 pt-4">
          <button
            onClick={() => navigate('/destinations')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Destinations</span>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#1E293B]/80 text-[#E6C687] border border-[#E6C687]/40 shadow-sm backdrop-blur-md">
              <Compass className="w-3.5 h-3.5 text-[#E6C687]" />
              <span>FEATURED DESTINATION</span>
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight leading-tight">
            {titleWords[0]}{' '}
            <span className="text-[#E6A024]">
              {titleWords.slice(1).join(' ')}
            </span>
          </h1>

          {destination.description && (
            <p className="text-gray-200 text-base sm:text-lg max-w-3xl leading-relaxed font-normal">
              {destination.description}
            </p>
          )}
        </div>

        {/* Curved Mask Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#FAF9F5] rounded-t-[50%] z-20" />
      </section>

      {/* Main Content Layout */}
      <div className="w-full max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-6 space-y-16">
        
        {/* HIGHLIGHTS SECTION */}
        {destination.highlights && destination.highlights.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#B8860B]">
                HIGHLIGHTS
              </h2>
              <div className="h-[1px] w-24 bg-[#E6C687]/60" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {destination.highlights.map((hl, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-[#E6E0D4] flex items-start gap-4 shadow-xs hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FFFDF7] border border-[#E6C687] text-[#B8860B] flex items-center justify-center shrink-0 group-hover:bg-[#B8860B] group-hover:text-white transition-colors">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 pt-1">
                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                      {hl}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GALLERY SECTION */}
        {destination.gallery && destination.gallery.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#B8860B]">
                GALLERY
              </h2>
              <div className="h-[1px] w-24 bg-[#E6C687]/60" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {destination.gallery.map((img, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-[#E6E0D4] shadow-xs group">
                  <img
                    src={urlFor(img).width(600).height(450).fit('crop').url()}
                    alt={img.alt || `${destination.title} image ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TOUR PACKAGES SECTION */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#B8860B]">
              TOUR PACKAGES FOR {destination.title.toUpperCase()}
            </h2>
            <div className="h-[1px] w-32 bg-[#E6C687]/60" />
          </div>

          {packages && packages.length > 0 ? (
            <div className="space-y-6">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-white border border-[#E6E0D4] rounded-3xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#FFF8E7] text-[#B8860B] border border-[#E6C687]/60">
                        MOST POPULAR
                      </span>
                      {pkg.duration && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#B8860B]" />
                          <span>{pkg.duration}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                      {pkg.name}
                    </h3>

                    {pkg.price && (
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                          ₹{pkg.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-gray-500 font-normal">/ person</span>
                      </div>
                    )}

                    <Link
                      to="/packages"
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#154238] hover:text-[#0b241e] transition-colors cursor-pointer pt-1"
                    >
                      <span>VIEW IN PACKAGES</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#E6E0D4] rounded-3xl p-8 text-center space-y-4">
              <h3 className="text-xl font-serif font-bold text-slate-900">
                Custom {destination.title} Package Available
              </h3>
              <button
                onClick={() => onOpenQuoteModal(`Custom Tour Request: ${destination.title}`, destination.title)}
                className="px-6 py-3 rounded-full bg-[#154238] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#0f322a] transition-colors cursor-pointer"
              >
                Request Custom Itinerary
              </button>
            </div>
          )}
        </section>

        {/* DUAL ACTION BUTTONS */}
        <section className="pt-4 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <button
              onClick={() => onStartAIPlan(destination.title)}
              className="w-full py-4 px-6 rounded-full bg-[#154238] hover:bg-[#0e2f28] text-white font-bold text-base tracking-wide shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer text-center"
            >
              <AIIcon className="w-5 h-5 text-white shrink-0" />
              <span>Plan {destination.title} with AI</span>
            </button>

            <button
              onClick={() => onOpenQuoteModal(`Booking Request for ${destination.title}`, destination.title)}
              className="w-full py-4 px-6 rounded-full bg-[#D4820A] hover:bg-[#b87007] text-white font-bold text-base tracking-wide shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer text-center"
            >
              <span>Book Now</span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
