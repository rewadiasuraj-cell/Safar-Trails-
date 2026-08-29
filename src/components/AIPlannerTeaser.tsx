import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AIIcon } from './AIIcon';

export const AIPlannerTeaser: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full py-8 sm:py-10 bg-[#FAF9F6] border-t border-b border-gray-200/80">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <button
          onClick={() => navigate('/ai-planner')}
          className="w-full flex items-center justify-between gap-4 bg-black hover:bg-gray-900 text-white rounded-2xl px-5 sm:px-8 py-5 sm:py-6 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3.5 sm:gap-4 text-left min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <AIIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-serif font-bold text-base sm:text-lg tracking-tight truncate">
                Plan My Trip with AI
              </div>
              <div className="text-xs sm:text-sm text-gray-300 truncate">
                Tell us your dates, budget & style — get a custom itinerary in seconds.
              </div>
            </div>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FF6B00] flex items-center justify-center flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
          </div>
        </button>
      </div>
    </section>
  );
};
