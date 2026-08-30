import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle2, XCircle, Plane, Train, Car } from 'lucide-react';
import { useSanityQuery } from '../../lib/sanity/useSanityQuery';
import { urlFor } from '../../lib/sanity/image';
import { PACKAGE_BY_SLUG_QUERY } from '../../lib/sanity/queries';
import { SanityTourPackage } from '../../lib/sanity/types';
import { SanityLoadingState, SanityErrorState, SanityEmptyState } from './SanityStateViews';

import { packagesData } from '../../data/packagesData';

interface PackageDetailPageProps {
  slug?: string;
  onOpenQuoteModal: (summary?: string, destinationName?: string) => void;
}

function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    if (!title && !description) return;
    const prevTitle = document.title;
    if (title) document.title = title;

    let descTag: HTMLMetaElement | null = null;
    let prevDescription: string | null = null;
    if (description) {
      descTag = document.querySelector('meta[name="description"]');
      if (descTag) {
        prevDescription = descTag.getAttribute('content');
        descTag.setAttribute('content', description);
      }
    }

    return () => {
      document.title = prevTitle;
      if (descTag && prevDescription !== null) descTag.setAttribute('content', prevDescription);
    };
  }, [title, description]);
}

export const PackageDetailPage: React.FC<PackageDetailPageProps> = ({ slug: propSlug, onOpenQuoteModal }) => {
  const routerParams = useParams<{ slug: string }>();
  const slug = propSlug || routerParams.slug || '';
  const navigate = useNavigate();

  const { data: sanityPkg, loading, error } = useSanityQuery<SanityTourPackage | null>(PACKAGE_BY_SLUG_QUERY, { slug });
  const staticFallback = packagesData.find(p => p.slug === slug);

  const pkg: SanityTourPackage | null = sanityPkg || (staticFallback ? {
    _id: staticFallback.id,
    _type: 'tourPackage',
    name: staticFallback.title,
    slug: { _type: 'slug', current: staticFallback.slug },
    destination: { _id: 'dest-1', _type: 'destination', title: staticFallback.destination, slug: { _type: 'slug', current: staticFallback.destination.toLowerCase().replace(/[^a-z0-9]+/g, '-') } },
    priceFrom: staticFallback.startingPrice,
    duration: `${staticFallback.durationDays} Days / ${staticFallback.durationNights} Nights`,
    tagline: staticFallback.overview,
    seoTitle: staticFallback.title,
    seoDescription: staticFallback.overview,
    images: [{ _type: 'image', asset: { _ref: staticFallback.heroImage, _type: 'reference' }, alt: staticFallback.title }],
    highlights: staticFallback.highlights,
    inclusions: staticFallback.inclusions,
    exclusions: staticFallback.exclusions,
    itinerary: staticFallback.itinerary.map(i => ({
      _key: `day-${i.dayNumber}`,
      dayNumber: i.dayNumber,
      title: i.title,
      description: i.description,
      overnightStay: i.stay,
    })),
  } as unknown as SanityTourPackage : null);

  usePageMeta(pkg?.seoTitle, pkg?.seoDescription);

  if (loading && !pkg) return <SanityLoadingState label="Loading package…" />;
  if (error && !pkg) return <SanityErrorState message={error} />;
  if (!pkg) {
    return (
      <SanityEmptyState
        title="Package not found"
        description={`No tour package with slug "${slug}" exists yet in the Sanity Studio.`}
      />
    );
  }

  const dhamsSummary = pkg.stopsCovered && pkg.stopsCovered.length > 0
    ? pkg.stopsCovered.map((s) => s.name).join(', ')
    : pkg.destination?.title;

  const requestQuote = (summary: string) => onOpenQuoteModal(summary, pkg.destination?.title || pkg.name);

  const heroImgAsset = pkg.images?.[0]?.asset as unknown as { _ref?: string } | undefined;
  const heroImgUrl = heroImgAsset?._ref && heroImgAsset._ref.startsWith('http')
    ? heroImgAsset._ref
    : (pkg.images && pkg.images[0] ? urlFor(pkg.images[0]).width(1600).height(900).fit('crop').url() : 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop');

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <div className="relative w-full h-[45vh] min-h-[320px] max-h-[560px] overflow-hidden bg-gray-100">
        {heroImgUrl && (
          <img
            src={heroImgUrl}
            alt={pkg.images?.[0]?.alt || pkg.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        <button
          onClick={() => navigate('/packages')}
          className="absolute top-6 left-4 sm:left-8 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-black text-xs font-bold uppercase tracking-wide shadow-md cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Packages</span>
        </button>

        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8 max-w-5xl mx-auto w-full">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight drop-shadow-sm">
            {pkg.name}
          </h1>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        {pkg.tagline && (
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-8">{pkg.tagline}</p>
        )}

        {/* CTA Row (top) */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <button
            onClick={() => requestQuote(`I'd like the free itinerary for ${pkg.name}.`)}
            className="flex-1 py-3.5 rounded-full bg-deep-emerald hover:bg-forest-green text-white font-bold text-sm text-center transition-colors cursor-pointer"
          >
            Get Free Itinerary
          </button>
          <button
            onClick={() => requestQuote(`I'd like to enquire about ${pkg.name}.`)}
            className="flex-1 py-3.5 rounded-full bg-warm-orange hover:brightness-95 text-white font-bold text-sm text-center transition-colors cursor-pointer"
          >
            Enquire Now
          </button>
        </div>

        {/* Quick Info Block */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 p-5 rounded-2xl bg-gray-50 border border-gray-100">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Duration</div>
            <div className="text-sm font-bold text-slate-900">{pkg.duration}</div>
          </div>
          {pkg.startingPoint && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Starting Point</div>
              <div className="text-sm font-bold text-slate-900">{pkg.startingPoint}</div>
            </div>
          )}
          {pkg.travelType && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Travel Type</div>
              <div className="text-sm font-bold text-slate-900">{pkg.travelType}</div>
            </div>
          )}
          {dhamsSummary && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Covers</div>
              <div className="text-sm font-bold text-slate-900">{dhamsSummary}</div>
            </div>
          )}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Starting Price</div>
            <div className="text-sm font-bold text-slate-900">
              ₹{pkg.price?.toLocaleString('en-IN')} <span className="font-normal text-gray-500">/ person</span>
            </div>
          </div>
        </div>

        {pkg.overview && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">Overview</h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{pkg.overview}</p>
          </div>
        )}

        {pkg.whatIsSection && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">What is {pkg.name}?</h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{pkg.whatIsSection}</p>
          </div>
        )}

        {pkg.stopsCovered && pkg.stopsCovered.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">Places Covered</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pkg.stopsCovered.map((stop, i) => (
                <div key={i} className="p-5 rounded-2xl border border-gray-200">
                  <div className="font-bold text-slate-900 mb-1.5">{stop.name}</div>
                  {stop.description && <p className="text-sm text-slate-600 leading-relaxed">{stop.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {pkg.itinerary && pkg.itinerary.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">
              Itinerary — {pkg.duration}
            </h2>
            <div className="space-y-4">
              {pkg.itinerary.map((day, i) => (
                <div key={i} className="p-5 rounded-2xl border border-gray-200">
                  <div className="font-bold text-slate-900 mb-1.5">
                    Day {day.day}: {day.title}
                  </div>
                  {day.description && (
                    <p className="text-sm text-slate-600 leading-relaxed">{day.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {pkg.placesCovered && pkg.placesCovered.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">Places Covered in Package</h2>
            <div className="flex flex-wrap gap-2">
              {pkg.placesCovered.map((place, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                  {place}
                </span>
              ))}
            </div>
          </div>
        )}

        {pkg.bestTimeSections && pkg.bestTimeSections.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">Best Time to Visit</h2>
            <div className="space-y-4">
              {pkg.bestTimeSections.map((section, i) => (
                <div key={i}>
                  <div className="font-bold text-slate-900 mb-1">{section.heading}</div>
                  {section.description && (
                    <p className="text-sm text-slate-600 leading-relaxed">{section.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {pkg.howToReach && (pkg.howToReach.road || pkg.howToReach.rail || pkg.howToReach.air) && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">How to Reach</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {pkg.howToReach.road && (
                <div className="p-5 rounded-2xl border border-gray-200">
                  <Car className="w-5 h-5 text-luxury-gold mb-2" />
                  <div className="font-bold text-slate-900 mb-1">By Road</div>
                  <p className="text-sm text-slate-600 leading-relaxed">{pkg.howToReach.road}</p>
                </div>
              )}
              {pkg.howToReach.rail && (
                <div className="p-5 rounded-2xl border border-gray-200">
                  <Train className="w-5 h-5 text-luxury-gold mb-2" />
                  <div className="font-bold text-slate-900 mb-1">By Train</div>
                  <p className="text-sm text-slate-600 leading-relaxed">{pkg.howToReach.rail}</p>
                </div>
              )}
              {pkg.howToReach.air && (
                <div className="p-5 rounded-2xl border border-gray-200">
                  <Plane className="w-5 h-5 text-luxury-gold mb-2" />
                  <div className="font-bold text-slate-900 mb-1">By Air</div>
                  <p className="text-sm text-slate-600 leading-relaxed">{pkg.howToReach.air}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {(pkg.costNote || (pkg.costFactors && pkg.costFactors.length > 0)) && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">Package Cost</h2>
            {pkg.costNote && <p className="text-sm text-slate-700 leading-relaxed mb-4">{pkg.costNote}</p>}
            {pkg.costFactors && pkg.costFactors.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.costFactors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4.5 h-4.5 text-luxury-gold flex-shrink-0 mt-0.5" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {((pkg.inclusions && pkg.inclusions.length > 0) || (pkg.exclusions && pkg.exclusions.length > 0)) && (
          <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {pkg.inclusions && pkg.inclusions.length > 0 && (
              <div>
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">What's Included</h2>
                <ul className="space-y-2.5">
                  {pkg.inclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4.5 h-4.5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {pkg.exclusions && pkg.exclusions.length > 0 && (
              <div>
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">What's Excluded</h2>
                <ul className="space-y-2.5">
                  {pkg.exclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <XCircle className="w-4.5 h-4.5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {pkg.highlights && pkg.highlights.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">Highlights</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pkg.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4.5 h-4.5 text-luxury-gold flex-shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(pkg.accommodationNote || (pkg.accommodationOptions && pkg.accommodationOptions.length > 0)) && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">Accommodation</h2>
            {pkg.accommodationNote && (
              <p className="text-sm text-slate-700 leading-relaxed mb-4">{pkg.accommodationNote}</p>
            )}
            {pkg.accommodationOptions && pkg.accommodationOptions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {pkg.accommodationOptions.map((opt, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                    {opt}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {pkg.transportationOptions && pkg.transportationOptions.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">Transportation</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pkg.transportationOptions.map((opt, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4.5 h-4.5 text-luxury-gold flex-shrink-0 mt-0.5" />
                  <span>{opt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pkg.customizeOptions && pkg.customizeOptions.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">Customize Your Package</h2>
            <div className="flex flex-wrap gap-2 mb-5">
              {pkg.customizeOptions.map((opt, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                  {opt}
                </span>
              ))}
            </div>
            <button
              onClick={() => requestQuote(`I'd like a customized version of ${pkg.name}.`)}
              className="px-6 py-3 rounded-full bg-deep-emerald hover:bg-forest-green text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Request Customized Package
            </button>
          </div>
        )}

        {pkg.whoCanBook && pkg.whoCanBook.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">Who Can Book</h2>
            <div className="flex flex-wrap gap-2">
              {pkg.whoCanBook.map((who, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                  {who}
                </span>
              ))}
            </div>
          </div>
        )}

        {pkg.travelTips && pkg.travelTips.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">Travel Tips</h2>
            <ul className="space-y-2.5">
              {pkg.travelTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4.5 h-4.5 text-luxury-gold flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pkg.whyChooseUs && pkg.whyChooseUs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">Why Choose Safar Trails</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pkg.whyChooseUs.map((reason, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4.5 h-4.5 text-luxury-gold flex-shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pkg.faqs && pkg.faqs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">FAQs</h2>
            <div className="space-y-5">
              {pkg.faqs.map((faq, i) => (
                <div key={i}>
                  <div className="font-bold text-slate-900 mb-1">{faq.question}</div>
                  {faq.answer && <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {(pkg.bottomCtaHeading || pkg.bottomCtaText) && (
          <div className="p-6 sm:p-8 rounded-2xl bg-gray-50 border border-gray-100 text-center">
            {pkg.bottomCtaHeading && (
              <h2 className="text-xl font-serif font-bold text-slate-900 mb-3">{pkg.bottomCtaHeading}</h2>
            )}
            {pkg.bottomCtaText && (
              <p className="text-sm text-slate-700 leading-relaxed mb-6 max-w-2xl mx-auto">{pkg.bottomCtaText}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button
                onClick={() => requestQuote(`I'd like the free itinerary for ${pkg.name}.`)}
                className="flex-1 py-3.5 rounded-full bg-deep-emerald hover:bg-forest-green text-white font-bold text-sm text-center transition-colors cursor-pointer"
              >
                Get Free Itinerary
              </button>
              <button
                onClick={() => requestQuote(`I'd like to enquire about ${pkg.name}.`)}
                className="flex-1 py-3.5 rounded-full bg-warm-orange hover:brightness-95 text-white font-bold text-sm text-center transition-colors cursor-pointer"
              >
                Enquire Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
