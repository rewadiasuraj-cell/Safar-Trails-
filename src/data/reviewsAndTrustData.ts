import { CustomerReview, TripType } from '../types';

export const customerReviewsData: CustomerReview[] = [
  {
    id: 'rev-1',
    authorName: 'Vikram & Ananya Sen',
    city: 'Bengaluru',
    tripName: 'Kashmir Escape & Houseboat Bliss (6D/5N)',
    destination: 'Kashmir',
    rating: 5,
    reviewText: 'We created an initial itinerary using SafarTrails AI in 2 minutes, and then connected with Tariq on WhatsApp who fine-tuned our Gulmarg Gondola slots and booked an incredible houseboat in Nigeen Lake. The chauffeur Bilal was courteous, punctual, and safe on mountain roads. Truly zero hassle!',
    date: 'February 2026',
    travelType: 'Honeymoon Couple',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    verified: true
  },
  {
    id: 'rev-2',
    authorName: 'Rajesh & Meenakshi Kulkarni',
    city: 'Pune',
    tripName: 'Kerala Nature & Houseboat Cruise (6D/5N)',
    destination: 'Kerala',
    rating: 5,
    reviewText: 'Travelling with elderly parents and two kids is usually stressful. SafarTrails arranged a comfortable Innova Crysta throughout. The private houseboat in Alleppey was spotless, and the chef made special mild Jain food for my parents. Highly recommend!',
    date: 'January 2026',
    travelType: 'Family with Parents & Kids',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    verified: true
  },
  {
    id: 'rev-3',
    authorName: 'Kavita Chawla & Friends',
    city: 'New Delhi',
    tripName: 'Andaman Turquoise Dreams (6D/5N)',
    destination: 'Andaman',
    rating: 5,
    reviewText: 'The Makruzz ferry tickets and Radhanagar beach sunset was flawless. Scuba diving in Elephant Beach was the highlight of our year! Having a local SafarTrails island coordinator at Havelock jetty saved us from long queues.',
    date: 'January 2026',
    travelType: 'Friends Group',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
    verified: true
  },
  {
    id: 'rev-4',
    authorName: 'Siddharth Mehta',
    city: 'Mumbai',
    tripName: 'Royal Rajasthan Heritage Circuit (7D/6N)',
    destination: 'Rajasthan',
    rating: 5,
    reviewText: 'The Swiss desert camp at Sam Sand Dunes in Jaisalmer was magical under the stars. Dal Baati Churma and folk dance was 10/10. The pricing was 100% transparent with no sudden driver demands.',
    date: 'December 2025',
    travelType: 'Couple Trip',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    verified: true
  }
];

export interface TravelStyleCategory {
  id: string;
  name: string;
  tripType: TripType;
  tagline: string;
  image: string;
  recommendedDestinations: string[];
}

export const travelStylesData: TravelStyleCategory[] = [
  {
    id: 'honeymoon',
    name: 'Honeymoon & Romance',
    tripType: 'Honeymoon',
    tagline: 'Private candlelit dinners, luxury houseboats & scenic mountain suites.',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=600&auto=format&fit=crop',
    recommendedDestinations: ['Kashmir', 'Andaman', 'Kerala', 'Goa']
  },
  {
    id: 'family',
    name: 'Family Holidays',
    tripType: 'Family',
    tagline: 'Comfortable spacious vehicles, child-friendly resorts & stress-free pacing.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600&auto=format&fit=crop',
    recommendedDestinations: ['Kerala', 'Himachal Pradesh', 'Kashmir', 'Rajasthan']
  },
  {
    id: 'adventure',
    name: 'Adventure & Treks',
    tripType: 'Adventure',
    tagline: 'White water rafting, high-altitude passes, skiing & root bridge treks.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1200&auto=format&fit=crop',
    recommendedDestinations: ['Uttarakhand', 'Himachal Pradesh', 'Northeast India']
  },
  {
    id: 'luxury',
    name: 'Luxury & Heritage',
    tripType: 'Luxury',
    tagline: 'Royal palaces, private yachts, five-star wellness retreats & butler service.',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600&auto=format&fit=crop',
    recommendedDestinations: ['Rajasthan', 'Goa', 'Andaman']
  },
  {
    id: 'spiritual',
    name: 'Spiritual & Wellness',
    tripType: 'Spiritual',
    tagline: 'Sacred river ghats, temple circuits, authentic Ayurveda & meditation retreats.',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=600&auto=format&fit=crop',
    recommendedDestinations: ['Uttarakhand', 'Kerala', 'Himachal Pradesh']
  },
  {
    id: 'weekend',
    name: 'Quick Long Weekends',
    tripType: 'Weekend',
    tagline: 'Short 3 to 4-day rejuvenating escapes with rapid flight & road access.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop',
    recommendedDestinations: ['Goa', 'Uttarakhand', 'Himachal Pradesh']
  }
];

