import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search, X, MapPin, Package as PackageIcon, BookOpen, ArrowRight } from 'lucide-react';
import { destinationsData } from '../data/destinationsData';
import { packagesData } from '../data/packagesData';
import { guidesData } from '../data/guidesData';
import { Package, TravelGuide } from '../types';
import { AIIcon } from './AIIcon';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDestination: (slug: string) => void;
  onSelectPackage: (pkg: Package) => void;
  onSelectGuide: (guide: TravelGuide) => void;
  onStartAIPlan: (promptText?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectDestination,
  onSelectPackage,
  onSelectGuide,
  onStartAIPlan
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const matchedDestinations = destinationsData.filter(d =>
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.tagline.toLowerCase().includes(query.toLowerCase()) ||
    d.state.toLowerCase().includes(query.toLowerCase())
  );

  const matchedPackages = packagesData.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.destination.toLowerCase().includes(query.toLowerCase()) ||
    p.overview.toLowerCase().includes(query.toLowerCase())
  );

  const matchedGuides = guidesData.filter(g =>
    g.title.toLowerCase().includes(query.toLowerCase()) ||
    g.destinationName.toLowerCase().includes(query.toLowerCase()) ||
    g.excerpt.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[80vh]"
          >
        {/* Search Input Box */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center gap-3 bg-[#FAF9F6]">
          <Search className="w-5 h-5 text-black flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Kashmir, Goa, packages, guides, or honeymoon ideas..."
            className="w-full text-base sm:text-lg text-black placeholder:text-gray-400 bg-transparent focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-gray-400 hover:text-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            title="Close search"
            className="p-1.5 rounded-full text-gray-500 hover:text-black hover:bg-gray-200 cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Quick AI Trigger */}
          {query.trim() && (
            <div
              onClick={() => {
                onStartAIPlan(query);
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-gray-200 flex items-center justify-between cursor-pointer hover:border-black transition-all"
            >
              <div className="flex items-center gap-2.5">
                <AIIcon className="w-5 h-5 text-black" />
                <div>
                  <div className="text-xs font-bold text-black font-serif">
                    Plan "{query}" with AI
                  </div>
                  <div className="text-[11px] text-gray-500 font-normal">
                    Generate instant day-by-day customized itinerary & cost estimate
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-black" />
            </div>
          )}

          {/* Destinations Category */}
          {matchedDestinations.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-black" />
                <span>Destinations</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedDestinations.slice(0, 4).map((d) => (
                  <button
                    key={d.slug}
                    onClick={() => {
                      onSelectDestination(d.slug);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-[#FAF9F6] border border-gray-150 text-left flex items-center gap-3 transition-colors group cursor-pointer"
                  >
                    <img src={d.heroImage} alt={d.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <div className="text-xs font-bold text-black group-hover:text-gold-ink">{d.name}</div>
                      <div className="text-[11px] text-gray-400 line-clamp-1">{d.state} • {d.idealDays}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Packages Category */}
          {matchedPackages.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                <PackageIcon className="w-3.5 h-3.5 text-black" />
                <span>Holiday Packages</span>
              </div>
              <div className="space-y-2">
                {matchedPackages.slice(0, 3).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectPackage(p);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#FAF9F6] border border-gray-150 text-left flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.heroImage} alt={p.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <div className="text-xs font-bold text-black group-hover:text-gold-ink line-clamp-1">{p.title}</div>
                        <div className="text-[11px] text-gray-400">{p.destination} • {p.durationDays}D/{p.durationNights}N</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-black">₹{p.startingPrice.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">/ person</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Guides Category */}
          {matchedGuides.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-black" />
                <span>Travel Guides</span>
              </div>
              <div className="space-y-2">
                {matchedGuides.slice(0, 3).map((g) => (
                  <button
                    key={g.slug}
                    onClick={() => {
                      onSelectGuide(g);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#FAF9F6] border border-gray-150 text-left flex items-center gap-3 transition-colors group cursor-pointer"
                  >
                    <img src={g.heroImage} alt={g.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <div className="text-xs font-bold text-black group-hover:text-luxury-gold line-clamp-1">{g.title}</div>
                      <div className="text-[11px] text-gray-400">{g.destinationName} • {g.readTime}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedDestinations.length === 0 && matchedPackages.length === 0 && matchedGuides.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              No matching destinations or packages found for "{query}". <br />
              <button
                onClick={() => {
                  onStartAIPlan(query);
                  onClose();
                }}
                className="mt-3 text-xs font-bold uppercase tracking-wider text-black hover:underline cursor-pointer"
              >
                Click here to build a custom itinerary with AI →
              </button>
            </div>
          )}
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
