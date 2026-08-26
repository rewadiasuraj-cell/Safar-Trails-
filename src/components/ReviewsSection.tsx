import React from 'react';
import { customerReviewsData } from '../data/reviewsAndTrustData';
import { Star, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews-section" className="w-full py-16 lg:py-24 bg-[#FAF9F6] border-t border-b border-gray-200">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200 text-gray-800 text-[10px] font-bold uppercase tracking-widest mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-black" />
            <span>Real Traveler Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black tracking-tight">
            Loved by Couples, Families & Explorers
          </h2>
          <p className="mt-2 text-gray-500 text-sm sm:text-base font-normal">
            Over 12,000+ happy journeys crafted across India. Read verified reviews from real travelers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {customerReviewsData.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:border-black transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal italic">
                  "{review.reviewText}"
                </p>

                <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                  <span>Trip: </span>
                  <strong className="text-black">{review.tripName}</strong>
                </div>
              </div>

              {/* Reviewer Profile */}
              <div className="pt-4 border-t border-gray-100 flex items-center gap-3 mt-4">
                <img
                  src={review.avatar}
                  alt={review.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <div className="text-xs font-bold text-black flex items-center gap-1">
                    <span>{review.authorName}</span>
                    {review.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Verified Traveler" />
                    )}
                  </div>
                  <div className="text-[10.5px] text-gray-400">
                    {review.city} • {review.travelType}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
