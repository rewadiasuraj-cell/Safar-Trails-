import React from 'react';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import { urlFor } from '../../lib/sanity/image';
import { SanityTourPackage } from '../../lib/sanity/types';

interface PackageDetailModalProps {
  pkg: SanityTourPackage;
  onClose: () => void;
  onOpenQuoteModal: (summary?: string, destinationName?: string) => void;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({ pkg, onClose, onOpenQuoteModal }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4.5 h-4.5 text-slate-900" />
        </button>

        {pkg.images && pkg.images.length > 0 && (
          <div className="h-56 sm:h-72 w-full overflow-hidden rounded-t-2xl bg-gray-100">
            <img
              src={urlFor(pkg.images[0]).width(1000).height(600).fit('crop').url()}
              alt={pkg.images[0].alt || pkg.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-serif font-bold text-slate-900">{pkg.name}</h2>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span>{pkg.duration}</span>
            {pkg.destination && <span>• {pkg.destination.title}</span>}
          </div>
          <div className="mt-3 text-2xl font-extrabold text-black">
            ₹{pkg.price?.toLocaleString('en-IN')}{' '}
            <span className="text-sm font-normal text-gray-500">/ person</span>
          </div>

          {pkg.itinerary && pkg.itinerary.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Itinerary</h3>
              <div className="space-y-4">
                {pkg.itinerary
                  .slice()
                  .sort((a, b) => a.day - b.day)
                  .map((day) => (
                    <div key={day.day} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-50 text-[#FF6B00] font-bold flex items-center justify-center flex-shrink-0 text-sm">
                        {day.day}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{day.title}</div>
                        {day.description && (
                          <p className="text-sm text-gray-600 mt-0.5">{day.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pkg.inclusions && pkg.inclusions.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Inclusions</h3>
                <ul className="space-y-1.5">
                  {pkg.inclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {pkg.exclusions && pkg.exclusions.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Exclusions</h3>
                <ul className="space-y-1.5">
                  {pkg.exclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={() => onOpenQuoteModal(`I'm interested in the "${pkg.name}" package.`, pkg.destination?.title)}
            className="mt-8 w-full py-3.5 rounded-full bg-[#FF6B00] hover:bg-[#E55F00] text-white font-bold text-sm transition-colors cursor-pointer"
          >
            Enquire About This Package
          </button>
        </div>
      </div>
    </div>
  );
};
