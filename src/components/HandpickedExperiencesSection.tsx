import React from 'react';
import { ArrowRight, Compass, Sparkles, Star, Flame, Zap } from 'lucide-react';

interface HandpickedExperiencesSectionProps {
  onSelectCategory?: (category: string) => void;
  onSelectDestination?: (slug: string) => void;
  onViewAll: () => void;
  onOpenQuoteModal?: (summary?: string, destinationName?: string) => void;
}

interface FeaturedDestination {
  id: string;
  slug: string;
  name: string;
  region: string;
  tagline: string;
  image: string;
  video?: string;
  duration: string;
  startingPrice: string;
  isTrending?: boolean;
}

export const HandpickedExperiencesSection: React.FC<HandpickedExperiencesSectionProps> = ({
  onSelectCategory,
  onSelectDestination,
  onViewAll,
  onOpenQuoteModal
}) => {
  // Curated featured destinations with authentic photography & highlights
  const featuredDestinations: FeaturedDestination[] = [
    {
      id: 'kashmir',
      slug: 'kashmir',
      name: 'Kashmir',
      region: 'JAMMU & KASHMIR',
      tagline: 'Shikaras, Snow Peaks & Pine Valleys',
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=75&w=600&auto=format&fit=crop',
      duration: '5–7 Days',
      startingPrice: '₹16,999',
      isTrending: true
    },
    {
      id: 'goa',
      slug: 'goa',
      name: 'Goa',
      region: 'GOA COAST',
      tagline: 'Sun-Kissed Beaches & Latin Quarters',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=75&w=600&auto=format&fit=crop',
      duration: '4–6 Days',
      startingPrice: '₹14,499',
      isTrending: true
    },
    {
      id: 'kerala',
      slug: 'kerala',
      name: 'Kerala',
      region: 'GHATS & BACKWATERS',
      tagline: 'Tranquil Backwaters & Misty Tea Hills',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=75&w=600&auto=format&fit=crop',
      duration: '5–7 Days',
      startingPrice: '₹15,999',
      isTrending: true
    },
    {
      id: 'rajasthan',
      slug: 'rajasthan',
      name: 'Rajasthan',
      region: 'ROYAL RAJASTHAN',
      tagline: 'Regal Forts, Palaces & Desert Dunes',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=75&w=600&auto=format&fit=crop',
      duration: '6–8 Days',
      startingPrice: '₹17,999',
      isTrending: true
    },
    {
      id: 'himachal-pradesh',
      slug: 'himachal-pradesh',
      name: 'Himachal',
      region: 'WESTERN HIMALAYAS',
      tagline: 'Cedar Forests, Snow Passes & Paragliding',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=75&w=600&auto=format&fit=crop',
      duration: '5–7 Days',
      startingPrice: '₹14,999',
      isTrending: true
    },
    {
      id: 'ladakh',
      slug: 'ladakh',
      name: 'Ladakh',
      region: 'TRANS-HIMALAYAS',
      tagline: 'High Altitude Lakes & Ancient Gompas',
      image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=75&w=600&auto=format&fit=crop',
      duration: '6–8 Days',
      startingPrice: '₹22,999',
      isTrending: true
    },
    {
      id: 'andaman',
      slug: 'andaman',
      name: 'Andaman Islands',
      region: 'BAY OF BENGAL',
      tagline: 'Turquoise Lagoons & Pristine Coral Reefs',
      image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=75&w=600&auto=format&fit=crop',
      duration: '5–7 Days',
      startingPrice: '₹24,999',
      isTrending: true
    },
    {
      id: 'meghalaya',
      slug: 'northeast-india',
      name: 'Meghalaya & Northeast',
      region: 'NORTHEAST WONDERS',
      tagline: 'Living Root Bridges & Crystal Waterfalls',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=75&w=600&auto=format&fit=crop',
      duration: '5–7 Days',
      startingPrice: '₹18,499',
    },
    {
      id: 'uttarakhand',
      slug: 'uttarakhand',
      name: 'Uttarakhand',
      region: 'DEV BHOOMI',
      tagline: 'Ganga Aarti, Alpine Meadows & Sacred Peaks',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=75&w=600&auto=format&fit=crop',
      duration: '4–6 Days',
      startingPrice: '₹13,999',
      isTrending: true
    }
  ];

  const handleCardClick = (dest: FeaturedDestination) => {
    if (onSelectDestination) {
      onSelectDestination(dest.slug);
    } else if (onSelectCategory) {
      onSelectCategory(dest.name);
    }
  };

  // Render a single destination card
  const renderCard = (dest: FeaturedDestination, indexSuffix: string | number) => (
    <div
      key={`${dest.id}-${indexSuffix}`}
      id={`featured-exp-${dest.slug}-${indexSuffix}`}
      onClick={() => handleCardClick(dest)}
      className="group relative flex-none w-[280px] sm:w-[310px] lg:w-[330px] xl:w-[340px] h-[370px] sm:h-[390px] lg:h-[410px] rounded-2xl sm:rounded-[22px] overflow-hidden cursor-pointer shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.22)] hover:scale-[1.02] transform will-change-transform transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 border border-stone-200/90 hover:border-luxury-gold select-none"
    >
      {/* Photography Background with Zoom Hover & Fallback */}
      <img
        src={dest.image}
        alt={`${dest.name} - ${dest.tagline}`}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out pointer-events-none"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (dest.id === 'uttarakhand') {
            target.src = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=75&w=600&auto=format&fit=crop';
          } else if (dest.id === 'meghalaya') {
            target.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=75&w=600&auto=format&fit=crop';
          } else {
            target.src = 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=75&w=600&auto=format&fit=crop';
          }
        }}
      />

      {/* Multi-Stop Dark Gradient for Pristine Typography Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 pointer-events-none" />

      {/* Top Row: Trending Badge & Rating Badge */}
      <div className="relative z-10 flex items-center justify-between gap-1.5 pointer-events-none">
        <div>
          {dest.isTrending && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-wider text-white bg-midnight-blue shadow-md border border-luxury-gold/60 whitespace-nowrap leading-none">
              <Flame className="w-3 h-3 text-white fill-white shrink-0" />
              <span>Trending</span>
            </span>
          )}
        </div>
        
        {/* Starting price. This replaced a star-rating badge whose rating and
            review count were placeholder values the business could not
            substantiate - see docs/README.md. Price is a claim we can stand
            behind, and in travel it qualifies the lead better than a rating. */}
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] sm:text-[11px] font-bold bg-white text-stone-900 shadow-md border border-white/90 backdrop-blur-md whitespace-nowrap leading-none">
          <span className="text-[9px] font-bold uppercase tracking-wide text-stone-600">From</span>
          <span className="text-black font-extrabold">{dest.startingPrice}</span>
        </div>
      </div>

      {/* Bottom Row: Destination Title, Duration, Accent, and Tagline */}
      <div className="relative z-10 text-white">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-serif text-2xl sm:text-[26px] lg:text-[26px] font-bold text-white tracking-tight leading-tight group-hover:text-luxury-gold transition-colors">
            {dest.name}
          </h3>
          <div className="text-right shrink-0">
            <span className="text-[11px] sm:text-xs text-white/80 font-medium bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/15 inline-block leading-none">
              {dest.duration}
            </span>
          </div>
        </div>

        {/* Luxury Gold Accent Line */}
        <div className="w-8 h-1 bg-luxury-gold rounded-full my-2.5 group-hover:w-14 transition-all duration-300" />

        <p className="text-xs sm:text-[13px] text-white/85 line-clamp-2 leading-relaxed font-normal">
          {dest.tagline}
        </p>

        {/* Actions Row: Quick Book + Discover Link */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-white/15">
          <button
            type="button"
            id={`quick-book-featured-${dest.slug}-${indexSuffix}`}
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuoteModal?.(
                `Quick booking enquiry for ${dest.name} (${dest.duration}). Please share custom pricing and hotel options.`,
                dest.name
              );
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-deep-emerald hover:bg-forest-green active:scale-95 text-white font-bold text-[10px] sm:text-[11px] uppercase tracking-wider shadow-sm flex items-center gap-1 transition-all cursor-pointer pointer-events-auto"
          >
            <Zap className="w-3 h-3 fill-white text-white shrink-0" />
            <span>Quick Book</span>
          </button>

          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/90 group-hover:text-luxury-gold transition-colors">
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform stroke-[2.2]" />
          </div>
        </div>
      </div>
    </div>
  );

  // Render View All CTA card
  const renderViewAllCard = (indexSuffix: string | number) => (
    <div
      key={`view-all-${indexSuffix}`}
      id={`featured-exp-view-all-${indexSuffix}`}
      onClick={() => onViewAll()}
      className="group relative flex-none w-[280px] sm:w-[310px] lg:w-[330px] xl:w-[340px] h-[370px] sm:h-[390px] lg:h-[410px] rounded-2xl sm:rounded-[22px] overflow-hidden cursor-pointer shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.22)] transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 bg-midnight-blue border border-stone-800 hover:border-luxury-gold/60 select-none"
    >
      {/* Atmospheric Background Image with Deep Navy Overlay */}
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop"
        alt="View all destinations"
        className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-108 transition-transform duration-700 ease-out pointer-events-none"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-midnight-blue via-midnight-blue/85 to-midnight-blue/50 pointer-events-none" />

      {/* Top Row: Badges with responsive spacing */}
      <div className="relative z-10 flex items-center justify-between gap-1.5 pointer-events-none">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-white/95 bg-white/15 backdrop-blur-md border border-white/20 shadow-xs whitespace-nowrap leading-none">
          ALL REGIONS
        </span>
        <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wide text-luxury-gold bg-luxury-gold/15 border border-luxury-gold/25 px-2.5 py-1 rounded-full whitespace-nowrap">
          10+ DESTINATIONS
        </span>
      </div>

      {/* Middle/Bottom Call-To-Action */}
      <div className="relative z-10 text-white pointer-events-none">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 group-hover:bg-luxury-gold group-hover:border-luxury-gold group-hover:text-midnight-blue flex items-center justify-center text-white mb-3.5 transition-all duration-300 shadow-md">
          <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform stroke-[2]" />
        </div>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
          View All Destinations
        </h3>

        <div className="w-8 h-1 bg-luxury-gold rounded-full my-2.5 group-hover:w-14 transition-all duration-300" />

        <p className="text-xs sm:text-[13px] text-white/75 leading-relaxed font-normal mb-3.5">
          Browse our full catalog of handcrafted holidays across North, South, West & Northeast India.
        </p>

        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-luxury-gold group-hover:text-white transition-colors">
          <span>Browse All Trails</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </div>
  );

  return (
    <section id="handpicked-experiences-section" className="w-full py-16 sm:py-20 lg:py-24 bg-ivory border-b border-stone-100 overflow-hidden">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-gold-ink text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-ink" aria-hidden="true" />
                Explore Your Dream Destination
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-stone-900 tracking-tight leading-tight">
              Handpicked Experiences for You
            </h2>

            <div className="flex items-center gap-2 mt-3">
              <div className="w-10 h-[1.5px] bg-luxury-gold rounded-full" />
              <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
              <p className="text-sm text-stone-500 font-sans-ui ml-1">
                Hover to pause and explore curated holidays across India
              </p>
            </div>
          </div>
        </div>

        {/* Seamless Pure CSS Infinite Auto-Scroll Wrapper with Edge Fade Mask */}
        <div 
          className="relative w-full overflow-hidden mask-fade-edges py-2"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)'
          }}
        >
          {/* Duplicated Track (Set 1 & Set 2) for Seamless 0% to -50% CSS Translate Loop */}
          <div 
            className="flex gap-4 sm:gap-6 animate-infinite-scroll hover:[animation-play-state:paused] py-2 w-max"
            style={{
              animationDuration: '34s',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite'
            }}
          >
            {/* First Set of Cards */}
            {featuredDestinations.map((dest) => renderCard(dest, 'set1'))}
            {renderViewAllCard('set1')}

            {/* Second Set of Cards (Exact Duplicate for seamless continuous looping) */}
            {featuredDestinations.map((dest) => renderCard(dest, 'set2'))}
            {renderViewAllCard('set2')}
          </div>
        </div>

      </div>
    </section>
  );
};


