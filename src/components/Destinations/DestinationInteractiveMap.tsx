import React, { useState, useMemo, useRef } from 'react';
import { Destination, Package } from '../../types';
import { 
  MapPin, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Navigation, 
  Compass, 
  Calendar, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Info, 
  Eye, 
  Mountain, 
  Waves, 
  Landmark, 
  Hotel, 
  Maximize2,
  Minimize2
} from 'lucide-react';
import { AIIcon } from '../AIIcon';

export interface MapAttractionPin {
  id: string;
  name: string;
  category: 'must-visit' | 'adventure' | 'nature' | 'heritage' | 'stay';
  x: number; // percentage 0-100 on map
  y: number; // percentage 0-100 on map
  image: string;
  description: string;
  distanceFromHub: string;
  bestTimeOfDay: string;
  packageDay?: number; // e.g. Day 1, Day 2
  packageMention?: string;
  insiderTip?: string;
  elevationOrVibe?: string;
}

interface DestinationInteractiveMapProps {
  destination: Destination;
  packages: Package[];
  onSelectPackage?: (pkg: Package) => void;
  onStartAIPlan?: (destName: string) => void;
  onOpenQuoteModal?: (summary?: string) => void;
}

// Preset rich regional attraction map data mapped to destination slugs
const REGIONAL_PINS_DATA: Record<string, MapAttractionPin[]> = {
  kashmir: [
    {
      id: 'kash-1',
      name: 'Dal & Nigeen Lake',
      category: 'must-visit',
      x: 48,
      y: 46,
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=600&auto=format&fit=crop',
      description: 'Iconic water bodies dotted with luxury cedarwood houseboats, floating vegetable markets, and golden sunset shikara rides.',
      distanceFromHub: '14 km from Srinagar Airport (30 mins)',
      bestTimeOfDay: 'Sunrise (5:30 AM) & Golden Hour (5:00 PM)',
      packageDay: 1,
      packageMention: 'Day 1: Houseboat Check-in & Sunset Shikara',
      insiderTip: 'Take an early morning shikara to see the 150-year-old floating wholesale flower market.',
      elevationOrVibe: '1,585 m • Serene Waters'
    },
    {
      id: 'kash-2',
      name: 'Mughal Gardens (Shalimar & Nishat)',
      category: 'heritage',
      x: 58,
      y: 40,
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600&auto=format&fit=crop',
      description: 'Terraced Persian-style pleasure gardens built by Emperor Jahangir with fountains, chinar trees, and mountain backdrop.',
      distanceFromHub: '18 km from Srinagar Center (35 mins)',
      bestTimeOfDay: '10:00 AM – 4:00 PM',
      packageDay: 2,
      packageMention: 'Day 2: Heritage Srinagar City Tour',
      insiderTip: 'Visit Nishat Bagh in late afternoon for spectacular reflective photos of the Zabarwan range.',
      elevationOrVibe: '1,600 m • Royal Heritage'
    },
    {
      id: 'kash-3',
      name: 'Gulmarg Gondola & Apharwat Peak',
      category: 'adventure',
      x: 24,
      y: 52,
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600&auto=format&fit=crop',
      description: 'Asia’s highest operational cable car taking you to Phase 2 at 13,780 ft for world-class skiing and snow views.',
      distanceFromHub: '52 km from Srinagar (1.5 hrs drive)',
      bestTimeOfDay: '8:30 AM – 1:00 PM (Clear skies)',
      packageDay: 3,
      packageMention: 'Day 3: Gulmarg High-Altitude Snow Excursion',
      insiderTip: 'Pre-book Phase 2 tickets online weeks in advance during winter and peak spring months.',
      elevationOrVibe: '3,950 m • High Alpine Snow'
    },
    {
      id: 'kash-4',
      name: 'Betaab & Aru Valley, Pahalgam',
      category: 'nature',
      x: 74,
      y: 70,
      image: 'https://images.unsplash.com/photo-1626014303757-658c3a119760?q=80&w=600&auto=format&fit=crop',
      description: 'Crystal-clear Lidder river streams, emerald pine meadows, and gateway to Kolahoi Glacier & Baisaran Valley.',
      distanceFromHub: '95 km from Srinagar (2.5 hrs drive)',
      bestTimeOfDay: 'All Day (Morning best for pony rides)',
      packageDay: 4,
      packageMention: 'Day 4: Pahalgam Pine Trails & Valley Picnic',
      insiderTip: 'Hire a registered union cab or take a horseback ride into Baisaran "Mini Switzerland".',
      elevationOrVibe: '2,130 m • Pine Sanctuary'
    },
    {
      id: 'kash-5',
      name: 'Sonamarg & Thajiwas Glacier',
      category: 'adventure',
      x: 72,
      y: 26,
      image: 'https://images.unsplash.com/photo-1588661799793-7da9f7336798?q=80&w=600&auto=format&fit=crop',
      description: 'The "Meadow of Gold" bordered by the Sindh River and eternal snowfields at the foot of the Zojila Pass.',
      distanceFromHub: '80 km from Srinagar (2 hrs drive)',
      bestTimeOfDay: '9:00 AM – 3:00 PM',
      packageDay: 5,
      packageMention: 'Day 5: Sonamarg Glacier & Sindh River Drive',
      insiderTip: 'Trek or hire a local sledge to reach the actual Thajiwas snowline for panoramic glacier vistas.',
      elevationOrVibe: '2,800 m • Glacial Valley'
    }
  ],
  himachal: [
    {
      id: 'him-1',
      name: 'Solang Valley & Rohtang Pass',
      category: 'adventure',
      x: 46,
      y: 28,
      image: 'https://images.unsplash.com/photo-1626014303757-658c3a119760?q=80&w=600&auto=format&fit=crop',
      description: 'Thrilling snow adventure hub featuring paragliding, zorbing, ATV rides, and panoramic views of Pir Panjal peaks.',
      distanceFromHub: '14 km from Manali Mall Road (30 mins)',
      bestTimeOfDay: '9:00 AM – 2:00 PM',
      packageDay: 2,
      packageMention: 'Day 2: Solang Valley & Atal Tunnel Adventure',
      insiderTip: 'Drive through the 9.02 km engineering marvel Atal Tunnel to Sissu for waterfall views.',
      elevationOrVibe: '2,560 m • Adventure Hub'
    },
    {
      id: 'him-2',
      name: 'Old Manali & Hadimba Temple',
      category: 'heritage',
      x: 44,
      y: 42,
      image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=600&auto=format&fit=crop',
      description: 'Centuries-old wooden pagoda-style temple nestled inside towering cedar forests, alongside bohemian cafes.',
      distanceFromHub: '2 km from Manali Bus Stand (10 mins)',
      bestTimeOfDay: '8:00 AM – 11:00 AM or 4:00 PM',
      packageDay: 1,
      packageMention: 'Day 1: Arrival & Old Manali Heritage Walk',
      insiderTip: 'Try woodfired trout and apple crumble at riverside cafes along the Manalsu river.',
      elevationOrVibe: '2,050 m • Cedar Woodlands'
    },
    {
      id: 'him-3',
      name: 'Shimla Ridge & Mall Road',
      category: 'must-visit',
      x: 52,
      y: 68,
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600&auto=format&fit=crop',
      description: 'Colonial neo-Gothic Christ Church, pedestrian walking boulevards, and panoramic viewpoints over Shivalik ranges.',
      distanceFromHub: 'Start / End Hub in Shimla',
      bestTimeOfDay: '4:00 PM – 8:00 PM (Evening lights)',
      packageDay: 4,
      packageMention: 'Day 4: British Colonial Heritage & Sunset Ridge',
      insiderTip: 'Take the scenic Lakkar Bazaar stroll to pick up handcrafted pine wood souvenirs.',
      elevationOrVibe: '2,276 m • Queen of Hills'
    },
    {
      id: 'him-4',
      name: 'Kasol & Parvati River Valley',
      category: 'nature',
      x: 62,
      y: 46,
      image: 'https://images.unsplash.com/photo-1588661799793-7da9f7336798?q=80&w=600&auto=format&fit=crop',
      description: 'Turquoise riverbanks, Israeli bakeries, pine forest treks to Chalal, and soothing Manikaran hot springs.',
      distanceFromHub: '75 km from Manali (2.5 hrs drive)',
      bestTimeOfDay: 'Morning & Afternoon riverside walks',
      packageDay: 3,
      packageMention: 'Day 3: Parvati Valley & Manikaran Hot Springs',
      insiderTip: 'Dip in the natural geothermal sulfur springs at Manikaran Sahib Gurudwara.',
      elevationOrVibe: '1,580 m • Riverside Bliss'
    }
  ],
  kerala: [
    {
      id: 'ker-1',
      name: 'Alleppey Backwaters & Punnamada',
      category: 'must-visit',
      x: 36,
      y: 62,
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600&auto=format&fit=crop',
      description: 'Cruise tranquil palm-fringed canals, paddy fields, and lagoons aboard a private traditional Kettuvallam houseboat.',
      distanceFromHub: '85 km from Cochin Airport (2.5 hrs)',
      bestTimeOfDay: '12:00 PM check-in till Sunset',
      packageDay: 3,
      packageMention: 'Day 3: Luxury Overnight Private Houseboat Cruise',
      insiderTip: 'Opt for an authentic Karimeen Pollichathu (pearl spot fish) lunch prepared fresh on board.',
      elevationOrVibe: 'Sea Level • Backwater Tranquility'
    },
    {
      id: 'ker-2',
      name: 'Munnar Tea Estates & Top Station',
      category: 'nature',
      x: 62,
      y: 34,
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop',
      description: 'Endless rolling emerald tea plantations, mist-covered valleys, Mattupetty Dam, and rare Nilgiri Tahr at Eravikulam.',
      distanceFromHub: '125 km from Cochin (3.5 hrs scenic hill drive)',
      bestTimeOfDay: 'Early Morning (6:30 AM) for mist & tea pluckers',
      packageDay: 1,
      packageMention: 'Day 1 & 2: Munnar Tea Gardens & Spice Trails',
      insiderTip: 'Visit the Lockhart Tea Museum for a live demonstration of orthodox tea processing.',
      elevationOrVibe: '1,600 m • Emerald Tea Hills'
    },
    {
      id: 'ker-3',
      name: 'Thekkady Periyar Wildlife Sanctuary',
      category: 'adventure',
      x: 66,
      y: 52,
      image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=600&auto=format&fit=crop',
      description: 'Boat safari on Periyar Lake to spot wild elephants, bison, exotic birds, and aromatic cardamom plantations.',
      distanceFromHub: '90 km from Munnar (3 hrs drive)',
      bestTimeOfDay: '7:30 AM (First Boat Safari)',
      packageDay: 2,
      packageMention: 'Day 2: Elephant Safari & Kalaripayattu Martial Show',
      insiderTip: 'Book the evening Kadathanadan Kalari Centre show for mind-blowing ancient martial arts stunts.',
      elevationOrVibe: '900 m • Cardamom Rainforest'
    },
    {
      id: 'ker-4',
      name: 'Fort Kochi Heritage & Chinese Fishing Nets',
      category: 'heritage',
      x: 30,
      y: 42,
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=600&auto=format&fit=crop',
      description: 'Historic colonial quarters blending Portuguese, Dutch, and British architecture with antique cafes and art galleries.',
      distanceFromHub: '40 km from Cochin Airport (1 hr)',
      bestTimeOfDay: 'Sunset at Fort Kochi Beach',
      packageDay: 4,
      packageMention: 'Day 4: Colonial Fort Kochi Walk & Mattancherry Jew Town',
      insiderTip: 'Stroll Jew Town for hand-carved teak furniture, aromatic spices, and vintage pocket watches.',
      elevationOrVibe: 'Coastal Port • Colonial Charm'
    }
  ],
  rajasthan: [
    {
      id: 'raj-1',
      name: 'Amber Fort & Maota Lake, Jaipur',
      category: 'heritage',
      x: 68,
      y: 35,
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600&auto=format&fit=crop',
      description: 'Majestic hilltop fortress of pale yellow and pink sandstone with the glittering Sheesh Mahal mirror palace.',
      distanceFromHub: '11 km from Jaipur Center (25 mins)',
      bestTimeOfDay: '8:30 AM – 11:00 AM',
      packageDay: 1,
      packageMention: 'Day 1: Royal Jaipur Palaces & Sheesh Mahal',
      insiderTip: 'Don’t miss the evening light and sound show narrating the Rajput Maharajas’ valiant history.',
      elevationOrVibe: 'Hilltop Fort • Rajput Splendor'
    },
    {
      id: 'raj-2',
      name: 'Lake Pichola & City Palace, Udaipur',
      category: 'must-visit',
      x: 42,
      y: 72,
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=600&auto=format&fit=crop',
      description: 'The City of Lakes with ornate marble palaces rising straight from calm waters, framed by the Aravalli hills.',
      distanceFromHub: 'Udaipur City Center',
      bestTimeOfDay: '5:00 PM (Sunset Boat Cruise to Jag Mandir)',
      packageDay: 3,
      packageMention: 'Day 3: Udaipur Royal Palaces & Sunset Boat Ride',
      insiderTip: 'Dine at an open rooftop restaurant in Lal Ghat for the illuminated Taj Lake Palace view.',
      elevationOrVibe: 'Lake Oasis • Romance & Luxury'
    },
    {
      id: 'raj-3',
      name: 'Mehrangarh Fort & Blue City, Jodhpur',
      category: 'heritage',
      x: 35,
      y: 48,
      image: 'https://images.unsplash.com/photo-1626014303757-658c3a119760?q=80&w=600&auto=format&fit=crop',
      description: 'Imposing 15th-century citadel perched 400 ft above the skyline, overlooking the sea of indigo-blue Brahmin houses.',
      distanceFromHub: 'Jodhpur Center (15 mins)',
      bestTimeOfDay: '9:00 AM or 4:00 PM',
      packageDay: 2,
      packageMention: 'Day 2: Blue City Stroll & Fort Ziplining',
      insiderTip: 'Try the Flying Fox zipline circuit across the moats and ramparts of Mehrangarh.',
      elevationOrVibe: 'Cliff Fortress • Blue City Vistas'
    },
    {
      id: 'raj-4',
      name: 'Thar Desert & Sam Sand Dunes, Jaisalmer',
      category: 'adventure',
      x: 18,
      y: 38,
      image: 'https://images.unsplash.com/photo-1588661799793-7da9f7336798?q=80&w=600&auto=format&fit=crop',
      description: 'Golden ripple sand dunes, sunset camel safaris, Kalbelia folk dances, and overnight luxury glamping under starry desert skies.',
      distanceFromHub: '42 km from Jaisalmer City (45 mins)',
      bestTimeOfDay: '4:30 PM till Stargazing midnight',
      packageDay: 4,
      packageMention: 'Day 4: Thar Desert Camel Safari & Swiss Tents',
      insiderTip: 'Experience 4x4 dune bashing before settling down around the bonfire for traditional folk songs.',
      elevationOrVibe: 'Golden Desert • Glamping Vibe'
    }
  ],
  andaman: [
    {
      id: 'and-1',
      name: 'Radhanagar Beach (Beach No. 7), Havelock',
      category: 'must-visit',
      x: 62,
      y: 38,
      image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=600&auto=format&fit=crop',
      description: 'Voted Asia’s best beach, famed for powder-white sands, gentle turquoise surf, and majestic rainforest backdrop.',
      distanceFromHub: '11 km from Havelock Jetty (25 mins)',
      bestTimeOfDay: '3:30 PM – 6:00 PM (Famous Sunset)',
      packageDay: 2,
      packageMention: 'Day 2: Havelock Catamaran Ferry & Radhanagar Sunset',
      insiderTip: 'Walk toward the southern cove for secluded swimming spots free of evening crowds.',
      elevationOrVibe: 'Sea Level • Pristine Turquoise Bay'
    },
    {
      id: 'and-2',
      name: 'Elephant Beach & Coral Reefs',
      category: 'adventure',
      x: 68,
      y: 28,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
      description: 'Vibrant live coral reefs, sea walking, scuba diving, glass-bottom boat rides, and kayak trails through mangrove creeks.',
      distanceFromHub: '20 mins speedboat from Havelock dock',
      bestTimeOfDay: '8:30 AM – 1:00 PM (Best water clarity)',
      packageDay: 3,
      packageMention: 'Day 3: Water Sports, Scuba Diving & Sea Walking',
      insiderTip: 'Try the guided helmet Sea Walk to stroll right on the seabed alongside clownfish and turtles.',
      elevationOrVibe: 'Marine Sanctuary • Coral Kingdom'
    },
    {
      id: 'and-3',
      name: 'Cellular Jail National Memorial, Port Blair',
      category: 'heritage',
      x: 34,
      y: 68,
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600&auto=format&fit=crop',
      description: 'Historic colonial prison commemorating India’s freedom fighters with poignant architecture and evening light & sound show.',
      distanceFromHub: '4 km from Port Blair Airport (10 mins)',
      bestTimeOfDay: '3:00 PM Jail Tour, 6:00 PM Light & Sound',
      packageDay: 1,
      packageMention: 'Day 1: Port Blair Arrival & Cellular Jail Light Show',
      insiderTip: 'The English light & sound show usually runs in the second evening slot—book ahead.',
      elevationOrVibe: 'Coastal Bluff • National Memorial'
    }
  ],
  goa: [
    {
      id: 'goa-1',
      name: 'Aguada Fort & Lighthouse, North Goa',
      category: 'heritage',
      x: 38,
      y: 35,
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600&auto=format&fit=crop',
      description: '17th-century Portuguese fortress overlooking the vast Arabian Sea and the mouth of Mandovi River.',
      distanceFromHub: '18 km from Panaji (30 mins)',
      bestTimeOfDay: '9:00 AM or 4:30 PM (Sunset)',
      packageDay: 1,
      packageMention: 'Day 1: North Goa Coastal Drive & Historic Forts',
      insiderTip: 'Visit the lower fort for ocean-level sunset views and the upper fort for the 4-tier lighthouse.',
      elevationOrVibe: 'Ocean Cliff • Portuguese Legacy'
    },
    {
      id: 'goa-2',
      name: 'Dudhsagar Waterfalls & Spice Plantation',
      category: 'nature',
      x: 75,
      y: 55,
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop',
      description: 'A roaring four-tiered 310m milky white waterfall deep in the Western Ghats jungle, reached by 4x4 open safari jeeps.',
      distanceFromHub: '60 km from Panaji (1.5 hrs drive)',
      bestTimeOfDay: '8:00 AM – 1:30 PM',
      packageDay: 2,
      packageMention: 'Day 2: 4x4 Jungle Jeep Safari to Dudhsagar Falls',
      insiderTip: 'Enjoy an authentic Goan buffet lunch served on banana leaves at the Sahakari Spice Farm.',
      elevationOrVibe: '310 m Drop • Jungle Wilderness'
    },
    {
      id: 'goa-3',
      name: 'Palolem Beach & Butterfly Island, South Goa',
      category: 'must-visit',
      x: 48,
      y: 82,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
      description: 'A crescent-shaped serene bay lined with coconut palms, colorful beach shacks, and dolphin-spotting boat trips.',
      distanceFromHub: '35 km from Margao (50 mins)',
      bestTimeOfDay: 'Morning Dolphin Cruise or Evening Sunset',
      packageDay: 3,
      packageMention: 'Day 3: South Goa Laid-back Beaches & Dolphin Safari',
      insiderTip: 'Rent a sea kayak at low tide to paddle over to the hidden cove of Monkey Island.',
      elevationOrVibe: 'Crescent Bay • Laid-back Bohemian'
    }
  ],
  uttarakhand: [
    {
      id: 'uk-1',
      name: 'Triveni Ghat & Ganga Aarti, Rishikesh',
      category: 'must-visit',
      x: 45,
      y: 65,
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=600&auto=format&fit=crop',
      description: 'Sacred confluence on the banks of Holy Ganga where thousands gather for the mesmerizing musical Maha Aarti at twilight.',
      distanceFromHub: '20 km from Dehradun Airport (35 mins)',
      bestTimeOfDay: '5:30 PM – 7:30 PM (Evening Aarti)',
      packageDay: 1,
      packageMention: 'Day 1: Rishikesh Welcome & Ganga Maha Aarti',
      insiderTip: 'Float a traditional flower diya into the river during the synchronized Vedic chants.',
      elevationOrVibe: '372 m • Spiritual Riverbanks'
    },
    {
      id: 'uk-2',
      name: 'Shivpuri River Rafting & Cliff Jump',
      category: 'adventure',
      x: 58,
      y: 52,
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop',
      description: 'Grade III and IV white-water rapids through the Himalayan gorge, body surfing, and sandy riverside camping.',
      distanceFromHub: '16 km upstream from Rishikesh (30 mins)',
      bestTimeOfDay: '9:00 AM – 1:00 PM',
      packageDay: 2,
      packageMention: 'Day 2: 16km White Water Rafting & Cliff Jumping',
      insiderTip: 'Choose morning rafting slots for crystal turquoise water before afternoon glacial runoff increases.',
      elevationOrVibe: 'Himalayan Gorge • Grade III+ Rapids'
    },
    {
      id: 'uk-3',
      name: 'Gun Hill & Kempty Falls, Mussoorie',
      category: 'nature',
      x: 32,
      y: 35,
      image: 'https://images.unsplash.com/photo-1626014303757-658c3a119760?q=80&w=600&auto=format&fit=crop',
      description: 'Panoramic Himalayan viewpoints, historic British ropeway, Mall Road strolls, and roaring multi-tier waterfalls.',
      distanceFromHub: '35 km from Dehradun (1.5 hrs uphill drive)',
      bestTimeOfDay: '10:00 AM – 4:00 PM',
      packageDay: 3,
      packageMention: 'Day 3: Mussoorie "Queen of Hills" Day Excursion',
      insiderTip: 'Walk the peaceful Camel’s Back Road at sunset for undisturbed views of Bunderpoonch peak.',
      elevationOrVibe: '2,005 m • Pine Fog & Vistas'
    }
  ]
};