export interface SeasonalTrip {
  id: string;
  seasonName: string;
  badge: string;
  subtitle: string;
  destinations: string[];
  image: string;
}

export const seasonalTripsData: SeasonalTrip[] = [
  {
    id: 'summer-retreats',
    seasonName: 'Summer Escapes (March – June)',
    badge: 'Beat the Plains Heat',
    subtitle: 'Cool pine breezes, blooming tulip gardens, tea plantations and alpine snow.',
    destinations: ['Kashmir', 'Himachal Pradesh', 'Uttarakhand', 'Northeast India'],
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'monsoon-magic',
    seasonName: 'Monsoon Escapes (July – September)',
    badge: 'Lush & Rejuvenating',
    subtitle: 'Roaring waterfalls in Meghalaya, green Goan backwaters, and Ayurvedic therapies in Kerala.',
    destinations: ['Meghalaya', 'Kerala', 'Goa'],
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'winter-wonders',
    seasonName: 'Winter Holidays (October – February)',
    badge: 'Snow & Royal Sunshine',
    subtitle: 'Gulmarg skiing, golden Thar desert glamping, and turquoise tropical waters in Andaman.',
    destinations: ['Kashmir', 'Rajasthan', 'Andaman', 'Goa'],
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=1200&auto=format&fit=crop'
  }
];

export const generalFaqs = [
  {
    question: 'How does SafarTrails work? What does "AI plans. Experts perfect." mean?',
    answer: 'You can use our interactive AI Trip Planner to enter any natural travel idea (e.g. "4 friends, 6 days Kashmir under 80k"). The AI instantly generates a realistic day-by-day itinerary and cost estimate. Then, our verified human destination specialists review and lock in verified hotel inventory, transport, and special requests before finalizing on WhatsApp.'
  },
  {
    question: 'Are the package prices final or estimated?',
    answer: 'All displayed website rates are estimated starting prices calculated on twin-sharing basis for standard/deluxe stays. Real-time rates depend on exact travel dates, flight fares, room availability, and custom upgrades. Your dedicated expert provides a 100% fixed, transparent quote before any advance payment.'
  },
  {
    question: 'Can I customize any package (e.g. add extra days, change hotels)?',
    answer: 'Absolutely. Every package on SafarTrails is 100% customizable. You can swap hotels to 5★ luxury resorts, add candlelit dinners, upgrade to an Innova Crysta, or extend your stay.'
  },
  {
    question: 'How do payments and booking confirmations work?',
    answer: 'Once you approve your custom itinerary with your travel expert, a modest booking token is required to block verified hotel rooms and cab allocations. A detailed booking voucher with hotel confirmation numbers and driver details is issued before travel.'
  },
  {
    question: 'What happens if our flight gets rescheduled or weather disrupts travel?',
    answer: 'SafarTrails provides 24/7 dedicated on-trip concierge assistance. If road closures or airline delays happen, our ground team immediately re-routes your cab and coordinates with hotels to minimize inconvenience.'
  }
];
