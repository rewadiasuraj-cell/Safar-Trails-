import { Package } from '../types';

export const packagesData: Package[] = [
  {
    id: 'pkg-kashmir-escape',
    slug: 'kashmir-escape-houseboat-bliss',
    title: 'Kashmir Escape & Houseboat Bliss',
    destination: 'Kashmir',
    state: 'Jammu & Kashmir',
    durationDays: 6,
    durationNights: 5,
    startingPrice: 17499,
    originalPrice: 22000,
    tripType: ['Couple', 'Family', 'Honeymoon'],
    hotelCategory: 'Deluxe 4★',
    ratings: 4.9,
    reviewCount: 342,
    startingCity: 'Srinagar (Airport Pickup)',
    bestFor: 'Couples, Families & Nature Enthusiasts',
    heroImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1626014303757-658c3a119760?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=800&auto=format&fit=crop'
    ],
    overview: 'Experience the magic of Kashmir with this 6-day signature journey. Enjoy an authentic cedarwood Houseboat stay on Dal Lake, scenic Gondola cable car ride in Gulmarg, pine walks in Pahalgam, and snow vistas in Sonamarg, with private sanitized transfers throughout.',
    highlights: [
      '1 Night in Luxury Dal Lake Houseboat with Shikara sunset ride',
      '2 Nights in scenic Srinagar + 2 Nights in pine valley Pahalgam',
      'Excursion to Gulmarg with assistance for Gondola Phase 1 & 2 tickets',
      'Day trip to Sonamarg ("Meadow of Gold") & Thajiwas Glacier',
      'Daily freshly prepared Kashmiri Breakfast and Dinner',
      'Private dedicated sedan/SUV cab with polite local chauffeur'
    ],
    inclusions: [
      '5 Nights accommodation in handpicked 3★/4★ hotels & luxury houseboat',
      'Daily Breakfast & Dinner at all hotels and houseboat (MAP plan)',
      '1-Hour complimentary Shikara Ride on Dal Lake at sunset',
      'Dedicated private Sedan/Innova for all airport transfers and sightseeing',
      'All toll taxes, parking fees, driver allowance, and fuel charges',
      '24/7 dedicated on-trip concierge and local ground support'
    ],
    exclusions: [
      'Airfare to and from Srinagar Airport',
      'Gulmarg Gondola tickets, pony rides, and sledge hire fees',
      'Local Union taxi in Pahalgam (Aru, Betaab, Chandanwari) as per J&K tourist rule',
      'Personal expenses, laundry, monument entry fees, and travel insurance'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Srinagar & Dal Lake Shikara Sunset',
        location: 'Srinagar',
        description: 'Warm welcome by our SafarTrails representative at Srinagar Airport. Transfer to your luxury Houseboat on Dal Lake. In the evening, embark on a magical 1-hour Shikara ride passing floating gardens, lotus beds, and vibrant lake markets.',
        morningActivity: 'Airport pickup and check-in to heritage cedar Houseboat',
        afternoonActivity: 'Leisurely walk along the Boulevard Road & local Kahwa tasting',
        eveningActivity: 'Sunset Shikara ride on Dal Lake & traditional Kashmiri dinner',
        stay: 'Heritage Deluxe Houseboat, Dal Lake',
        mealsIncluded: 'Dinner',
        transfers: 'Private Chauffeur Cab',
        image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=600&auto=format&fit=crop',
        insiderTip: 'Ask your Shikara boatman to take you to the quieter interior channels of Nigeen lake for postcard-worthy sunset photos.'
      },
      {
        dayNumber: 2,
        title: 'Srinagar to Gulmarg Day Trip (Meadow of Flowers)',
        location: 'Gulmarg',
        description: 'Drive along willow-lined highways to Gulmarg (approx. 50 km / 1.5 hrs). Board the renowned Gulmarg Gondola — one of the highest cable cars in the world — to reach Kongdoori (Phase 1) and Apharwat Peak (Phase 2 at 13,780 ft). Return to Srinagar for dinner.',
        morningActivity: 'Scenic drive to Gulmarg with apple orchard photo stops',
        afternoonActivity: 'Gondola ride to snow-clad Apharwat peak & snow activities',
        eveningActivity: 'Visit historic St. Mary’s Church and return to Srinagar hotel',
        stay: 'Hotel Grand Boulevard / Similar 4★, Srinagar',
        mealsIncluded: 'Breakfast & Dinner',
        transfers: 'Private Chauffeur Cab',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600&auto=format&fit=crop',
        insiderTip: 'Keep your Gondola Phase 2 e-tickets printed or easily saved on your phone before ascending.'
      },
      {
        dayNumber: 3,
        title: 'Srinagar to Pahalgam (Valley of Shepherds) via Saffron Fields',
        location: 'Pahalgam',
        description: 'Journey to picturesque Pahalgam (approx. 90 km / 2.5 hrs). En route, halt at the ancient Avantipur Temple ruins and vibrant Pampore saffron fields. Check in at your pine-facing river resort in Pahalgam.',
        morningActivity: 'Drive to Pahalgam with Saffron & Cricket Bat factory visits',
        afternoonActivity: 'Check-in to riverside resort along the roaring Lidder River',
        eveningActivity: 'Leisure walk in Pahalgam market and hot walnut fudge tasting',
        stay: 'Pine Spring Resort / Eden Resorts 4★, Pahalgam',
        mealsIncluded: 'Breakfast & Dinner',
        transfers: 'Private Chauffeur Cab',
        image: 'https://images.unsplash.com/photo-1626014303757-658c3a119760?q=80&w=600&auto=format&fit=crop'
      },
      {
        dayNumber: 4,
        title: 'Exploring Betaab Valley, Aru Valley & Baisaran',
        location: 'Pahalgam',
        description: 'Explore the verdant landscapes of Pahalgam. Board the local union cab to visit Betaab Valley (where Bollywood movies were filmed), Aru Valley wildlife hamlet, and optional pony trek to Baisaran Meadow ("Mini Switzerland").',
        morningActivity: 'Excursion to Aru Valley and Betaab Valley riverbanks',
        afternoonActivity: 'Visit Chandanwari & optional Baisaran pine meadow walk',
        eveningActivity: 'Bonfire by the Lidder river at your resort',
        stay: 'Pine Spring Resort / Eden Resorts 4★, Pahalgam',
        mealsIncluded: 'Breakfast & Dinner',
        transfers: 'Local Union Cab + Private Chauffeur',
        image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=600&auto=format&fit=crop'
      },
      {
        dayNumber: 5,
        title: 'Pahalgam to Sonamarg Excursion & Return to Srinagar',
        location: 'Sonamarg & Srinagar',
        description: 'Travel to the majestic golden meadow of Sonamarg nestled under snowy Himalayan peaks. Admire the Sindh River and take a pony ride to Thajiwas Glacier. In the late afternoon, return to Srinagar and visit the Mughal Gardens (Nishat & Shalimar Bagh).',
        morningActivity: 'Drive along Sindh Valley to Sonamarg meadow',
        afternoonActivity: 'Thajiwas Glacier views & pony sledging',
        eveningActivity: 'Visit Nishat Bagh & Shalimar Mughal Gardens in Srinagar',
        stay: 'Hotel Grand Boulevard / Similar 4★, Srinagar',
        mealsIncluded: 'Breakfast & Dinner',
        transfers: 'Private Chauffeur Cab',
        image: 'https://images.unsplash.com/photo-1588661799793-7da9f7336798?q=80&w=600&auto=format&fit=crop'
      },
      {
        dayNumber: 6,
        title: 'Srinagar Souvenir Shopping & Airport Drop',
        location: 'Srinagar Departure',
        description: 'Relish a hearty breakfast. Depending on flight timings, stop for authentic Kashmiri dry fruits, Pashmina shawls, and saffron in Lal Chowk before your transfer to Srinagar Airport for your onward journey.',
        morningActivity: 'Breakfast & Lal Chowk handicraft shopping',
        afternoonActivity: 'Airport transfer with sweet memories of Kashmir',
        mealsIncluded: 'Breakfast',
        transfers: 'Private Airport Drop'
      }
    ],
    season: 'All Season',
    isFeatured: true,
    isPopular: true
  },
  {
    id: 'pkg-kerala-grand-nature',
    slug: 'kerala-nature-munnar-alleppey-houseboat',
    title: 'Kerala Backwaters & Misty Munnar Retreat',
    destination: 'Kerala',
    state: 'Kerala',
    durationDays: 6,
    durationNights: 5,
    startingPrice: 15999,
    originalPrice: 19500,
    tripType: ['Couple', 'Family', 'Honeymoon', 'Relaxation' as any],
    hotelCategory: 'Deluxe 4★',
    ratings: 4.8,
    reviewCount: 289,
    startingCity: 'Kochi (Airport/Station Pickup)',
    bestFor: 'Couples, Families & Wellness Seekers',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=800&auto=format&fit=crop'
    ],
    overview: 'Indulge in God’s Own Country: traverse aromatic tea gardens in Munnar, encounter wild elephants in Thekkady’s Periyar lake, and spend a night cruising peaceful palm-lined canals in a private Alleppey houseboat.',
    highlights: [
      '2 Nights in Munnar with Cheeyappara Waterfalls & Tea Museum',
      '1 Night in Thekkady with Spice Plantation & Periyar Boat Safari',
      '1 Night in Private Alleppey AC Houseboat with traditional Kerala Feast',
      '1 Night in historic Fort Kochi with Chinese Fishing Nets',
      'Authentic Ayurvedic wellness consultation voucher'
    ],
    inclusions: [
      '5 Nights accommodation in curated 3★/4★ resorts + exclusive Houseboat',
      'All meals on Houseboat (Lunch, Evening Tea & Snacks, Dinner, Breakfast)',
      'Daily Breakfast at Munnar, Thekkady, and Kochi hotels',
      'Private air-conditioned Sedan/Ertiga/Innova throughout trip',
      'Spice plantation tour tickets in Thekkady',
      'All toll, parking, driver charges, and 24/7 SafarTrails concierge'
    ],
    exclusions: [
      'Flights/train tickets to Kochi',
      'Periyar boat safari tickets (booked at sanctuary counter/online)',
      'Kathakali/Kalaripayattu show tickets (optional add-on)',
      'Personal laundry, beverages, and tips'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Kochi Arrival & Scenic Drive to Munnar Hills',
        location: 'Kochi to Munnar',
        description: 'Pickup from Kochi Airport/Railway station. Embark on a breathtaking drive to Munnar. En route, stop at the cascading Cheeyappara and Valara waterfalls. Check in at your tea-valley resort in Munnar.',
        morningActivity: 'Airport reception & highway drive into the Western Ghats',
        afternoonActivity: 'Cheeyappara waterfalls stop & spice garden stroll',
        eveningActivity: 'Check-in to mountain resort & evening campfire',
        stay: 'Misty Mountain Resort / Amber Dale 4★, Munnar',
        mealsIncluded: 'Dinner',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 2,
        title: 'Munnar Tea Estates, Eravikulam & Mattupetty Dam',
        location: 'Munnar',
        description: 'Full day of Munnar sightseeing. Visit Eravikulam National Park (habitat of Nilgiri Tahr), Tata Tea Museum with tea tasting, Mattupetty Dam, Echo Point, and Kundala Lake.',
        morningActivity: 'Eravikulam National Park safari',
        afternoonActivity: 'Tea factory tour & boating at Mattupetty Dam',
        eveningActivity: 'Stroll in Munnar town and shop for pure spices & cocoa',
        stay: 'Misty Mountain Resort / Amber Dale 4★, Munnar',
        mealsIncluded: 'Breakfast & Dinner',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 3,
        title: 'Munnar to Thekkady Spice Hills & Periyar Sanctuary',
        location: 'Thekkady',
        description: 'Drive through cardamom and pepper hills to Thekkady. Take a guided tour of a certified organic spice plantation. Later, enjoy a boat safari on Periyar Lake inside the tiger reserve.',
        morningActivity: 'Scenic drive to Thekkady (approx. 3 hrs)',
        afternoonActivity: 'Guided spice plantation walk & Periyar boat ride',
        eveningActivity: 'Watch traditional Kathakali and Kalaripayattu performance',
        stay: 'Cardamom County / Poetree Sarovar 4★, Thekkady',
        mealsIncluded: 'Breakfast & Dinner',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 4,
        title: 'Thekkady to Alleppey Private Houseboat Cruise',
        location: 'Alleppey Backwaters',
        description: 'Descend the hills to Alleppey backwaters. Board your private traditionally crafted Kettuvallam houseboat around 12:30 PM. Cruise along serene canals, lush paddy fields, and backwater villages while enjoying freshly prepared Kerala delicacies.',
        morningActivity: 'Drive to Alleppey jetty & welcome tender coconut drink',
        afternoonActivity: 'Houseboat cruise with fresh Karimeen fish / Veg Kerala lunch',
        eveningActivity: 'Anchor at tranquil backwater village for sunset walk',
        stay: 'Private Deluxe AC Houseboat, Alleppey',
        mealsIncluded: 'Breakfast, Lunch, Evening Snacks & Dinner',
        transfers: 'Private AC Cab + Houseboat'
      },
      {
        dayNumber: 5,
        title: 'Alleppey to Fort Kochi Heritage Exploration',
        location: 'Fort Kochi',
        description: 'Enjoy sunrise breakfast on the houseboat sundeck. Disembark at 9:00 AM and drive to Fort Kochi. Explore the historic Jew Town, Paradesi Synagogue, Santa Cruz Basilica, and the iconic Chinese Fishing Nets at sunset.',
        morningActivity: 'Backwater disembarkation and transfer to Kochi',
        afternoonActivity: 'Heritage walk in Fort Kochi & Jew Street antiques',
        eveningActivity: 'Sunset at Fort Kochi beach & seafood dining',
        stay: 'Brunton Boatyard / Dutch Bungalow Heritage 4★, Kochi',
        mealsIncluded: 'Breakfast',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 6,
        title: 'Kochi Souvenir Shopping & Departure',
        location: 'Kochi Departure',
        description: 'Breakfast at hotel followed by transfer to Kochi International Airport / Ernakulam Railway Station for onward journey.',
        morningActivity: 'Breakfast & Lulu Mall or local banana chips shopping',
        afternoonActivity: 'Airport drop with unforgettable Kerala memories',
        mealsIncluded: 'Breakfast',
        transfers: 'Private AC Cab'
      }
    ],
    season: 'All Season',
    isFeatured: true,
    isPopular: true
  },
  {
    id: 'pkg-royal-rajasthan',
    slug: 'royal-rajasthan-heritage-desert-dunes',
    title: 'Royal Rajasthan: Palaces & Desert Dunes',
    destination: 'Rajasthan',
    state: 'Rajasthan',
    durationDays: 7,
    durationNights: 6,
    startingPrice: 18999,
    originalPrice: 24500,
    tripType: ['Family', 'Couple', 'Group', 'Luxury'],
    hotelCategory: 'Heritage Boutique',
    ratings: 4.9,
    reviewCount: 215,
    startingCity: 'Jaipur (Airport/Station Pickup)',
    bestFor: 'Heritage Lovers, Families & Stargazers',
    heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop'
    ],
    overview: 'Embark on a regal circuit through the Golden Triangle of Rajasthan: Jaipur’s majestic hill forts, Jodhpur’s imposing Mehrangarh fortress, and the romantic golden dunes of Jaisalmer with luxury Swiss tent glamping.',
    highlights: [
      '2 Nights in Jaipur + 1 Night in Jodhpur + 2 Nights in Jaisalmer + 1 Night Bikaner',
      'Amber Fort Jeep ascent, City Palace, and Hawa Mahal photo stop',
      'Desert Jeep Safari & Camel ride on Sam Sand Dunes with Kalbeliya dance show',
      'Stay in authentic heritage Haveli in Jaipur and Jodhpur',
      'Delicious authentic Rajasthani Dal Baati Churma dinner included'
    ],
    inclusions: [
      '6 Nights accommodation in handpicked heritage hotels & luxury Swiss desert camp',
      'Daily Breakfast and Dinner throughout the journey',
      'Sam Sand Dunes Desert Safari with evening cultural folk performance & buffet',
      'Dedicated private AC Sedan/Innova with experienced interstate chauffeur',
      'All interstate road taxes, toll charges, and parking fees'
    ],
    exclusions: [
      'Air/Train fares to Jaipur and from Jodhpur/Jaipur',
      'Monument entry tickets and guide fees at palaces/forts',
      'Personal camera fees, room service, and personal expenses'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in the Pink City Jaipur & Chokhi Dhani Vibe',
        location: 'Jaipur',
        description: 'Arrive at Jaipur Airport/Station and check in to your heritage hotel. In the evening, visit the illuminated Albert Hall Museum and explore the bustling Johari Bazaar.',
        morningActivity: 'Airport reception & check-in',
        afternoonActivity: 'Visit Birla Mandir & Albert Hall Museum',
        eveningActivity: 'Bazaar shopping & traditional Rajasthani dinner',
        stay: 'Shahpura House / Traditional Haveli 4★, Jaipur',
        mealsIncluded: 'Dinner',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 2,
        title: 'Jaipur Forts: Amber, Jal Mahal, City Palace & Hawa Mahal',
        location: 'Jaipur',
        description: 'Explore the grand Amber Fort with its mirror palace (Sheesh Mahal). Stop by Jal Mahal floating in Man Sagar Lake, followed by Jaipur City Palace and the iconic honeycomb facade of Hawa Mahal.',
        morningActivity: 'Amber Fort exploration & Jal Mahal photo stop',
        afternoonActivity: 'Jaipur City Palace & Jantar Mantar observatory',
        eveningActivity: 'Sunset view from Nahargarh Fort overlooking Jaipur city',
        stay: 'Shahpura House / Traditional Haveli 4★, Jaipur',
        mealsIncluded: 'Breakfast & Dinner',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 3,
        title: 'Jaipur to the Blue City Jodhpur & Mehrangarh Fort',
        location: 'Jodhpur',
        description: 'Drive from Jaipur to Jodhpur (approx. 5.5 hrs). Check in and visit the colossal Mehrangarh Fort, Jaswant Thada marble cenotaph, and take a stroll in the indigo-painted Brahmin alleyways.',
        morningActivity: 'Highway drive to Jodhpur with lunch stop',
        afternoonActivity: 'Tour of Mehrangarh Fort and Jaswant Thada',
        eveningActivity: 'Explore Clock Tower market and taste famous Mirchi Vada',
        stay: 'Ranbanka Palace / Heritage Haveli 4★, Jodhpur',
        mealsIncluded: 'Breakfast & Dinner',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 4,
        title: 'Jodhpur to the Golden Desert City Jaisalmer',
        location: 'Jaisalmer',
        description: 'Drive across the Thar Desert to Jaisalmer (approx. 4.5 hrs). Visit the mysterious abandoned village of Kuldhara. Check into your boutique hotel within view of the Golden Fort.',
        morningActivity: 'Drive to Jaisalmer with Kuldhara village stop',
        afternoonActivity: 'Check-in and visit Gadisar Lake at sunset',
        eveningActivity: 'Rooftop dinner overlooking the illuminated golden fort',
        stay: 'Fort Rajwada / Sairafort 4★, Jaisalmer',
        mealsIncluded: 'Breakfast & Dinner',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 5,
        title: 'Jaisalmer Fort, Patwon Ki Haveli & Sam Sand Dunes Safari',
        location: 'Sam Sand Dunes',
        description: 'Tour the living Sonar Qila (Golden Fort) and intricately carved Patwon Ki Haveli. In the afternoon, head to Sam Sand Dunes. Enjoy thrilling dune bashing, sunset camel ride, bonfire, folk music, and Kalbeliya dance under the stars.',
        morningActivity: 'Living Fort walking tour & Jain temples',
        afternoonActivity: 'Transfer to Luxury Swiss Desert Camp at Sam Dunes',
        eveningActivity: '4x4 Jeep safari, camel ride, folk music & dinner buffet',
        stay: 'Luxury Swiss Desert Camp, Sam Dunes',
        mealsIncluded: 'Breakfast & Dinner',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 6,
        title: 'Sam Dunes to Bikaner & Junagarh Fort',
        location: 'Bikaner',
        description: 'After sunrise over the dunes, drive to Bikaner (approx. 5 hrs). Visit the unvanquished Junagarh Fort with its gilded gold-leaf ceilings, followed by a visit to the National Camel Breeding Farm.',
        morningActivity: 'Drive to Bikaner via Pokhran',
        afternoonActivity: 'Tour Junagarh Fort and Lalgarh Palace',
        eveningActivity: 'Taste authentic Bikaneri Bhujia and sweets',
        stay: 'Narendra Bhawan / Heritage 4★, Bikaner',
        mealsIncluded: 'Breakfast & Dinner',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 7,
        title: 'Bikaner to Jaipur / Jodhpur Departure',
        location: 'Jaipur / Jodhpur Departure',
        description: 'Enjoy breakfast and drive back to Jaipur/Jodhpur Airport for onward flight with royal memories.',
        morningActivity: 'Breakfast & return highway drive',
        afternoonActivity: 'Airport drop off',
        mealsIncluded: 'Breakfast',
        transfers: 'Private AC Cab'
      }
    ],
    season: 'Winter',
    isFeatured: true,
    isPopular: true
  },
  {
    id: 'pkg-andaman-turquoise',
    slug: 'andaman-turquoise-havelock-scuba-dream',
    title: 'Andaman Turquoise Dreams & Havelock Island',
    destination: 'Andaman',
    state: 'Andaman & Nicobar',
    durationDays: 6,
    durationNights: 5,
    startingPrice: 22999,
    originalPrice: 28999,
    tripType: ['Honeymoon', 'Couple', 'Family', 'Adventure'],
    hotelCategory: 'Luxury 5★',
    ratings: 5.0,
    reviewCount: 178,
    startingCity: 'Port Blair (Airport Pickup)',
    bestFor: 'Honeymooners, Divers & Island Explorers',
    heroImage: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop'
    ],
    overview: 'Escape to India’s pristine tropical frontier. Includes high-speed luxury catamaran cruise (Makruzz/Nautika), 2 nights on Havelock Island with Radhanagar sunset, scuba diving at Elephant beach, and 1 night on Neil Island.',
    highlights: [
      '2 Nights Havelock Island beachfront resort + 1 Night Neil Island + 2 Nights Port Blair',
      'Confirmed Makruzz/Nautika Luxury Catamaran cruise tickets',
      'Visit Radhanagar Beach (Asia’s Best Beach) and Elephant Beach water sports',
      'Cellular Jail Light & Sound Show + Corbyn’s Cove Beach',
      'Natural Rock Formation & coral glass-bottom boat at Neil Island'
    ],
    inclusions: [
      '5 Nights stay in premium beach resorts with daily buffet breakfast',
      'All inter-island ferry tickets in Premium AC Catamaran (Port Blair - Havelock - Neil - Port Blair)',
      'All private AC transfers on Port Blair, Havelock, and Neil Island',
      'Cellular Jail entry tickets and light & sound show passes',
      'Dedicated island coordinators at every jetty'
    ],
    exclusions: [
      'Flight tickets to Port Blair',
      'Scuba diving, sea walk, parasailing, and jet ski activity fees',
      'Personal tips and expenses'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Port Blair Arrival, Corbyn’s Cove & Cellular Jail Light & Sound',
        location: 'Port Blair',
        description: 'Arrive at Port Blair Airport and transfer to hotel. Visit Corbyn’s Cove Beach for coconut water, followed by Cellular Jail and its moving evening Light & Sound presentation.',
        morningActivity: 'Airport pickup & hotel check-in',
        afternoonActivity: 'Relaxation at Corbyn’s Cove palm-fringed coast',
        eveningActivity: 'Historic Cellular Jail tour & evening Light & Sound show',
        stay: 'Sinclairs Bayview / Symphony Samudra 4★, Port Blair',
        mealsIncluded: 'Breakfast',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 2,
        title: 'High-Speed Ferry to Havelock Island & Radhanagar Sunset',
        location: 'Havelock Island (Swaraj Dweep)',
        description: 'Board the luxury Makruzz catamaran to Havelock Island. Check in to your beach resort. Later, witness the world-famous golden sunset at Radhanagar Beach (Beach No. 7).',
        morningActivity: 'Catamaran cruise across azure waters to Havelock',
        afternoonActivity: 'Check-in to beachfront resort & pool dip',
        eveningActivity: 'Spectacular sunset at Radhanagar Beach',
        stay: 'Barefoot at Havelock / Symphony Palms Beach Resort 4★, Havelock',
        mealsIncluded: 'Breakfast',
        transfers: 'Luxury Catamaran + Private Cab'
      },
      {
        dayNumber: 3,
        title: 'Elephant Beach Scuba, Snorkeling & Water Sports',
        location: 'Havelock Island',
        description: 'Speedboat ride to Elephant Beach. Indulge in snorkeling among live corals, sea walking, or discover scuba diving with certified dive instructors.',
        morningActivity: 'Speedboat transfer to Elephant Beach',
        afternoonActivity: 'Underwater coral viewing, sea walk or scuba diving',
        eveningActivity: 'Candlelight beachside dinner (optional add-on for couples)',
        stay: 'Barefoot at Havelock / Symphony Palms Beach Resort 4★, Havelock',
        mealsIncluded: 'Breakfast',
        transfers: 'Speedboat + Private Cab'
      },
      {
        dayNumber: 4,
        title: 'Havelock to Neil Island (Shaheed Dweep) & Natural Bridge',
        location: 'Neil Island',
        description: 'Cruise to the peaceful island of Neil. Visit the famous Howrah Bridge (natural living rock formation), Bharatpur Beach for shallow reef swimming, and Laxmanpur Beach for sunset.',
        morningActivity: 'Morning ferry to Neil Island and check-in',
        afternoonActivity: 'Explore Natural Coral Rock Formation & Bharatpur reef',
        eveningActivity: 'Sunset at Laxmanpur Beach Point 1',
        stay: 'Summer Sands Beach Resort / Pearl Park 4★, Neil Island',
        mealsIncluded: 'Breakfast',
        transfers: 'Luxury Catamaran + Private Cab'
      },
      {
        dayNumber: 5,
        title: 'Neil Island to Port Blair & Local Souvenir Market',
        location: 'Port Blair',
        description: 'Board return ferry back to Port Blair. Visit Sagarika Emporium for pearl jewellery and shell handicrafts. Enjoy a farewell coastal seafood dinner.',
        morningActivity: 'Return ferry to Port Blair',
        afternoonActivity: 'Sagarika Handicraft Emporium & Chatham Saw Mill',
        eveningActivity: 'Fine dining dinner at harbor view lounge',
        stay: 'Sinclairs Bayview / Symphony Samudra 4★, Port Blair',
        mealsIncluded: 'Breakfast',
        transfers: 'Luxury Catamaran + Private Cab'
      },
      {
        dayNumber: 6,
        title: 'Port Blair Airport Departure',
        location: 'Port Blair Departure',
        description: 'Transfer to Port Blair Airport for your flight back home with memories of emerald waters and white sands.',
        morningActivity: 'Breakfast & airport transfer',
        mealsIncluded: 'Breakfast',
        transfers: 'Private Airport Cab'
      }
    ],
    season: 'All Season',
    isFeatured: true,
    isPopular: true
  },
  {
    id: 'pkg-romantic-goa-boutique',
    slug: 'romantic-goa-boutique-beach-backwater',
    title: 'Goa Boutique Beach, Sunsets & Latin Quarters',
    destination: 'Goa',
    state: 'Goa',
    durationDays: 5,
    durationNights: 4,
    startingPrice: 12999,
    originalPrice: 16500,
    tripType: ['Couple', 'Honeymoon', 'Friends', 'Weekend'],
    hotelCategory: 'Deluxe 4★',
    ratings: 4.8,
    reviewCount: 312,
    startingCity: 'Goa (Mopa or Dabolim Airport Pickup)',
    bestFor: 'Couples, Young Travelers & Foodies',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'
    ],
    overview: 'The quintessential Goa holiday designed with balance: relax in luxury South Goa resorts, walk through vibrant Portuguese heritage streets in Fontainhas, and explore North Goa’s chic cafes and sunset cruises.',
    highlights: [
      '4 Nights in 4★ Boutique Beach Resort with daily buffet breakfast',
      'Private sunset river cruise on Mandovi with Goan live folk music',
      'Guided walking photography tour of Fontainhas Latin Quarter',
      'Day trip to South Goa beaches (Palolem, Agonda & Cabo de Rama Fort)',
      'Dedicated private AC cab for all tours and transfers'
    ],
    inclusions: [
      '4 Nights stay in 4★ boutique beach resort',
      'Daily breakfast at hotel',
      'Private airport pickup and drop off (GOX or GOI)',
      'Full day North Goa sightseeing & Full day South Goa beaches tour',
      'Sunset Mandovi river cruise passes'
    ],
    exclusions: [
      'Flight tickets to Goa',
      'Water sports activity packages (can be booked at jetty)',
      'Club entry fees and alcohol'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Goa & Sunset Beach Walk',
        location: 'Goa Arrival',
        description: 'Warm pickup at Mopa (GOX) or Dabolim (GOI) airport. Transfer to your beach resort. Relax by the pool and take a leisurely sunset walk along the beach.',
        morningActivity: 'Airport pickup & check-in',
        afternoonActivity: 'Poolside relaxation and tropical welcome drink',
        eveningActivity: 'Sunset walk at Candolim/Benaulim beach shack',
        stay: 'Hard Rock Hotel / Heritage Village Resort 4★, Goa',
        mealsIncluded: 'Breakfast',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 2,
        title: 'North Goa Forts, Water Sports & Mandovi Sunset Cruise',
        location: 'North Goa',
        description: 'Visit Aguada Fort overlooking the Arabian Sea, Sinquerim beach for parasailing and jet skiing, followed by a romantic sunset catamaran cruise on the Mandovi River.',
        morningActivity: 'Aguada Fort & Sinquerim lighthouse tour',
        afternoonActivity: 'Water sports at Calangute/Baga coast',
        eveningActivity: 'Sunset Mandovi River Cruise with live DJ and folk dance',
        stay: 'Hard Rock Hotel / Heritage Village Resort 4★, Goa',
        mealsIncluded: 'Breakfast',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 3,
        title: 'Fontainhas Latin Quarter & Old Goa Heritage Churches',
        location: 'Panaji & Old Goa',
        description: 'Explore the UNESCO heritage Basilica of Bom Jesus and Se Cathedral in Old Goa. Afterwards, walk through the colourful Portuguese Latin Quarter of Fontainhas and taste warm Bebinca at a 100-year-old bakery.',
        morningActivity: 'Old Goa churches & history walk',
        afternoonActivity: 'Guided photography walk through Fontainhas',
        eveningActivity: 'Dinner at quaint Goan-Portuguese courtyard bistro in Assagao',
        stay: 'Hard Rock Hotel / Heritage Village Resort 4★, Goa',
        mealsIncluded: 'Breakfast',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 4,
        title: 'Pristine South Goa: Cabo de Rama Fort & Palolem Beach',
        location: 'South Goa',
        description: 'Head to the untamed beauty of South Goa. Clamber up the cliffside ruins of Cabo de Rama Fort for turquoise sea panoramas, followed by dolphin watching and kayaking at Palolem beach.',
        morningActivity: 'Drive to Cabo de Rama cliff viewpoint',
        afternoonActivity: 'Kayaking & beach shacks at Palolem and Agonda',
        eveningActivity: 'Sunset cocktail at clifftop cafe',
        stay: 'Hard Rock Hotel / Heritage Village Resort 4★, Goa',
        mealsIncluded: 'Breakfast',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 5,
        title: 'Goa Souvenirs & Airport Departure',
        location: 'Goa Departure',
        description: 'Breakfast, morning dip in the sea, and transfer to airport with sun-kissed memories.',
        morningActivity: 'Breakfast & cashew/feni souvenir shopping',
        afternoonActivity: 'Airport drop off',
        mealsIncluded: 'Breakfast',
        transfers: 'Private AC Cab'
      }
    ],
    season: 'All Season',
    isFeatured: true,
    isPopular: true
  },
  {
    id: 'pkg-himachal-highs',
    slug: 'himachal-manali-solang-sissu-retreat',
    title: 'Himachal Alpine Wonderland: Manali & Atal Tunnel',
    destination: 'Himachal Pradesh',
    state: 'Himachal Pradesh',
    durationDays: 6,
    durationNights: 5,
    startingPrice: 14499,
    originalPrice: 18000,
    tripType: ['Family', 'Couple', 'Adventure', 'Friends'],
    hotelCategory: 'Deluxe 4★',
    ratings: 4.8,
    reviewCount: 260,
    startingCity: 'Chandigarh or Delhi Pickup',
    bestFor: 'Snow Lovers, Adventure Seekers & Families',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1597074866923-dc0589150358?q=80&w=800&auto=format&fit=crop'
    ],
    overview: 'Breathe in crisp cedar mountain air on this 6-day holiday. Drive through the historic Atal Tunnel into Lahaul’s Sissu waterfalls, soar on paragliders in Solang, and relax in scenic wooden chalets amidst apple orchards in Manali.',
    highlights: [
      '3 Nights in Manali + 1 Night in Shimla + 1 Night in Kasol / Kullu',
      'Drive through engineering wonder Atal Tunnel to Sissu, Lahaul Valley',
      'Solang Valley adventure sports and snow activities',
      'River rafting in Beas river, Kullu',
      'Hadimba Temple, Vashisht Hot Springs & Old Manali cafes',
      'Daily breakfast and dinner included'
    ],
    inclusions: [
      '5 Nights stay in handpicked 3★/4★ mountain resorts',
      'Daily Breakfast & Dinner at all hotels',
      'Dedicated private AC/Heated Sedan/Innova for entire tour',
      'All toll, fuel, parking, and driver allowances'
    ],
    exclusions: [
      'Adventure activities fees (paragliding, rafting, quad bikes)',
      'Rohtang Pass NGT green permit taxi if opted'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Delhi/Chandigarh to Shimla (Queen of Hills)',
        location: 'Shimla',
        description: 'Pickup from Delhi/Chandigarh and scenic highway drive through the Shivalik hills to Shimla. Check into hotel and stroll on the historic Mall Road and Ridge.',
        morningActivity: 'Highway drive with Himalayan views',
        afternoonActivity: 'Check-in to Shimla hotel',
        eveningActivity: 'Walk along the Ridge, Christ Church and Mall Road',
        stay: 'Snow Valley Resorts / Marina 4★, Shimla',
        mealsIncluded: 'Dinner',
        transfers: 'Private Chauffeur Cab'
      },
      {
        dayNumber: 2,
        title: 'Shimla to Manali via Kullu Valley & Pandoh Dam',
        location: 'Manali',
        description: 'Drive from Shimla to Manali (approx. 7 hrs) along the Beas River. Stop at Pandoh Dam, Hanogi Mata temple, and Kullu Shawl weaving factory. Arrive in Manali by evening.',
        morningActivity: 'Drive through Kullu valley',
        afternoonActivity: 'Pandoh dam view & Kullu shawl factory visit',
        eveningActivity: 'Check-in to Manali apple orchard resort & dinner',
        stay: 'The Himalayan Resort / Apple Country Resort 4★, Manali',
        mealsIncluded: 'Breakfast & Dinner',
        transfers: 'Private Chauffeur Cab'
      },
      {
        dayNumber: 3,
        title: 'Solang Valley Adventure & Atal Tunnel to Sissu Waterfall',
        location: 'Solang & Sissu',
        description: 'Head to Solang Valley for paragliding, zorbing, and ropeway. Cross through the 9.02 km Atal Tunnel to enter the dramatic trans-Himalayan landscape of Sissu in Lahaul Valley.',
        morningActivity: 'Solang valley adventure sports',
        afternoonActivity: 'Atal Tunnel drive to Sissu waterfall and snow points',
        eveningActivity: 'Return to Manali for campfire and hot buffet',
        stay: 'The Himalayan Resort / Apple Country Resort 4★, Manali',
        mealsIncluded: 'Breakfast & Dinner',
        transfers: 'Private Chauffeur Cab'
      },
      {
        dayNumber: 4,
        title: 'Manali Local Sightseeing: Hadimba, Vashisht & Old Manali',
        location: 'Manali',
        description: 'Visit the 500-year-old wooden Hadimba Devi Temple in deep cedar woods, holy Vashisht Hot Sulphur Springs, Club House, and cozy bohemian cafes of Old Manali.',
        morningActivity: 'Hadimba Temple and Van Vihar pine forest walk',
        afternoonActivity: 'Vashisht hot springs and Tibetan Monastery',
        eveningActivity: 'Cafe hopping in Old Manali & wood-fired pizza',
        stay: 'The Himalayan Resort / Apple Country Resort 4★, Manali',
        mealsIncluded: 'Breakfast & Dinner',
        transfers: 'Private Chauffeur Cab'
      },
      {
        dayNumber: 5,
        title: 'Manali to Kasol Parvati Valley & Manikaran Sahib',
        location: 'Kasol & Manikaran',
        description: 'Drive to the scenic Parvati Valley. Visit Manikaran Sahib Gurudwara known for its natural hot springs and langar. Relax in the picturesque riverside village of Kasol.',
        morningActivity: 'Drive to Parvati Valley with Kullu Beas river rafting',
        afternoonActivity: 'Manikaran Sahib Gurudwara and hot spring dip',
        eveningActivity: 'Riverside chill at Kasol and Israeli cuisine dinner',
        stay: 'The River Crescent / Kasol Riverside Camp 4★',
        mealsIncluded: 'Breakfast & Dinner',
        transfers: 'Private Chauffeur Cab'
      },
      {
        dayNumber: 6,
        title: 'Kasol to Chandigarh / Delhi Departure',
        location: 'Departure',
        description: 'Enjoy breakfast with river sounds before driving back to Chandigarh/Delhi airport or railway station.',
        morningActivity: 'Breakfast & scenic downhill drive',
        afternoonActivity: 'Drop-off at Chandigarh/Delhi',
        mealsIncluded: 'Breakfast',
        transfers: 'Private Chauffeur Cab'
      }
    ],
    season: 'All Season',
    isFeatured: true,
    isPopular: true
  },
  {
    id: 'pkg-meghalaya-living-roots',
    slug: 'meghalaya-living-root-bridges-dawki-shillong',
    title: 'Meghalaya: Living Root Bridges & Crystal Waters',
    destination: 'Northeast India',
    state: 'Meghalaya',
    durationDays: 6,
    durationNights: 5,
    startingPrice: 19499,
    originalPrice: 25000,
    tripType: ['Adventure', 'Nature' as any, 'Group', 'Couple'],
    hotelCategory: 'Deluxe 4★',
    ratings: 4.9,
    reviewCount: 142,
    startingCity: 'Guwahati (Airport Pickup)',
    bestFor: 'Trekkers, Photographers & Nature Lovers',
    heroImage: 'https://images.unsplash.com/photo-1622308644420-a757e2fa722a?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1622308644420-a757e2fa722a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=800&auto=format&fit=crop'
    ],
    overview: 'Discover the Abode of Clouds: trek to the bio-engineered Double Decker Living Root Bridge, boat on the crystal-clear Umngot river in Dawki, stand before soaring waterfalls in Cherrapunji, and experience Scotland of the East in Shillong.',
    highlights: [
      '2 Nights Cherrapunji + 1 Night Shnongpdeng / Dawki + 2 Nights Shillong',
      'Double Decker Living Root Bridge trek in Nongriat',
      'Boating on glass-like clear Umngot River in Dawki',
      'Nohkalikai Falls, Mawsmai Cave, and Seven Sisters Falls',
      'Cleanest village Mawlynnong and Umiam Lake boat ride'
    ],
    inclusions: [
      '5 Nights stay in premium hill resorts and riverside eco-camps',
      'Daily breakfast at all stays',
      'Dedicated private AC cab from Guwahati to Guwahati',
      'All toll, fuel, parking, and driver allowances'
    ],
    exclusions: [
      'Airfare to Guwahati',
      'Boating fees in Dawki and entry fees at caves and waterfalls',
      'Guide fee for root bridge trek (can be arranged on spot)'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Guwahati Arrival, Umiam Lake & Drive to Shillong',
        location: 'Shillong',
        description: 'Pickup at Guwahati Airport and drive to Shillong. Stop at the vast, serene Umiam Lake (Barapani) for watersports and photography. Check in to your boutique hotel in Shillong.',
        morningActivity: 'Guwahati Airport pickup',
        afternoonActivity: 'Umiam Lake watersports and panoramic viewpoint',
        eveningActivity: 'Police Bazar shopping and live music cafe in Shillong',
        stay: 'Heritage Club / Ri Kynjai 4★, Shillong',
        mealsIncluded: 'Breakfast',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 2,
        title: 'Shillong to Cherrapunji (Sohra) Waterfalls & Caves',
        location: 'Cherrapunji',
        description: 'Drive along cloud-covered mountain ridges to Cherrapunji. Visit Elephant Falls, the roaring Nohkalikai Falls (tallest plunge waterfall in India), Mawsmai limestone cave, and Seven Sisters Falls.',
        morningActivity: 'Drive to Cherrapunji with Elephant Falls stop',
        afternoonActivity: 'Nohkalikai Falls viewpoint and Mawsmai cave exploration',
        eveningActivity: 'Check-in to resort overlooking the gorge & campfire',
        stay: 'Polo Orchid Resort / Jiva Resort 4★, Cherrapunji',
        mealsIncluded: 'Breakfast & Dinner',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 3,
        title: 'Double Decker Living Root Bridge & Rainbow Falls Trek',
        location: 'Nongriat & Cherrapunji',
        description: 'Trek down into the rainforest to witness the extraordinary Double Decker Living Root Bridge grown over centuries by the Khasi tribe. Optional trek extension to the turquoise pool of Rainbow Falls.',
        morningActivity: 'Morning descent through Tyrna village to Nongriat',
        afternoonActivity: 'Swim in natural pools and admire the living bridge',
        eveningActivity: 'Ascend back and relax with hot tea at your resort',
        stay: 'Polo Orchid Resort / Jiva Resort 4★, Cherrapunji',
        mealsIncluded: 'Breakfast & Dinner',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 4,
        title: 'Mawlynnong Clean Village & Dawki Umngot River Boating',
        location: 'Dawki & Shnongpdeng',
        description: 'Visit Mawlynnong, celebrated as Asia’s cleanest village. Continue to Dawki on the Indo-Bangladesh border for boating on the crystal-clear Umngot River. Stay in cozy riverside luxury tents in Shnongpdeng.',
        morningActivity: 'Mawlynnong village walk & single living root bridge',
        afternoonActivity: 'Boating on transparent waters of Umngot River',
        eveningActivity: 'Bonfire and riverside camping under the stars',
        stay: 'Riverside Luxury Glamping / Resort, Shnongpdeng',
        mealsIncluded: 'Breakfast & Dinner',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 5,
        title: 'Laitlum Canyons & Return to Shillong',
        location: 'Shillong',
        description: 'Drive back to Shillong via the dramatic rolling abyss of Laitlum Grand Canyons. Visit Don Bosco Museum of Indigenous Cultures and Cathedral of Mary Help of Christians.',
        morningActivity: 'Scenic morning drive to Laitlum Canyons',
        afternoonActivity: 'Don Bosco Cultural Museum in Shillong',
        eveningActivity: 'Cafe evening at Dylan’s Cafe or Cloud 9 lounge',
        stay: 'Heritage Club / Ri Kynjai 4★, Shillong',
        mealsIncluded: 'Breakfast',
        transfers: 'Private AC Cab'
      },
      {
        dayNumber: 6,
        title: 'Shillong to Kamakhya Temple & Guwahati Departure',
        location: 'Guwahati Departure',
        description: 'Drive down to Guwahati. Visit the sacred Kamakhya Devi Temple on Nilachal Hill before drop-off at Guwahati Airport.',
        morningActivity: 'Downhill highway drive to Guwahati',
        afternoonActivity: 'Kamakhya Temple darshan & airport drop',
        mealsIncluded: 'Breakfast',
        transfers: 'Private AC Cab'
      }
    ],
    season: 'All Season',
    isFeatured: true,
    isPopular: true
  }
];
