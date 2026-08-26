import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Compass, Sparkles } from 'lucide-react';

interface HandpickedExperiencesSectionProps {
  onSelectCategory?: (category: string) => void;
  onSelectDestination?: (slug: string) => void;
  onViewAll: () => void;
}

interface FeaturedDestination {
  id: string;
  slug: string;
  name: string;
  region: string;
  tagline: string;
  image: string;
  duration: string;
  startingPrice: string;
}

export const HandpickedExperiencesSection: React.FC<HandpickedExperiencesSectionProps> = ({
  onSelectCategory,
  onSelectDestination,
  onViewAll
}) => {
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastScrollTimeRef = useRef<number>(Date.now());
  const userInteractedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Curated featured destinations with authentic photography & highlights
  const featuredDestinations: FeaturedDestination[] = [
    {
      id: 'kashmir',
      slug: 'kashmir',
      name: 'Kashmir',
      region: 'JAMMU & KASHMIR',
      tagline: 'Shikaras, Snow Peaks & Pine Valleys',
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1200&auto=format&fit=crop',
      duration: '5–7 Days',
      startingPrice: '₹16,999'
    },
    {
      id: 'goa',
      slug: 'goa',
      name: 'Goa',
      region: 'GOA COAST',
      tagline: 'Sun-Kissed Beaches & Latin Quarters',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop',
      duration: '4–6 Days',
      startingPrice: '₹14,499'
    },
    {
      id: 'kerala',
      slug: 'kerala',
      name: 'Kerala',
      region: 'GHATS & BACKWATERS',
      tagline: 'Tranquil Backwaters & Misty Tea Hills',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop',
      duration: '5–7 Days',
      startingPrice: '₹15,999'
    },
    {
      id: 'rajasthan',
      slug: 'rajasthan',
      name: 'Rajasthan',
      region: 'ROYAL RAJASTHAN',
      tagline: 'Regal Forts, Palaces & Desert Dunes',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200&auto=format&fit=crop',
      duration: '6–8 Days',
      startingPrice: '₹17,999'
    },
    {
      id: 'himachal-pradesh',
      slug: 'himachal-pradesh',
      name: 'Himachal',
      region: 'WESTERN HIMALAYAS',
      tagline: 'Cedar Forests, Snow Passes & Paragliding',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop',
      duration: '5–7 Days',
      startingPrice: '₹14,999'
    },
    {
      id: 'ladakh',
      slug: 'ladakh',
      name: 'Ladakh',
      region: 'TRANS-HIMALAYAS',
      tagline: 'High Altitude Lakes & Ancient Gompas',
      image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1200&auto=format&fit=crop',
      duration: '6–8 Days',
      startingPrice: '₹22,999'
    },
    {
      id: 'andaman',
      slug: 'andaman',
      name: 'Andaman Islands',
      region: 'BAY OF BENGAL',
      tagline: 'Turquoise Lagoons & Pristine Coral Reefs',
      image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=1200&auto=format&fit=crop',
      duration: '5–7 Days',
      startingPrice: '₹24,999'
    },
    {
      id: 'meghalaya',
      slug: 'meghalaya',
      name: 'Meghalaya',
      region: 'NORTHEAST WONDERS',
      tagline: 'Living Root Bridges & Crystal Waterfalls',
      image: 'https://images.unsplash.com/photo-1608658804968-3e4b78648c66?q=80&w=1200&auto=format&fit=crop',
      duration: '5–7 Days',
      startingPrice: '₹18,499'
    },
    {
      id: 'uttarakhand',
      slug: 'uttarakhand',
      name: 'Uttarakhand',
      region: 'DEV BHOOMI',
      tagline: 'Ganga Aarti, Alpine Meadows & Sacred Peaks',
      image: 'https://images.unsplash.com/photo-1600100397608-f010f4441584?q=80&w=1200&auto=format&fit=crop',
      duration: '4–6 Days',
      startingPrice: '₹13,999'
    }
  ];

  // Update scroll progress
  const updateScrollProgress = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress((scrollLeft / maxScroll) * 100);
    }
  }, []);

  // Automatic gentle continuous horizontal scrolling animation on desktop
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isRunning = true;
    const scrollSpeed = 0.65; // Gentle sub-pixel increment per frame

    const autoScrollLoop = () => {
      if (isRunning && isAutoScrolling && !isHovered && container) {
        // Increment scroll position
        const currentScroll = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (currentScroll >= maxScroll - 1) {
          // Gently loop back to beginning
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollLeft += scrollSpeed;
        }
        updateScrollProgress();
      }
      animationFrameRef.current = requestAnimationFrame(autoScrollLoop);
    };

    animationFrameRef.current = requestAnimationFrame(autoScrollLoop);

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAutoScrolling, isHovered, updateScrollProgress]);

  // Handle user manual scroll / pause on interaction
  const handleUserScroll = () => {
    lastScrollTimeRef.current = Date.now();
    updateScrollProgress();
  };

  // Scroll manually via buttons
  const handleManualScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 340;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });

    // Temporarily pause auto-scroll for 3.5 seconds after manual button click
    if (userInteractedTimeoutRef.current) clearTimeout(userInteractedTimeoutRef.current);
    userInteractedTimeoutRef.current = setTimeout(() => {
      updateScrollProgress();
    }, 500);
  };

  const handleCardClick = (dest: FeaturedDestination) => {
    if (onSelectDestination) {
      onSelectDestination(dest.slug);
    } else if (onSelectCategory) {
      onSelectCategory(dest.name);
    }
  };

  return (
    <section id="handpicked-experiences-section" className="w-full py-16 sm:py-20 lg:py-24 bg-white border-b border-gray-100 overflow-hidden">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        
        {/* Section Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[#FF6B00] text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                Explore Your Dream Destination
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-slate-900 tracking-tight leading-tight">
              Handpicked Experiences for You
            </h2>

            <div className="flex items-center gap-2 mt-3">
              <div className="w-10 h-[1.5px] bg-orange-400 rounded-full" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
              <p className="text-sm text-slate-500 font-sans-ui ml-1">
                Scroll to discover curated holidays across India
              </p>
            </div>
          </div>

          {/* Desktop Interactive Animation & Navigation Bar */}
          <div className="flex items-center gap-3 self-start md:self-end">
            {/* Auto-scroll toggle pill */}
            <button
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
              title={isAutoScrolling ? 'Pause auto-scroll' : 'Resume auto-scroll'}
              aria-label={isAutoScrolling ? 'Pause auto-scroll' : 'Resume auto-scroll'}
            >
              {isAutoScrolling ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#FF6B00] fill-[#FF6B00]" />
                  <span className="text-[11px] font-semibold text-slate-700">Auto-Guiding</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-slate-600 fill-slate-600" />
                  <span className="text-[11px] font-semibold text-slate-600">Resume Scroll</span>
                </>
              )}
            </button>

            {/* Left & Right Chevron Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleManualScroll('left')}
                className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-slate-400 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
              </button>

              <button
                onClick={() => handleManualScroll('right')}
                className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-slate-400 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Rail Wrapper with Edge Fades */}
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle Left Fade Gradient on Desktop */}
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />

          {/* Subtle Right Fade Gradient on Desktop */}
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleUserScroll}
            className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth select-none cursor-grab active:cursor-grabbing [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {featuredDestinations.map((dest) => (
              <div
                key={dest.id}
                id={`featured-exp-${dest.slug}`}
                onClick={() => handleCardClick(dest)}
                className="group relative flex-none w-[280px] sm:w-[310px] lg:w-[330px] xl:w-[340px] h-[370px] sm:h-[390px] lg:h-[410px] rounded-2xl sm:rounded-[22px] overflow-hidden cursor-pointer shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.22)] transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 border border-gray-200/90 hover:border-orange-300"
              >
                {/* Full-bleed Realistic Destination Photography */}
                <img
                  src={dest.image}
                  alt={`${dest.name} - ${dest.tagline}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out pointer-events-none"
                  loading="lazy"
                />

                {/* Multi-Stop Dark Gradient for Pristine Typography Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 pointer-events-none" />

                {/* Top Row: Region & Duration Pill */}
                <div className="relative z-10 flex items-center justify-between gap-1.5 pointer-events-none">
                  <span className="inline-flex items-center px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-white/95 bg-black/60 backdrop-blur-md border border-white/20 shadow-xs whitespace-nowrap leading-none">
                    {dest.region}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold text-white/90 bg-white/20 backdrop-blur-xs">
                    {dest.duration}
                  </span>
                </div>

                {/* Bottom Row: Destination Title, Starting Price, Accent, and Tagline */}
                <div className="relative z-10 text-white pointer-events-none">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-2xl sm:text-[26px] lg:text-[26px] font-bold text-white tracking-tight leading-tight group-hover:text-orange-200 transition-colors">
                      {dest.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-orange-300">
                      From {dest.startingPrice}
                    </span>
                  </div>

                  {/* Warm Orange Accent Line */}
                  <div className="w-8 h-1 bg-[#FF6B00] rounded-full my-2.5 group-hover:w-14 transition-all duration-300" />

                  <p className="text-xs sm:text-[13px] text-white/85 line-clamp-2 leading-relaxed font-normal">
                    {dest.tagline}
                  </p>

                  {/* Discover Link on Hover */}
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/90 mt-3 pt-3 border-t border-white/15 group-hover:text-[#FF6B00] transition-colors">
                    <span>Explore Trails</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform stroke-[2.2]" />
                  </div>
                </div>
              </div>
            ))}

            {/* Final Card: View All Destinations CTA */}
            <div
              id="featured-exp-view-all"
              onClick={onViewAll}
              className="group relative flex-none w-[280px] sm:w-[310px] lg:w-[330px] xl:w-[340px] h-[370px] sm:h-[390px] lg:h-[410px] rounded-2xl sm:rounded-[22px] overflow-hidden cursor-pointer shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.22)] transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 bg-[#071322] border border-slate-800 hover:border-orange-500/50"
            >
              {/* Atmospheric Background Image with Deep Navy Overlay */}
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop"
                alt="View all destinations"
                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-108 transition-transform duration-700 ease-out pointer-events-none"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071322] via-[#071322]/85 to-[#071322]/50 pointer-events-none" />

              {/* Top Row: Badges with responsive spacing */}
              <div className="relative z-10 flex items-center justify-between gap-1.5 pointer-events-none">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-white/95 bg-white/15 backdrop-blur-md border border-white/20 shadow-xs whitespace-nowrap leading-none">
                  ALL REGIONS
                </span>
                <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wide text-orange-400 bg-orange-500/15 border border-orange-500/25 px-2.5 py-1 rounded-full whitespace-nowrap">
                  10+ DESTINATIONS
                </span>
              </div>

              {/* Middle/Bottom Call-To-Action */}
              <div className="relative z-10 text-white pointer-events-none">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 group-hover:bg-[#FF6B00] group-hover:border-[#FF6B00] flex items-center justify-center text-white mb-3.5 transition-all duration-300 shadow-md">
                  <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform stroke-[2]" />
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                  View All Destinations
                </h3>

                <div className="w-8 h-1 bg-[#FF6B00] rounded-full my-2.5 group-hover:w-14 transition-all duration-300" />

                <p className="text-xs sm:text-[13px] text-white/75 leading-relaxed font-normal mb-3.5">
                  Browse our full catalog of handcrafted holidays across North, South, West & Northeast India.
                </p>

                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-orange-400 group-hover:text-white transition-colors">
                  <span>Browse All Trails</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>

          {/* Minimal Exploration Progress Bar */}
          <div className="mt-4 flex items-center justify-between gap-4 px-1">
            <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-[#FF6B00] rounded-full transition-all duration-150"
                style={{ width: `${Math.max(12, scrollProgress)}%` }}
              />
            </div>
            <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
              {isHovered ? 'Hovered (Paused)' : isAutoScrolling ? 'Auto-scrolling' : 'Manual'}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};


