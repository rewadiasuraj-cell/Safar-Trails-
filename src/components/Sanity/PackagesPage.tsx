import React from 'react';
import { useNavigate } from 'react-router';
import { Clock } from 'lucide-react';
import { useSanityQuery } from '../../lib/sanity/useSanityQuery';
import { urlFor } from '../../lib/sanity/image';
import { PACKAGES_QUERY } from '../../lib/sanity/queries';
import { SanityTourPackage } from '../../lib/sanity/types';
import { SanityLoadingState, SanityErrorState, SanityEmptyState } from './SanityStateViews';

export const PackagesPage: React.FC = () => {
  const { data, loading, error } = useSanityQuery<SanityTourPackage[]>(PACKAGES_QUERY);
  const navigate = useNavigate();

  const packages = data || [];

  return (
    <section id="packages-section" className="w-full py-16 lg:py-24 bg-white">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="mb-10">
          <h2 className="text-3xl sm:text-4xl font-serif text-black tracking-tight">Tour Packages</h2>
        </div>

        {loading && <SanityLoadingState label="Loading packages…" />}
        {!loading && error && <SanityErrorState message={error} />}
        {!loading && !error && packages.length === 0 && (
          <SanityEmptyState
            title="No tour packages yet"
            description="Add a Tour Package document in the Sanity Studio and it will show up here automatically."
          />
        )}

        {!loading && !error && packages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <button
                key={pkg._id}
                onClick={() => navigate(`/packages/${pkg.slug}`)}
                className="text-left group bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-black/30 shadow-xs hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {pkg.images && pkg.images[0] && (
                    <img
                      src={urlFor(pkg.images[0]).width(700).height(500).fit('crop').url()}
                      alt={pkg.images[0].alt || pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="p-5">
                  {pkg.destination && (
                    <div className="text-[11px] font-bold uppercase tracking-wider text-deep-emerald mb-1.5">
                      {pkg.destination.title}
                    </div>
                  )}
                  <h3 className="font-serif font-bold text-lg text-slate-900">{pkg.name}</h3>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 text-sm font-extrabold text-black">
                    ₹{pkg.price?.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-gray-500">/ person</span>
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
