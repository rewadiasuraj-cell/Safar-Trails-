import { Destination } from '../types';

export const destinationsData: Destination[] = [
  {
    slug: 'kashmir',
    name: 'Kashmir',
    tagline: 'Heaven on Earth — Shikaras, Snow Peaks & Pine Valleys',
    state: 'Jammu & Kashmir',
    heroImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1600&auto=format&fit=crop',
    cardImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=800&auto=format&fit=crop',
    shortDescription: 'Gliding on Dal Lake in a wooden shikara, skiing down Apharwat peak in Gulmarg, and sipping hot Kahwa in Pahalgam valleys.',
    fullOverview: 'Kashmir remains India’s most breathtaking alpine sanctuary. From the tranquil waters of Dal Lake and Mughal gardens of Srinagar to the snow bowl of Gulmarg and the roaring Lidder River in Pahalgam, Kashmir offers an ethereal experience for honeymooners, families, and mountain lovers alike.',
    bestTime: 'April to October (Flowers & Lush Green) | December to February (Snow & Skiing)',
    temperatureRange: 'Summer: 12°C - 28°C | Winter: -5°C - 8°C',
    startingPrice: 16999,
    idealDays: '5 to 7 Days',
    rating: 4.9,
    reviewCount: 1420,
    isTrending: true,
    highlights: [
      'Overnight stay in a heritage cedarwood Houseboat on Nigeen / Dal Lake',
      'Gondola Cable Car Ride to Phase 1 & Phase 2 (13,780 ft) in Gulmarg',
      'Pony rides to Baisaran Valley ("Mini Switzerland") in Pahalgam',
      'Thajiwas Glacier sledge ride & Sindh river view in Sonamarg',
      'Authentic Wazwan cuisine tasting and aromatic Kashmiri Kahwa'
    ],
    howToReach: {
      air: 'Sheikh ul-Alam International Airport (SXR), Srinagar has direct daily flights from Delhi, Mumbai, Bengaluru, and Chandigarh.',
      rail: 'Jammu Tawi (JAT) and Udhampur (UHP) railway stations (approx. 6-7 hours scenic highway drive or Vande Bharat to Katra).',
      road: 'National Highway 44 connects Srinagar with Jammu and Punjab via the world-class Chenani-Nashri & Banihal Qazigund tunnels.'
    },
    topAttractions: [
      {
        name: 'Dal & Nigeen Lake',
        description: 'Iconic water bodies dotted with floating vegetable markets, lotus blossoms, and luxury houseboats.',
        image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Gulmarg Gondola & Apharwat',
        description: 'Asia’s highest cable car taking you into pristine powder snow at 4,000+ meters altitude.',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Betaab & Aru Valley, Pahalgam',
        description: 'Verdant riverbanks surrounded by dense deodar forests, ideal for trekking and quiet picnics.',
        image: 'https://images.unsplash.com/photo-1626014303757-658c3a119760?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Sonamarg & Thajiwas Glacier',
        description: 'The Golden Meadow known for snow activities, crystal streams, and gateway to Ladakh.',
        image: 'https://images.unsplash.com/photo-1588661799793-7da9f7336798?q=80&w=600&auto=format&fit=crop'
      }
    ],
    stayCategories: [
      {
        category: 'Heritage Dal Lake Houseboats',
        priceRange: '₹3,500 – ₹9,500 / night',
        recommendation: 'Handcrafted walnut wood interiors with dedicated Butler & Shikara pickup.'
      },
      {
        category: '4★ & 5★ Mountain Resorts (Gulmarg & Pahalgam)',
        priceRange: '₹6,500 – ₹18,000 / night',
        recommendation: 'Central heating, pine valley balconies, spa, and heated buffet halls.'
      },
      {
        category: 'Cozy Boutique Cottages',
        priceRange: '₹2,500 – ₹5,000 / night',
        recommendation: 'Perfect for families and small groups wanting warm local Kashmiri hospitality.'
      }
    ],
    travelTips: [
      'Book Gulmarg Gondola Phase 2 tickets at least 3-4 weeks in advance on the official JK Tourism portal.',
      'Carry postpaid SIM cards (Airtel, Jio, or BSNL) as prepaid SIMs outside J&K do not work in the valley.',
      'Always dress in layers, especially when heading up Apharwat peak or Sonamarg glacier.',
      'Carry cash for local pony rides and sledging as mobile network in deep valleys can be intermittent.'
    ],
    faqs: [
      {
        question: 'Is Kashmir safe for family and couple trips?',
        answer: 'Yes, Kashmir is overwhelmingly warm and welcoming for tourists. Thousands of families and couples travel smoothly year-round. SafarTrails partners with vetted local chauffeurs and verified hotels.'
      },
      {
        question: 'How many days are recommended for a complete Kashmir trip?',
        answer: 'A 6-day / 5-night itinerary is optimal to comfortably explore Srinagar, Gulmarg, Pahalgam, and Sonamarg without feeling rushed.'
      },
      {
        question: 'What is the estimated cost per person for a Kashmir package?',
        answer: 'A comfortable 6D/5N package with 3-4 star stays, private sanitized cab, breakfast, dinner, and houseboat stay starts around ₹16,999 to ₹24,500 per person on twin sharing.'
      }
    ],
    seoTitle: 'Kashmir Tour Packages 2026 | Custom Itineraries with Houseboat & Cab',
    seoDescription: 'Handcrafted Kashmir holiday packages with Dal Lake houseboats, Gulmarg gondola, Pahalgam valleys, and 24/7 concierge assistance.'
  },
  {
    slug: 'goa',
    name: 'Goa',
    tagline: 'Sun-Kissed Beaches, Portuguese Quarters & River Cruises',
    state: 'Goa',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1600&auto=format&fit=crop',
    cardImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    shortDescription: 'Golden sunset sands in South Goa, vibrant beach shacks in North Goa, heritage Latin Quarters of Fontainhas, and Mandovi backwaters.',
    fullOverview: 'Goa offers a dual soul: the electric nightlife, water sports, and cafe culture of North Goa, combined with the tranquil palm-lined shores, boutique heritage villas, and peaceful backwaters of South Goa. Whether looking for a relaxing beach escape or a vibrant group party, Goa delivers year-round.',
    bestTime: 'October to April (Perfect beach weather) | June to September (Lush green monsoon escapes)',
    temperatureRange: '22°C - 33°C',
    startingPrice: 12499,
    idealDays: '4 to 6 Days',
    rating: 4.8,
    reviewCount: 2180,
    isTrending: true,
    highlights: [
      'Sunset Catamaran or Luxury Yacht cruise on the Mandovi River',
      'Walking photography tour through colorful Portuguese Fontainhas, Panjim',
      'Scuba diving and parasailing at Grand Island & Calangute coast',
      'Private beach shack dinner with fresh coastal seafood and Goan curry',
      'Jeep safari to the majestic four-tiered Dudhsagar Waterfalls'
    ],
    howToReach: {
      air: 'Manohar International Airport, Mopa (GOX) for North Goa or Dabolim Airport (GOI) for Central/South Goa.',
      rail: 'Madgaon (MAO) and Thivim (THVM) stations connect directly with Mumbai, Delhi, Bengaluru, and Kerala.',
      road: 'Scenic drive via NH66 from Mumbai/Pune or NH4A from Bengaluru through the Western Ghats.'
    },
    topAttractions: [
      {
        name: 'Palolem & Agonda Beaches',
        description: 'Crescent-shaped serene white sands in South Goa, perfect for dolphin watching and calm swimming.',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Fontainhas Latin Quarter',
        description: 'Vibrant yellow, cobalt, and terracotta colonial villas with indie art galleries and quaint bakeries.',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Dudhsagar Waterfalls & Spice Plantation',
        description: 'Spectacular 310m milky white cascade nestled inside Bhagwan Mahaveer Wildlife Sanctuary.',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=600&auto=format&fit=crop'
      }
    ],
    stayCategories: [
      {
        category: 'Beachfront Resorts & 5★ Spas',
        priceRange: '₹7,000 – ₹22,000 / night',
        recommendation: 'Direct beach access, infinity pools, private cabanas in Varca, Candolim, and Morjim.'
      },
      {
        category: 'Portuguese Heritage Homestays',
        priceRange: '₹3,500 – ₹7,000 / night',
        recommendation: 'Authentic Goan susegad vibe in Panaji, Assagao, and Saligao.'
      }
    ],
    travelTips: [
      'Choose North Goa if you want beach clubs, trendy cafes, and water sports; pick South Goa for quiet luxury and uncrowded shores.',
      'Renting an automatic scooter or self-drive vehicle requires a valid permanent driving license.',
      'Respect swimming flag warnings on beaches — red flags mean high tides and dangerous undercurrents.'
    ],
    faqs: [
      {
        question: 'Which is better for families: North Goa or South Goa?',
        answer: 'South Goa (Cavelossim, Benaulim, Majorda) is ideal for peaceful family holidays with gentle surf and wide resorts. North Goa is great for families who enjoy bustling markets and water activities.'
      },
      {
        question: 'Can Goa packages be customized with private yacht rentals?',
        answer: 'Yes! SafarTrails curates private 2-hour sunset cruises on Mandovi river or off Morjim beach for birthdays, anniversaries, and couple celebrations.'
      }
    ],
    seoTitle: 'Goa Tour Packages 2026 | Beach Resorts, Water Sports & Heritage Stays',
    seoDescription: 'Book customized Goa holiday packages with private transfers, South Goa luxury resorts, North Goa beach trips, and water sports.'
  },
  {
    slug: 'kerala',
    name: 'Kerala',
    tagline: 'God’s Own Country — Backwaters, Tea Hills & Ayurvedic Spas',
    state: 'Kerala',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1600&auto=format&fit=crop',
    cardImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop',
    shortDescription: 'Cruising through Alleppey backwaters on a private Kettuvallam houseboat, walking rolling tea estates in Munnar, and wildlife safaris in Thekkady.',
    fullOverview: 'Kerala weaves lush nature, tranquil waterways, and ancient wellness traditions into a restorative holiday. Discover misty mountain plantations in Munnar, spice groves and bamboo rafting in Periyar, serene village backwaters in Kumarakom, and clifftop sunsets at Varkala.',
    bestTime: 'September to March (Pleasant climate) | June to August (Monsoon Ayurveda & Waterfalls)',
    temperatureRange: '18°C - 32°C',
    startingPrice: 15499,
    idealDays: '5 to 7 Days',
    rating: 4.9,
    reviewCount: 1890,
    isTrending: true,
    highlights: [
      'Overnight cruise in a private air-conditioned Houseboat with traditional Kerala Karimeen meals',
      'Stroll through emerald tea gardens and visit Tea Museum in Munnar',
      'Boat safari on Periyar Lake inside Thekkady Wildlife Sanctuary',
      'Watch Kathakali dance and Kalaripayattu martial arts live performances',
      'Authentic Ayurvedic rejuvenation massage with herbal oils'
    ],
    howToReach: {
      air: 'Cochin International Airport (COK) or Trivandrum International Airport (TRV).',
      rail: 'Ernakulam Junction (ERS) and Aluva stations offer seamless connectivity to Munnar and Alleppey.',
      road: 'Well-maintained state highways linking Kochi to Munnar (approx. 3.5 hrs scenic hill drive).'
    },
    topAttractions: [
      {
        name: 'Alleppey & Kumarakom Backwaters',
        description: 'Vast network of canals, paddy fields, and coconut groves navigated by wooden houseboats.',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Munnar Tea Gardens & Eravikulam',
        description: 'Rolling mist-shrouded green hills home to the endangered Nilgiri Tahr and Anamudi peak.',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Varkala Clifftop Beach',
        description: 'Unique red laterite cliffs bordering the Arabian Sea with bohemian cafes and yoga retreats.',
        image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=600&auto=format&fit=crop'
      }
    ],
    stayCategories: [
      {
        category: 'Deluxe & Premium Houseboats',
        priceRange: '₹7,500 – ₹16,000 / night (all meals included)',
        recommendation: 'Dedicated chef, captain, and engine operator with private sundeck.'
      },
      {
        category: 'Misty Hill Resorts & Treehouses',
        priceRange: '₹4,500 – ₹12,000 / night',
        recommendation: 'Immersed in Munnar tea plantations with private valley views.'
      }
    ],
    travelTips: [
      'Houseboats operate with AC in bedrooms from 9 PM to 6 AM unless full-time AC is booked in advance.',
      'Vegetarian and Jain meals can be fully arranged with prior notice on houseboats and resorts.',
      'Wear modest attire when visiting holy temples like Padmanabhaswamy Temple in Trivandrum.'
    ],
    faqs: [
      {
        question: 'What is the classic route for a 6-day Kerala holiday?',
        answer: 'The most popular route is Kochi (1N) → Munnar (2N) → Thekkady (1N) → Alleppey Houseboat (1N) → Departure from Kochi.'
      }
    ],
    seoTitle: 'Kerala Tour Packages 2026 | Munnar Hills, Alleppey Houseboat & Spice Tours',
    seoDescription: 'Explore Kerala holiday packages with private houseboat cruises, Munnar tea plantation stays, Periyar wildlife tours, and customized transfers.'
  },
  {
    slug: 'rajasthan',
    name: 'Rajasthan',
    tagline: 'Land of Maharajas — Royal Palaces, Golden Forts & Desert Safaris',
    state: 'Rajasthan',
    heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600&auto=format&fit=crop',
    cardImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800&auto=format&fit=crop',
    shortDescription: 'Majestic hill forts of Jaipur, romantic lake palaces of Udaipur, blue alleyways of Jodhpur, and starlit camel safaris on Jaisalmer dunes.',
    fullOverview: 'Rajasthan is an opulent tapestry of royal legacy, vibrant folk traditions, and timeless desert landscapes. Walk through towering sandstone ramparts, take boat rides on shimmering Lake Pichola, sleep under Thar desert constellations in luxury Swiss tents, and relish authentic Rajasthani Dal Baati Churma.',
    bestTime: 'October to March (Pleasant, crisp winter weather)',
    temperatureRange: '10°C - 28°C in winter',
    startingPrice: 14999,
    idealDays: '6 to 9 Days',
    rating: 4.9,
    reviewCount: 1650,
    isTrending: true,
    highlights: [
      'Sunset Boat Ride on Lake Pichola overlooking Udaipur City Palace and Jag Mandir',
      'Desert Jeep Safari, camel ride, and folk Kalbeliya dance on Sam Sand Dunes, Jaisalmer',
      'Amber Fort elephant/jeep ascent and Hawa Mahal photo stop in the Pink City Jaipur',
      'Walk through the massive Mehrangarh Fort towering above the Blue City Jodhpur',
      'Stay in a restored royal Haveli or heritage Palace hotel'
    ],
    howToReach: {
      air: 'Jaipur International Airport (JAI), Udaipur Maharana Pratap Airport (UDR), or Jodhpur Airport (JDH).',
      rail: 'Extensive superfast and Vande Bharat connections from Delhi, Mumbai, Ahmedabad, and Kolkata.',
      road: 'Smooth Delhi-Mumbai Expressway and national highways offer rapid road transit.'
    },
    topAttractions: [
      {
        name: 'Udaipur City Palace & Lake Pichola',
        description: 'Vast architectural marvel blending Rajasthani and Mughal styles on the lake shore.',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Jaisalmer Golden Fort & Sam Sand Dunes',
        description: 'Living sandstone fort and undulating Thar desert with evening campfires and stargazing.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Jaipur Amber Fort & Jal Mahal',
        description: 'Grand hilltop fortress with the Sheesh Mahal (Mirror Palace) and water-encircled palace.',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600&auto=format&fit=crop'
      }
    ],
    stayCategories: [
      {
        category: 'Heritage Havelis & Royal Palaces',
        priceRange: '₹4,500 – ₹25,000 / night',
        recommendation: 'Intricate jharokhas, courtyards, traditional thali dining, and antique decor.'
      },
      {
        category: 'Luxury Desert Swiss Camps',
        priceRange: '₹3,500 – ₹9,000 / night (includes folk show & buffet)',
        recommendation: 'Sam Sand Dunes with private attached baths, bonfire, and stargazing.'
      }
    ],
    travelTips: [
      'Winter nights in Jaisalmer desert can drop below 8°C; pack warm jackets or shawls.',
      'Purchase composite entry tickets at monuments in Jaipur to save time at ticket counters.',
      'Hire authorized government-approved guides at major forts for authentic historical storytelling.'
    ],
    faqs: [
      {
        question: 'Which cities should be covered in a 7-day Rajasthan trip?',
        answer: 'A balanced 7-day royal circuit covers Jaipur (2N) → Jodhpur (2N) → Udaipur (2N) or Jaipur (2N) → Jodhpur (1N) → Jaisalmer (2N) → Bikaner (1N).'
      }
    ],
    seoTitle: 'Rajasthan Tour Packages 2026 | Jaipur, Udaipur, Jaisalmer Desert Camps',
    seoDescription: 'Experience royal Rajasthan with curated tour packages. Heritage stays, desert safaris, private chauffeur cabs, and customized family/honeymoon itineraries.'
  },
  {
    slug: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    tagline: 'Valley of the Gods — Pine Forests, Snow Passes & Tibetan Monasteries',
    state: 'Himachal Pradesh',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1600&auto=format&fit=crop',
    cardImage: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?q=80&w=800&auto=format&fit=crop',
    shortDescription: 'Solang Valley adventure sports, Atal Tunnel drives to Sissu waterfalls, peaceful apple orchards in Old Manali, and colonial charm in Shimla.',
    fullOverview: 'Himachal Pradesh is North India’s quintessential mountain playground. Whether you seek snow adventures in Solang, river rafting in Beas, the serene spiritual sanctuary of the Dalai Lama in Dharamshala, or the raw rugged passes of Spiti Valley, Himachal captivates every traveler.',
    bestTime: 'March to June (Summer flowers & cool breeze) | November to February (Snow & winter sports)',
    temperatureRange: '-2°C - 24°C',
    startingPrice: 13999,
    idealDays: '5 to 8 Days',
    rating: 4.8,
    reviewCount: 1940,
    isTrending: true,
    highlights: [
      'Drive through the engineering marvel Atal Tunnel into Lahaul Valley (Sissu)',
      'Paragliding, ziplining, and snow quad biking at Solang Valley',
      'Colonial heritage walk along Shimla Ridge and historic Mall Road',
      'Café hopping, riverside relaxation, and Tibetan momos in Old Manali & Kasol',
      'Visit His Holiness the Dalai Lama Temple & Namgyal Monastery in McLeod Ganj'
    ],
    howToReach: {
      air: 'Kullu-Manali Airport at Bhuntar (KUU), Kangra Airport at Gaggal (DHM), or Chandigarh Airport (IXC) followed by scenic drive.',
      rail: 'Chandigarh Junction or Kalka (for historic UNESCO toy train to Shimla).',
      road: 'Smooth four-lane expressway connecting Delhi/Chandigarh to Mandi and Kullu-Manali.'
    },
    topAttractions: [
      {
        name: 'Solang Valley & Atal Tunnel',
        description: 'Epic mountain pass leading to glacial waterfalls and thrilling all-season adventure sports.',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Shimla Ridge & Jakhoo Temple',
        description: 'Grand colonial vista points, historic neo-Gothic Christ Church, and giant Hanuman statue.',
        image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?q=80&w=600&auto=format&fit=crop'
      }
    ],
    stayCategories: [
      {
        category: 'Apple Orchard Cottages & Chalets',
        priceRange: '₹3,000 – ₹7,500 / night',
        recommendation: 'Wood-fired fireplaces, home-cooked Pahadi meals, and private valley balconies.'
      },
      {
        category: 'Luxury Hill Resorts',
        priceRange: '₹6,000 – ₹18,000 / night',
        recommendation: 'Heated indoor pools, cedar spas, and panoramic snow-peak dining.'
      }
    ],
    travelTips: [
      'Rohtang Pass permits must be booked in advance as daily vehicle quotas are strictly limited by NGT.',
      'Carry motion-sickness medication if you are prone to dizziness on winding mountain roads.'
    ],
    faqs: [
      {
        question: 'When can we see snow in Manali?',
        answer: 'Snowfall typically occurs in Manali town from late December through February. Snow is accessible in higher reaches like Solang, Atal Tunnel North Portal, and Rohtang from November through April.'
      }
    ],
    seoTitle: 'Himachal Tour Packages 2026 | Manali, Shimla, Dharamshala & Spiti Trips',
    seoDescription: 'Book all-inclusive Himachal tour packages with private cab, hotel stays, adventure activities in Solang, and 24/7 travel concierge.'
  },
  {
    slug: 'uttarakhand',
    name: 'Uttarakhand',
    tagline: 'Devbhoomi — Ganga Aarti, Clifftop Hill Stations & Tiger Safaris',
    state: 'Uttarakhand',
    heroImage: '/Places-in-Uttarakhand.jpg',
    cardImage: '/Places-in-Uttarakhand.jpg',
    shortDescription: 'White water river rafting in Rishikesh, mesmerizing evening Ganga Aarti at Triveni Ghat, scenic walks in Mussoorie, and tiger safaris in Jim Corbett.',
    fullOverview: 'From the adrenaline rush of Grade IV rapids in Rishikesh and tranquil yoga ashrams along the sacred Ganges to the misty colonial promenades of Mussoorie and Nainital’s emerald lakes, Uttarakhand balances rejuvenation with thrilling mountain wilderness.',
    bestTime: 'October to June (Great for rafting & hill stations) | November to February (Jim Corbett tiger safaris & Auli skiing)',
    temperatureRange: '5°C - 30°C',
    startingPrice: 11999,
    idealDays: '4 to 7 Days',
    rating: 4.9,
    reviewCount: 1530,
    isTrending: true,
    highlights: [
      '16 km White Water River Rafting through Shivpuri to Rishikesh with cliff jumping',
      'Soulful sunset Ganga Aarti ceremony at Parmarth Niketan / Triveni Ghat',
      'Open 4x4 Jeep Safari in Jim Corbett National Park (Bijrani / Dhikala zone)',
      'Scenic cable car ride to Gun Hill and Kempty Falls in Mussoorie',
      'Yachting and boating on mango-shaped Naini Lake'
    ],
    howToReach: {
      air: 'Jolly Grant Airport, Dehradun (DED) with daily direct flights from Delhi, Mumbai, Bengaluru, and Hyderabad.',
      rail: 'Haridwar (HW), Dehradun (DDN), and Kathgodam (KGM) stations.',
      road: 'Smooth 4-5 hour drive from Delhi-NCR via Delhi-Meerut Expressway.'
    },
    topAttractions: [
      {
        name: 'Rishikesh & Ganga Riverbank',
        description: 'Global capital of Yoga, iconic suspension bridges (Lakshman & Ram Jhula), and cafes.',
        image: '/Places-in-Uttarakhand.jpg'
      },
      {
        name: 'Jim Corbett Tiger Reserve',
        description: 'India’s oldest national park known for Royal Bengal Tigers, wild elephants, and rich birdlife.',
        image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=600&auto=format&fit=crop'
      }
    ],
    stayCategories: [
      {
        category: 'Riverside Glamping Camps (Rishikesh)',
        priceRange: '₹2,500 – ₹6,000 / night (all meals & bonfire)',
        recommendation: 'Luxury tents with AC, pool, volleyball, and private river stream access.'
      },
      {
        category: 'Wilderness Jungle Lodges (Jim Corbett)',
        priceRange: '₹5,000 – ₹15,000 / night',
        recommendation: 'Nestled on the banks of Kosi River with naturalist-led birding walks.'
      }
    ],
    travelTips: [
      'Corbett safari permits for Dhikala and Bijrani zones open 45 days in advance and sell out rapidly.',
      'River rafting is closed during peak monsoon months (July to mid-September) for safety.'
    ],
    faqs: [
      {
        question: 'Is Uttarakhand suitable for weekend getaways from Delhi?',
        answer: 'Yes, destinations like Rishikesh, Mussoorie, Jim Corbett, and Nainital are accessible in a 4 to 6-hour drive from Delhi NCR, making them ideal 3D/2N weekend breaks.'
      }
    ],
    seoTitle: 'Uttarakhand Tour Packages 2026 | Rishikesh Rafting, Mussoorie & Corbett Safaris',
    seoDescription: 'Book Uttarakhand holiday packages with river rafting in Rishikesh, luxury jungle safaris in Corbett, and hill station stays in Mussoorie & Nainital.'
  },
  {
    slug: 'andaman',
    name: 'Andaman & Nicobar',
    tagline: 'Emerald Isles — Coral Reefs, Turquoise Lagoons & White Sands',
    state: 'Andaman & Nicobar Islands',
    heroImage: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=1600&auto=format&fit=crop',
    cardImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
    shortDescription: 'Radhanagar Beach rated Asia’s best, deep sea scuba diving at Havelock, high-speed catamaran cruises to Neil Island, and historic Cellular Jail.',
    fullOverview: 'The Andaman Islands are India’s premier tropical paradise. Floating in the Bay of Bengal, the archipelago boasts crystal-clear azure waters, vibrant coral gardens, bioluminescent night kayaking, and secluded white sand beaches shaded by towering Mahua trees.',
    bestTime: 'October to May (Calm turquoise waters, ideal for diving & sea transfers)',
    temperatureRange: '23°C - 31°C',
    startingPrice: 21999,
    idealDays: '5 to 7 Days',
    rating: 4.9,
    reviewCount: 980,
    isTrending: true,
    highlights: [
      'Sunset at Radhanagar Beach (Beach No. 7), consistently ranked among the world’s top beaches',
      'Discover scuba diving & sea walking at Elephant Beach, Havelock',
      'High-speed Makruzz or Nautika luxury cruise between Port Blair, Havelock & Neil Island',
      'Light & Sound show depicting India’s freedom struggle at Cellular Jail',
      'Natural rock formation bridge and coral watching at Bharatpur Beach, Neil Island'
    ],
    howToReach: {
      air: 'Veer Savarkar International Airport, Port Blair (IXZ) with direct flights from Chennai, Kolkata, Delhi, and Bengaluru.',
      rail: 'Not applicable (Island territory).',
      road: 'Island hopping is conducted via modern luxury catamarans and private tourist cabs.'
    },
    topAttractions: [
      {
        name: 'Radhanagar & Elephant Beach, Havelock',
        description: 'Powder-soft white sand, sunset hues, and vibrant coral reefs for snorkeling.',
        image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Cellular Jail National Memorial, Port Blair',
        description: 'Historic colonial prison that housed notable Indian freedom fighters with emotional light & sound show.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600&auto=format&fit=crop'
      }
    ],
    stayCategories: [
      {
        category: 'Beachfront Cottages & Island Resorts',
        priceRange: '₹5,500 – ₹20,000 / night',
        recommendation: 'Step straight from your private villa onto white sand beaches on Havelock Island.'
      }
    ],
    travelTips: [
      'No passport or special permit is required for Indian citizens visiting Andaman.',
      'Book private inter-island catamaran ferry tickets (Makruzz/Nautika) well in advance to avoid schedule disruption.'
    ],
    faqs: [
      {
        question: 'Do we need swimming skills for scuba diving in Andaman?',
        answer: 'No! Discover Scuba Diving (DSD) is conducted with dedicated 1-on-1 certified PADI divemasters and requires zero swimming knowledge.'
      }
    ],
    seoTitle: 'Andaman Tour Packages 2026 | Havelock Island, Scuba Diving & Ferry Tickets',
    seoDescription: 'Plan your dream Andaman honeymoon or family vacation. Includes Makruzz ferry, Radhanagar beach resorts, scuba diving, and Cellular Jail tour.'
  },
  {
    slug: 'northeast-india',
    name: 'Northeast India',
    tagline: 'Seven Sisters — Living Root Bridges, Cloud Valleys & One-Horned Rhinos',
    state: 'Meghalaya, Assam, Sikkim & Arunachal',
    heroImage: 'https://images.unsplash.com/photo-1622308644420-a757e2fa722a?q=80&w=1600&auto=format&fit=crop',
    cardImage: 'https://images.unsplash.com/photo-1622308644420-a757e2fa722a?q=80&w=800&auto=format&fit=crop',
    shortDescription: 'Double Decker Living Root Bridges of Cherrapunji, crystal-clear Umngot river in Dawki, one-horned rhinos in Kaziranga, and high mountain passes of Tawang.',
    fullOverview: 'Northeast India is a mystical expanse of untouched natural wonders, indigenous tribal cultures, and dramatic landscapes. Float on transparent river waters at Dawki, explore sacred groves, witness roaring monsoon waterfalls, and discover ancient Buddhist monasteries perched on Himalayan cliffs.',
    bestTime: 'October to May (Clear skies, trekking & wildlife) | June to September (Monsoon waterfalls in full majesty)',
    temperatureRange: '10°C - 26°C',
    startingPrice: 18499,
    idealDays: '6 to 9 Days',
    rating: 4.8,
    reviewCount: 860,
    highlights: [
      'Trek to the ancient Double Decker Living Root Bridge in Nongriat, Meghalaya',
      'Boating on the glass-transparent waters of the Umngot River in Dawki',
      'Jeep and Elephant safari in Kaziranga National Park to spot Great Indian One-Horned Rhinoceros',
      'Standing amidst the clouds at Nohkalikai Falls and Seven Sisters Falls, Cherrapunji',
      'Visit Mawlynnong, recognized as Asia’s cleanest village'
    ],
    howToReach: {
      air: 'Lokpriya Gopinath Bordoloi International Airport, Guwahati (GAU) serves as the primary gateway.',
      rail: 'Guwahati Railway Station (GHY) with high-speed Vande Bharat and Rajdhani express trains.',
      road: 'Scenic highways linking Guwahati to Shillong (approx. 3 hrs via Guwahati-Shillong Highway).'
    },
    topAttractions: [
      {
        name: 'Cherrapunji & Nohkalikai Falls',
        description: 'One of the wettest places on earth with soaring waterfalls and deep limestone caves.',
        image: 'https://images.unsplash.com/photo-1622308644420-a757e2fa722a?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Dawki Umngot River & Shnongpdeng',
        description: 'Famed for boats appearing to float in mid-air over pebble beds and crystal emerald water.',
        image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=600&auto=format&fit=crop'
      }
    ],
    stayCategories: [
      {
        category: 'Eco Lodges & Boutique Cloud Resorts',
        priceRange: '₹3,500 – ₹9,000 / night',
        recommendation: 'Sustainable bamboo architecture overlooking Cherrapunji gorges and Khasi hills.'
      }
    ],
    travelTips: [
      'Wear sturdy non-slip trekking shoes for the root bridge walks in Meghalaya.',
      'Indian tourists visiting Arunachal Pradesh or certain Sikkim border areas require an Inner Line Permit (ILP), arranged by SafarTrails.'
    ],
    faqs: [
      {
        question: 'Is the Double Decker Root Bridge trek suitable for beginners?',
        answer: 'The trek involves descending and ascending approx. 3,500 stone steps. Travelers with moderate fitness can complete it with trekking poles and adequate hydration stops.'
      }
    ],
    seoTitle: 'Meghalaya & Northeast Tour Packages 2026 | Dawki, Cherrapunji & Kaziranga',
    seoDescription: 'Handcrafted Northeast India holidays with Shillong cloud hills, Dawki crystal boating, living root bridges, and Kaziranga wildlife safaris.'
  }
];