export const DestinationInteractiveMap: React.FC<DestinationInteractiveMapProps> = ({
  destination,
  packages,
  onSelectPackage,
  onStartAIPlan,
  onOpenQuoteModal
}) => {
  const [mapTheme, setMapTheme] = useState<'topographic' | 'explorer' | 'satellite'>('topographic');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('all');
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Generate or look up pins for this destination
  const pins: MapAttractionPin[] = useMemo(() => {
    const slug = destination.slug?.toLowerCase() || '';
    
    // Check direct key match or substring match
    const foundKey = Object.keys(REGIONAL_PINS_DATA).find(
      (k) => slug.includes(k) || destination.name.toLowerCase().includes(k) || destination.state.toLowerCase().includes(k)
    );

    if (foundKey && REGIONAL_PINS_DATA[foundKey]) {
      return REGIONAL_PINS_DATA[foundKey];
    }

    // Dynamic fallback builder based on destination.topAttractions & highlights
    const dynamicPins: MapAttractionPin[] = destination.topAttractions.map((att, idx) => {
      const positions = [
        { x: 32, y: 38 },
        { x: 65, y: 32 },
        { x: 42, y: 68 },
        { x: 74, y: 62 },
        { x: 50, y: 48 }
      ];
      const pos = positions[idx % positions.length];
      const categories: ('must-visit' | 'adventure' | 'nature' | 'heritage')[] = ['must-visit', 'nature', 'adventure', 'heritage'];
      
      return {
        id: `dyn-pin-${idx}`,
        name: att.name,
        category: categories[idx % categories.length],
        x: pos.x,
        y: pos.y,
        image: att.image,
        description: att.description,
        distanceFromHub: `${(idx + 1) * 15} km from center hub (${(idx + 1) * 20} mins)`,
        bestTimeOfDay: idx % 2 === 0 ? 'Morning (8:00 AM – 12:00 PM)' : 'Sunset (4:00 PM – 6:30 PM)',
        packageDay: idx + 1,
        packageMention: `Day ${idx + 1}: Sightseeing Tour & Highlight Experience`,
        insiderTip: destination.highlights[idx] || `Explore ${att.name} with our local private chauffeur and expert guide.`,
        elevationOrVibe: `Key Sight • ${destination.name}`
      };
    });

    return dynamicPins;
  }, [destination]);

  // Filter pins based on active category & selected package
  const filteredPins = useMemo(() => {
    return pins.filter((pin) => {
      const matchCategory = selectedCategory === 'all' || pin.category === selectedCategory;
      const matchPackage = selectedPackageId === 'all' || (pin.packageDay !== undefined);
      return matchCategory && matchPackage;
    });
  }, [pins, selectedCategory, selectedPackageId]);

  // Currently active pin object
  const activePin = useMemo(() => {
    return pins.find((p) => p.id === activePinId) || filteredPins[0] || pins[0];
  }, [pins, activePinId, filteredPins]);

  // Center or zoom pin handlers
  const handleSelectPin = (pin: MapAttractionPin) => {
    setActivePinId(pin.id);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.3, 2.2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.3, 0.9));
  };

  const handleResetMap = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    if (pins.length > 0) {
      setActivePinId(pins[0].id);
    }
  };

  // Pan drag interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: Math.max(-120, Math.min(120, e.clientX - dragStart.x)),
      y: Math.max(-120, Math.min(120, e.clientY - dragStart.y))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Category Icon helper
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'must-visit':
        return <Eye className="w-3.5 h-3.5" />;
      case 'adventure':
        return <Mountain className="w-3.5 h-3.5" />;
      case 'nature':
        return <Waves className="w-3.5 h-3.5" />;
      case 'heritage':
        return <Landmark className="w-3.5 h-3.5" />;
      case 'stay':
        return <Hotel className="w-3.5 h-3.5" />;
      default:
        return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'must-visit':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'adventure':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'nature':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'heritage':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'stay':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Generate SVG travel route path connecting pins in sequential order
  const svgRoutePoints = useMemo(() => {
    if (filteredPins.length < 2) return '';
    const sorted = [...filteredPins].sort((a, b) => (a.packageDay || 0) - (b.packageDay || 0));
    return sorted.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * 6} ${p.y * 3.6}`).join(' ');
  }, [filteredPins]);

  return (
    <section 
      id="destination-interactive-map-section" 
      className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#FAF9F6] p-6 overflow-y-auto' : ''}`}
    >
      {/* Header Bar with Title, Category Switcher & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-black border border-black/10 text-[10px] font-bold uppercase tracking-widest mb-2">
            <Compass className="w-3.5 h-3.5 text-black animate-spin" style={{ animationDuration: '12s' }} />
            <span>Interactive Tour Map & Highlights</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-black tracking-tight flex items-center gap-2.5">
            <span>Explore {destination.name} Circuit</span>
            <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {pins.length} Key Pins
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-normal max-w-2xl mt-1">
            Click any pin on the map or select from the itinerary stops below to view travel times, insider tips, and package inclusions.
          </p>
        </div>

        {/* Action Buttons: AI Plan & Fullscreen Toggle */}
        <div className="flex items-center gap-2">
          {onStartAIPlan && (
            <button
              onClick={() => onStartAIPlan(destination.name)}
              className="px-3.5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <AIIcon className="w-3.5 h-3.5 text-white" />
              <span>AI Route Planner</span>
            </button>
          )}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-black text-xs font-bold transition-colors shadow-xs cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Map'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Control Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-black text-white font-bold shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            All Pins ({pins.length})
          </button>
          <button
            onClick={() => setSelectedCategory('must-visit')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 ${
              selectedCategory === 'must-visit'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Must-Visit</span>
          </button>
          <button
            onClick={() => setSelectedCategory('nature')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 ${
              selectedCategory === 'nature'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Nature & Lakes</span>
          </button>
          <button
            onClick={() => setSelectedCategory('adventure')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 ${
              selectedCategory === 'adventure'
                ? 'bg-sky-600 text-white font-bold shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>Adventure</span>
          </button>
          <button
            onClick={() => setSelectedCategory('heritage')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 ${
              selectedCategory === 'heritage'
                ? 'bg-purple-600 text-white font-bold shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Heritage</span>
          </button>
        </div>

        {/* Map Theme Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setMapTheme('topographic')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mapTheme === 'topographic' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
            }`}
          >
            Topographic
          </button>
          <button
            onClick={() => setMapTheme('explorer')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mapTheme === 'explorer' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
            }`}
          >
            Atlas
          </button>
          <button
            onClick={() => setMapTheme('satellite')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mapTheme === 'satellite' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-500 hover:text-black'
            }`}
          >
            Dusk Satellite
          </button>
        </div>
      </div>

      {/* Main Map Container Canvas */}
      <div 
        ref={containerRef}
        className={`relative w-full rounded-3xl border border-gray-300 overflow-hidden shadow-md select-none transition-colors duration-500 ${
          mapTheme === 'topographic'
            ? 'bg-[#eef3ea]'
            : mapTheme === 'explorer'
            ? 'bg-[#F4EFE6]'
            : 'bg-[#0f172a]'
        }`}
        style={{ minHeight: '440px', height: isFullscreen ? 'calc(100vh - 280px)' : '480px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Decorative Map Grid & Contour Lines (SVG Background Texture) */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40 transition-opacity duration-300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="mapGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path 
                d="M 60 0 L 0 0 0 60" 
                fill="none" 
                stroke={mapTheme === 'satellite' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'} 
                strokeWidth="1" 
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGrid)" />
          
          {/* Subtle Topographic Elevation Curves */}
          <path
            d="M -50 150 Q 150 80, 350 200 T 750 160 T 1150 250"
            fill="none"
            stroke={mapTheme === 'satellite' ? 'rgba(56,189,248,0.2)' : 'rgba(16,185,129,0.18)'}
            strokeWidth="32"
            strokeLinecap="round"
          />
          <path
            d="M 50 380 Q 280 240, 520 320 T 920 280 T 1300 400"
            fill="none"
            stroke={mapTheme === 'satellite' ? 'rgba(14,165,233,0.15)' : 'rgba(14,165,233,0.14)'}
            strokeWidth="24"
            strokeLinecap="round"
          />
        </svg>

        {/* Animated Connecting Travel Route Path */}
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out origin-center pointer-events-none"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`
          }}
        >
          <svg 
            viewBox="0 0 600 360" 
            className="w-full h-full" 
            preserveAspectRatio="none"
          >
            {svgRoutePoints && (
              <>
                {/* Outer Glow Route */}
                <path
                  d={svgRoutePoints}
                  fill="none"
                  stroke={mapTheme === 'satellite' ? '#38bdf8' : '#0f766e'}
                  strokeWidth="3.5"
                  strokeDasharray="6 6"
                  className="opacity-70"
                />
              </>
            )}
          </svg>

          {/* Render All Attraction Pins */}
          {filteredPins.map((pin) => {
            const isActive = activePin?.id === pin.id;
            return (
              <div
                key={pin.id}
                style={{
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                  transform: 'translate(-50%, -100%)'
                }}
                className="absolute z-20 pointer-events-auto cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPin(pin);
                }}
              >
                {/* Pin Head Badge */}
                <div className="relative flex flex-col items-center">
                  {/* Active Beacon Pulse */}
                  {isActive && (
                    <span className="absolute -top-1 w-9 h-9 rounded-full bg-black/20 animate-ping pointer-events-none" />
                  )}

                  {/* Pin Circle */}
                  <div
                    className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-2xl border-2 transition-all duration-300 shadow-lg ${
                      isActive
                        ? 'bg-black text-white border-white scale-110 ring-4 ring-black/20'
                        : 'bg-white text-black border-gray-300 hover:border-black hover:scale-105'
                    }`}
                  >
                    <span className="shrink-0">{getCategoryIcon(pin.category)}</span>
                    <span className="text-[11px] font-bold tracking-tight whitespace-nowrap">
                      {pin.packageDay ? `Day ${pin.packageDay}` : pin.name}
                    </span>
                  </div>

                  {/* Pin Point Pointer Triangle */}
                  <div 
                    className={`w-2.5 h-2.5 rotate-45 -mt-1.5 border-r-2 border-b-2 ${
                      isActive ? 'bg-black border-white' : 'bg-white border-gray-300'
                    }`} 
                  />

                  {/* Small Shadow base */}
                  <div className="w-4 h-1.5 bg-black/30 rounded-full blur-[1px] mt-0.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Top-Right Map Controls: Zoom & Reset */}
        <div className="absolute top-4 right-4 z-30 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-gray-200 shadow-md">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl hover:bg-gray-100 text-black transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl hover:bg-gray-100 text-black transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetMap}
            className="p-2 rounded-xl hover:bg-gray-100 text-black transition-colors cursor-pointer"
            title="Reset Map View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom-Left Compass & Coordinates Badge */}
        <div className="absolute bottom-4 left-4 z-30 hidden sm:flex items-center gap-3 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-gray-200 text-xs text-gray-700 shadow-sm font-medium">
          <div className="flex items-center gap-1.5 font-bold text-black">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>{destination.state}</span>
          </div>
          <span className="text-gray-300">|</span>
          <span>Altitude: {destination.temperatureRange.split('|')[0] || 'Varies'}</span>
          <span className="text-gray-300">|</span>
          <span className="text-[10px] text-gray-400 font-mono">Scale 1:50k</span>
        </div>

        {/* Active Pin Detailed Flyout Popup Card (Bottom Right overlay on desktop / Bottom Drawer on mobile) */}
        {activePin && (
          <div className="absolute bottom-4 right-4 sm:right-auto sm:left-4 z-40 max-w-sm w-[calc(100%-2rem)] sm:w-88 bg-white/95 backdrop-blur-md rounded-3xl p-4 border border-gray-200 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getCategoryBadgeClass(activePin.category)}`}>
                  {activePin.category.replace('-', ' ')}
                </span>
                {activePin.packageDay && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-black text-white">
                    Day {activePin.packageDay}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap">
                {activePin.elevationOrVibe}
              </span>
            </div>

            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-gray-100 shadow-xs">
                <img
                  src={activePin.image}
                  alt={activePin.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1 overflow-hidden">
                <h4 className="font-serif font-bold text-base text-black leading-snug line-clamp-1">
                  {activePin.name}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed font-normal">
                  {activePin.description}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-gray-500 pt-0.5">
                  <Navigation className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{activePin.distanceFromHub}</span>
                </div>
              </div>
            </div>

            {/* Insider Tip Badge */}
            {activePin.insiderTip && (
              <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span className="text-[11px] font-normal leading-relaxed">
                  <strong>Insider Tip:</strong> {activePin.insiderTip}
                </span>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-1 border-t border-gray-100">
              <div className="text-[11px] text-gray-500 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3 text-gray-400" />
                <span>{activePin.bestTimeOfDay}</span>
              </div>

              {onOpenQuoteModal && (
                <button
                  onClick={() => onOpenQuoteModal(`Plan tour including ${activePin.name} in ${destination.name}`)}
                  className="text-xs font-bold text-black hover:opacity-75 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Include in Trip</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pinned Attraction Cards Horizontal Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Itinerary Sequence & Attraction Cards ({filteredPins.length})
          </h3>
          <span className="text-xs text-gray-500 font-normal">Click to focus pin</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPins.map((pin) => {
            const isSelected = activePin?.id === pin.id;
            return (
              <div
                key={pin.id}
                onClick={() => handleSelectPin(pin)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 shadow-xs ${
                  isSelected
                    ? 'bg-white border-black ring-2 ring-black/10'
                    : 'bg-white border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                  <img src={pin.image} alt={pin.name} className="w-full h-full object-cover" />
                  {pin.packageDay && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-black text-white">
                      Day {pin.packageDay}
                    </span>
                  )}
                </div>

                <div className="space-y-1 flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getCategoryBadgeClass(pin.category)}`}>
                      {pin.category}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-black truncate">{pin.name}</h4>
                  <p className="text-xs text-gray-500 truncate font-normal">{pin.distanceFromHub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
