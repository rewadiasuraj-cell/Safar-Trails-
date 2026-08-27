export interface MonthlyWeather {
  month: string; // 'Jan', 'Feb', ...
  fullName: string;
  tempHigh: number;
  tempLow: number;
  rainfallMm: number;
  condition: 'Sunny' | 'Pleasant' | 'Snowfall' | 'Heavy Snow' | 'Monsoon Rain' | 'Light Showers' | 'Warm & Sunny' | 'Tropical Breeze';
  crowdLevel: 'High (Peak)' | 'Moderate' | 'Low (Value)';
  isRecommended: boolean;
  activityHighlight: string;
}

export interface SeasonInfo {
  id: string;
  name: string;
  period: string; // e.g. "April – June"
  tag: 'Peak Season' | 'Shoulder Season' | 'Value / Monsoon' | 'Winter Wonder' | 'Best For Adventures';
  rating: number; // out of 5
  tempSummary: string; // e.g. "15°C – 28°C"
  weatherDescription: string;
  highlights: string[];
  clothingAdvice: string;
  idealFor: string[];
}

export interface DestinationWeatherSummary {
  destinationSlug: string;
  currentTrendAdvice: {
    status: string;
    headline: string;
    advice: string;
    recommendedMonths: string;
  };
  overallBestTime: string;
  seasons: SeasonInfo[];
  monthlyData: MonthlyWeather[];
  packingTips: string[];
}

export const destinationsWeatherData: Record<string, DestinationWeatherSummary> = {
  kashmir: {
    destinationSlug: 'kashmir',
    overallBestTime: 'April to October (Pleasant & Lush) | December to February (Snow & Skiing)',
    currentTrendAdvice: {
      status: 'High Demand Booking Window',
      headline: 'Optimal Season for Alpine Vistas & Houseboat Stays',
      advice: 'Mild mountain days and cool evenings make this an exceptional time for Gulmarg Gondola rides, Dal Lake Shikara cruises, and Pahalgam valley pony trails. Advance Gondola bookings recommended.',
      recommendedMonths: 'April – October & Dec – Feb'
    },
    seasons: [
      {
        id: 'summer-spring',
        name: 'Spring & Summer',
        period: 'April to June',
        tag: 'Peak Season',
        rating: 5,
        tempSummary: '14°C to 28°C',
        weatherDescription: 'Warm sunny days with vibrant blooming tulip & Mughal gardens, flowing rivers, and pleasant mountain air.',
        highlights: [
          'Asia’s largest Tulip Festival in Srinagar',
          'Shikara rides on Dal & Nigeen lake with clear mountain reflections',
          'Baisaran Valley pony rides and Aru valley treks in Pahalgam',
          'Gulmarg Gondola Phase 1 & 2 alpine views'
        ],
        clothingAdvice: 'Cotton shirts, light woolens or jackets for evenings, sunglasses, and comfortable walking shoes.',
        idealFor: ['Couples & Honeymooners', 'Family Vacations', 'Photography Enthusiasts']
      },
      {
        id: 'autumn',
        name: 'Golden Autumn',
        period: 'September to November',
        tag: 'Shoulder Season',
        rating: 4.8,
        tempSummary: '9°C to 22°C',
        weatherDescription: 'Crisp autumn weather when Chinar trees turn fiery gold, red, and amber with clear blue skies.',
        highlights: [
          'Golden Chinar foliage walks in Srinagar Mughal Gardens',
          'Fresh apple and saffron harvesting in Pampore & Shopian',
          'Uncrowded luxury houseboat stays with warm Kashmiri Kahwa',
          'Great deals on boutique stays and private cabs'
        ],
        clothingAdvice: 'Medium woolens, jackets, thermal innerwear for morning/night, and warm shawls.',
        idealFor: ['Quiet Romantic Getaways', 'Photographers', 'Culture & Food Lovers']
      },
      {
        id: 'winter',
        name: 'Winter & Snow',
        period: 'December to February',
        tag: 'Winter Wonder',
        rating: 5,
        tempSummary: '-5°C to 8°C',
        weatherDescription: 'A magical white fairy-tale with heavy powder snowfall in Gulmarg, Sonamarg, and frozen lakes.',
        highlights: [
          'Skiing, snowboarding, and snowmobiling in Gulmarg',
          'Sledging on Thajiwas glacier in Sonamarg',
          'Steaming traditional Wazwan and cozy cedarwood heated houseboats',
          'Snowfall photography in Betaab Valley'
        ],
        clothingAdvice: 'Heavy winter parka/jackets, thermal layers, snow boots, woolen gloves, and warm beanies.',
        idealFor: ['Snow Lovers', 'Skiers & Adventurers', 'Honeymooners']
      },
      {
        id: 'monsoon',
        name: 'Monsoon Greenery',
        period: 'July to August',
        tag: 'Value / Monsoon',
        rating: 4.2,
        tempSummary: '18°C to 30°C',
        weatherDescription: 'Moderate rainfall creating emerald pine meadows and rushing mountain streams.',
        highlights: [
          'Lush countryside with off-peak discounted package rates',
          'Trekking to alpine lakes (Tarsar-Marsar, Great Lakes)',
          'Verdant riverbanks along Lidder river in Pahalgam'
        ],
        clothingAdvice: 'Quick-dry clothes, waterproof light jacket, umbrella, and moisture-resistant shoes.',
        idealFor: ['Budget Travelers', 'Nature & Trekking Enthusiasts']
      }
    ],
    monthlyData: [
      { month: 'Jan', fullName: 'January', tempHigh: 4, tempLow: -5, rainfallMm: 60, condition: 'Heavy Snow', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Peak skiing in Gulmarg & snow play' },
      { month: 'Feb', fullName: 'February', tempHigh: 8, tempLow: -2, rainfallMm: 75, condition: 'Snowfall', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Snow carpets & Gondola phase 2' },
      { month: 'Mar', fullName: 'March', tempHigh: 14, tempLow: 4, rainfallMm: 90, condition: 'Pleasant', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Early almond blossoms & snow melting' },
      { month: 'Apr', fullName: 'April', tempHigh: 20, tempLow: 8, rainfallMm: 65, condition: 'Pleasant', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Indira Gandhi Tulip Garden in full bloom' },
      { month: 'May', fullName: 'May', tempHigh: 25, tempLow: 12, rainfallMm: 50, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Pahalgam valleys & Dal Lake Shikara' },
      { month: 'Jun', fullName: 'June', tempHigh: 28, tempLow: 15, rainfallMm: 35, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Sonamarg glacier & alpine sightseeing' },
      { month: 'Jul', fullName: 'July', tempHigh: 30, tempLow: 18, rainfallMm: 55, condition: 'Light Showers', crowdLevel: 'Moderate', isRecommended: false, activityHighlight: 'Great Lakes trekking & lush greenery' },
      { month: 'Aug', fullName: 'August', tempHigh: 29, tempLow: 17, rainfallMm: 60, condition: 'Light Showers', crowdLevel: 'Moderate', isRecommended: false, activityHighlight: 'Offbeat valleys & fruit orchards' },
      { month: 'Sep', fullName: 'September', tempHigh: 26, tempLow: 12, rainfallMm: 25, condition: 'Sunny', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Clear skies, apple harvest & pleasant breeze' },
      { month: 'Oct', fullName: 'October', tempHigh: 21, tempLow: 6, rainfallMm: 15, condition: 'Pleasant', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Golden Chinar tree foliage in Srinagar' },
      { month: 'Nov', fullName: 'November', tempHigh: 15, tempLow: 1, rainfallMm: 20, condition: 'Pleasant', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Crisp autumn chill & early snow on peaks' },
      { month: 'Dec', fullName: 'December', tempHigh: 8, tempLow: -3, rainfallMm: 45, condition: 'Snowfall', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Christmas & New Year snow in Gulmarg' }
    ],
    packingTips: [
      'Layering is essential: carry breathable thermals plus a windproof down jacket for higher altitudes (Gulmarg Phase 2).',
      'Sturdy waterproof walking shoes or boots for snow and gravel trails.',
      'Moisturizer, SPF 50 sunscreen, and lip balm (mountain air and snow reflection can be dry and intense).',
      'Postpaid mobile SIM (Airtel/Jio) for seamless connectivity across mountain routes.'
    ]
  },

  goa: {
    destinationSlug: 'goa',
    overallBestTime: 'October to April (Sunny Beaches & Water Sports)',
    currentTrendAdvice: {
      status: 'Prime Beach & Coast Season',
      headline: 'Clear Skies, Calm Waters & Vibrant Nightlife',
      advice: 'Gentle sea breezes, open beach shacks, and calm Arabian Sea make this the best period for water sports, catamaran cruises, and exploring Portuguese quarters of Fontainhas.',
      recommendedMonths: 'October – April'
    },
    seasons: [
      {
        id: 'winter',
        name: 'Peak Winter & Festive',
        period: 'November to February',
        tag: 'Peak Season',
        rating: 5,
        tempSummary: '20°C to 32°C',
        weatherDescription: 'Sunny, pleasant days with gentle tropical sea breezes, zero rain, and vibrant beach life.',
        highlights: [
          'Parasailing, jet skiing, and scuba diving at Grand Island',
          'Sunburn, beach festivals, and Christmas/New Year celebrations',
          'Sunset yacht cruises on Mandovi River and South Goa quiet shores',
          'Open beach shacks with fresh seafood and live acoustic music'
        ],
        clothingAdvice: 'Cotton beachwear, shorts, swimwear, sunglasses, flip-flops, and evening casuals.',
        idealFor: ['Couples & Honeymooners', 'Party & Nightlife Lovers', 'Family Beach Holidays']
      },
      {
        id: 'shoulder',
        name: 'Spring & Early Summer',
        period: 'March to May',
        tag: 'Shoulder Season',
        rating: 4.3,
        tempSummary: '25°C to 35°C',
        weatherDescription: 'Warm sunny weather with fewer crowds and excellent luxury resort bargains.',
        highlights: [
          'Peaceful uncrowded beaches in South Goa (Palolem, Agonda)',
          'Great discounts on 5-star beachfront luxury resorts and private villas',
          'Quiet heritage walking tours in Fontainhas, Panjim'
        ],
        clothingAdvice: 'Ultra-light linen clothing, wide-brim hat, high-SPF sunscreen, and sunglasses.',
        idealFor: ['Budget Luxury Travelers', 'Slow Travelers', 'Solitude Seekers']
      },
      {
        id: 'monsoon',
        name: 'Romantic Green Monsoon',
        period: 'June to September',
        tag: 'Value / Monsoon',
        rating: 4.5,
        tempSummary: '24°C to 30°C',
        weatherDescription: 'Lush tropical downpours turning the hinterland emerald with roaring waterfalls.',
        highlights: [
          'Dudhsagar Waterfalls in full thunderous flow via jeep safari',
          'Spice plantation tours with organic Goan buffet lunch',
          'Scenic green countryside drives through Western Ghats'
        ],
        clothingAdvice: 'Quick-dry clothes, waterproof jackets/raincoats, water sandals, and umbrellas.',
        idealFor: ['Nature Lovers', 'Couples Seeking Cozy Retreats', 'Photographers']
      }
    ],
    monthlyData: [
      { month: 'Jan', fullName: 'January', tempHigh: 31, tempLow: 19, rainfallMm: 0, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Prime beach weather & water sports' },
      { month: 'Feb', fullName: 'February', tempHigh: 32, tempLow: 20, rainfallMm: 0, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Goa Carnival & romantic sunsets' },
      { month: 'Mar', fullName: 'March', tempHigh: 33, tempLow: 23, rainfallMm: 2, condition: 'Warm & Sunny', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Fontainhas heritage walks & sea breezes' },
      { month: 'Apr', fullName: 'April', tempHigh: 34, tempLow: 25, rainfallMm: 8, condition: 'Warm & Sunny', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Scuba diving & resort pool relaxation' },
      { month: 'May', fullName: 'May', tempHigh: 35, tempLow: 26, rainfallMm: 25, condition: 'Warm & Sunny', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Luxury villa stays at off-peak rates' },
      { month: 'Jun', fullName: 'June', tempHigh: 31, tempLow: 25, rainfallMm: 450, condition: 'Monsoon Rain', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Sao Joao festival & fresh monsoon greenery' },
      { month: 'Jul', fullName: 'July', tempHigh: 29, tempLow: 24, rainfallMm: 650, condition: 'Monsoon Rain', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Dudhsagar waterfalls in full force' },
      { month: 'Aug', fullName: 'August', tempHigh: 29, tempLow: 24, rainfallMm: 480, condition: 'Monsoon Rain', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Lush spice plantations & quiet retreats' },
      { month: 'Sep', fullName: 'September', tempHigh: 30, tempLow: 24, rainfallMm: 220, condition: 'Light Showers', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'End of monsoons, clear skies returning' },
      { month: 'Oct', fullName: 'October', tempHigh: 32, tempLow: 23, rainfallMm: 80, condition: 'Sunny', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Beach shacks reopening & water sports resume' },
      { month: 'Nov', fullName: 'November', tempHigh: 33, tempLow: 21, rainfallMm: 15, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Sunburn season begins & yacht cruises' },
      { month: 'Dec', fullName: 'December', tempHigh: 32, tempLow: 20, rainfallMm: 2, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Christmas, New Year & electrifying nightlife' }
    ],
    packingTips: [
      'High-SPF sunscreen (50+), UV protection sunglasses, and beach hats.',
      'Cotton linens and breathable beachwear for daytime.',
      'Waterproof phone pouches for water sports and boat transfers.',
      'Valid driving license if planning to rent automatic scooters or self-drive Thar.'
    ]
  },

  kerala: {
    destinationSlug: 'kerala',
    overallBestTime: 'September to March (Pleasant Backwaters & Tea Hills)',
    currentTrendAdvice: {
      status: 'Prime Climate Window',
      headline: 'Clear Backwaters, Mild Munnar Hills & Wildlife Safaris',
      advice: 'Crisp mornings in Munnar tea plantations and calm afternoon cruises in Alleppey houseboats make this the best time to experience Kerala.',
      recommendedMonths: 'September – March'
    },
    seasons: [
      {
        id: 'winter',
        name: 'Cool Winter & Peak Season',
        period: 'October to February',
        tag: 'Peak Season',
        rating: 5,
        tempSummary: '18°C to 30°C',
        weatherDescription: 'Pleasant, dry, and comfortable across both hill stations and backwater canals.',
        highlights: [
          'Private overnight houseboat cruises on Alleppey & Kumarakom backwaters',
          'Misty Munnar tea gardens, Top Station, and Eravikulam National Park',
          'Boat safaris on Periyar Lake inside Thekkady wildlife sanctuary',
          'Cliffside sunset cafes at Varkala Beach'
        ],
        clothingAdvice: 'Cotton shirts for coastal areas, light jacket/cardigan for Munnar hill evenings, and comfortable walking shoes.',
        idealFor: ['Honeymooners', 'Family Tours', 'Wildlife & Nature Buffs']
      },
      {
        id: 'monsoon',
        name: 'Monsoon Ayurveda Season',
        period: 'June to August',
        tag: 'Value / Monsoon',
        rating: 4.6,
        tempSummary: '22°C to 29°C',
        weatherDescription: 'Lush rains that open pores for authentic Ayurvedic wellness and rejuvenate cascading waterfalls.',
        highlights: [
          'Traditional Ayurvedic rejuvenation packages and herbal panchakarma',
          'Athirappilly "Niagara of India" waterfalls in full thunder',
          'Dramatic misty tea estate vistas in Munnar with quiet luxury resorts'
        ],
        clothingAdvice: 'Raincoats, umbrellas, quick-drying clothing, and slip-resistant footwear.',
        idealFor: ['Wellness & Spa Seekers', 'Couples', 'Budget Luxury Vacations']
      },
      {
        id: 'summer',
        name: 'Summer & Hill Retreats',
        period: 'March to May',
        tag: 'Shoulder Season',
        rating: 4.1,
        tempSummary: '24°C to 35°C',
        weatherDescription: 'Warm along the coast, but pleasantly cool in high-altitude tea hill stations like Munnar and Wayanad.',
        highlights: [
          'Cool hill station getaways in Munnar and Vagamon',
          'Thrissur Pooram cultural temple festival with decorated elephants',
          'Great family deals on resort stays'
        ],
        clothingAdvice: 'Light cotton clothes, sunglasses, hats, and light shawl for hill stations.',
        idealFor: ['Summer Holiday Families', 'Culture Lovers']
      }
    ],
    monthlyData: [
      { month: 'Jan', fullName: 'January', tempHigh: 30, tempLow: 20, rainfallMm: 10, condition: 'Pleasant', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Peak backwaters & Munnar tea mist' },
      { month: 'Feb', fullName: 'February', tempHigh: 31, tempLow: 21, rainfallMm: 15, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Kochi Biennale & Periyar boat safari' },
      { month: 'Mar', fullName: 'March', tempHigh: 33, tempLow: 23, rainfallMm: 30, condition: 'Warm & Sunny', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Munnar hill escape & spice shopping' },
      { month: 'Apr', fullName: 'April', tempHigh: 34, tempLow: 24, rainfallMm: 70, condition: 'Warm & Sunny', crowdLevel: 'Moderate', isRecommended: false, activityHighlight: 'Vishu celebrations & hill station resorts' },
      { month: 'May', fullName: 'May', tempHigh: 33, tempLow: 24, rainfallMm: 150, condition: 'Light Showers', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Pre-monsoon greenery & luxury deals' },
      { month: 'Jun', fullName: 'June', tempHigh: 29, tempLow: 23, rainfallMm: 500, condition: 'Monsoon Rain', crowdLevel: 'Low (Value)', isRecommended: true, activityHighlight: 'Ayurvedic treatments & Athirappilly falls' },
      { month: 'Jul', fullName: 'July', tempHigh: 28, tempLow: 22, rainfallMm: 550, condition: 'Monsoon Rain', crowdLevel: 'Low (Value)', isRecommended: true, activityHighlight: 'Monsoon detox spas & misty canals' },
      { month: 'Aug', fullName: 'August', tempHigh: 29, tempLow: 23, rainfallMm: 380, condition: 'Monsoon Rain', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Nehru Trophy Snake Boat Race' },
      { month: 'Sep', fullName: 'September', tempHigh: 30, tempLow: 23, rainfallMm: 180, condition: 'Pleasant', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Onam celebrations & post-monsoon greens' },
      { month: 'Oct', fullName: 'October', tempHigh: 31, tempLow: 22, rainfallMm: 220, condition: 'Pleasant', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Backwaters season opens & clear waters' },
      { month: 'Nov', fullName: 'November', tempHigh: 31, tempLow: 21, rainfallMm: 120, condition: 'Pleasant', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Ideal houseboat weather & Thekkady spice walks' },
      { month: 'Dec', fullName: 'December', tempHigh: 30, tempLow: 20, rainfallMm: 30, condition: 'Pleasant', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Festive season, beach carnivals & cool hill breeze' }
    ],
    packingTips: [
      'Modest clothing for visiting historic temples (like Padmanabhaswamy in Trivandrum).',
      'Light woolen cardigan or shawl for Munnar evenings (can drop to 12°C).',
      'Mosquito repellent lotion for backwater houseboat evening cruises.',
      'Comfortable walking sandals and waterproof phone cover.'
    ]
  },

  rajasthan: {
    destinationSlug: 'rajasthan',
    overallBestTime: 'October to March (Pleasant Days & Desert Campfire Nights)',
    currentTrendAdvice: {
      status: 'Prime Royal Season',
      headline: 'Perfect Weather for Forts, Palaces & Thar Desert Safaris',
      advice: 'Crisp sunny days and chilly desert evenings make exploring Amber Fort, Udaipur lakes, and Jaisalmer sand dunes delightful without heat fatigue.',
      recommendedMonths: 'October – March'
    },
    seasons: [
      {
        id: 'winter',
        name: 'Royal Winter Peak',
        period: 'October to March',
        tag: 'Peak Season',
        rating: 5,
        tempSummary: '10°C to 28°C',
        weatherDescription: 'Sunny golden days with zero humidity and chilly, starry desert nights perfect for bonfires.',
        highlights: [
          'Sunset boat rides on Lake Pichola in Udaipur',
          'Jeep safaris, camel rides, and Kalbeliya folk dances at Sam Sand Dunes, Jaisalmer',
          'Exploring grand forts: Mehrangarh (Jodhpur) & Amber Palace (Jaipur)',
          'Jaipur Literature Festival & Desert Festival celebrations'
        ],
        clothingAdvice: 'Daytime cottons, evening sweaters/jackets, warm shawl or thermal innerwear for Jaisalmer desert nights.',
        idealFor: ['Couples & Royalty Seekers', 'Heritage & Architecture Lovers', 'Family Holidays']
      },
      {
        id: 'monsoon',
        name: 'Monsoon Romance (Udaipur & Aravallis)',
        period: 'July to September',
        tag: 'Shoulder Season',
        rating: 4.4,
        tempSummary: '24°C to 34°C',
        weatherDescription: 'Surprising transformation with lush green Aravalli hills and brimming royal lakes in Udaipur.',
        highlights: [
          'Breathtaking green hill vistas at Monsoon Palace (Sajjangarh)',
          'Full shimmering lakes in Udaipur (Fateh Sagar, Pichola)',
          'Great value on luxury heritage havelis and palace resorts'
        ],
        clothingAdvice: 'Light breathable clothes, comfortable walking shoes with grip, and compact umbrella.',
        idealFor: ['Romantic Honeymoons', 'Photographers', 'Budget Luxury']
      },
      {
        id: 'summer',
        name: 'Summer & Hill Retreats',
        period: 'April to June',
        tag: 'Value / Monsoon',
        rating: 3.6,
        tempSummary: '28°C to 42°C',
        weatherDescription: 'Hot desert afternoons, best suited for Mount Abu hill station or indoor palace museum tours.',
        highlights: [
          'Mount Abu hill station (Nakki Lake & Dilwara Temples)',
          'Early morning tiger safaris in Ranthambore (high sighting rate around water holes)',
          'Massive off-season discounts at 5-star palace hotels'
        ],
        clothingAdvice: 'Loose breathable cottons, sunhat, SPF 50 sunscreen, and cooling sunglasses.',
        idealFor: ['Ranthambore Wildlife Enthusiasts', 'Mount Abu Getaways']
      }
    ],
    monthlyData: [
      { month: 'Jan', fullName: 'January', tempHigh: 23, tempLow: 8, rainfallMm: 5, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Jaipur Literature Fest & desert camping' },
      { month: 'Feb', fullName: 'February', tempHigh: 26, tempLow: 11, rainfallMm: 3, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Jaisalmer Desert Festival & camel safari' },
      { month: 'Mar', fullName: 'March', tempHigh: 31, tempLow: 16, rainfallMm: 4, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Elephant festival & heritage walks' },
      { month: 'Apr', fullName: 'April', tempHigh: 37, tempLow: 22, rainfallMm: 3, condition: 'Warm & Sunny', crowdLevel: 'Moderate', isRecommended: false, activityHighlight: 'Mount Abu hill escape & evening havelis' },
      { month: 'May', fullName: 'May', tempHigh: 41, tempLow: 27, rainfallMm: 10, condition: 'Warm & Sunny', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Ranthambore peak tiger sightings' },
      { month: 'Jun', fullName: 'June', tempHigh: 40, tempLow: 28, rainfallMm: 35, condition: 'Warm & Sunny', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Palace resort stays at deep discounts' },
      { month: 'Jul', fullName: 'July', tempHigh: 35, tempLow: 26, rainfallMm: 180, condition: 'Light Showers', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Udaipur green hills & lake cruises' },
      { month: 'Aug', fullName: 'August', tempHigh: 33, tempLow: 25, rainfallMm: 210, condition: 'Light Showers', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Teej festival & scenic Aravalli drives' },
      { month: 'Sep', fullName: 'September', tempHigh: 34, tempLow: 24, rainfallMm: 80, condition: 'Pleasant', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Post-monsoon freshness & fort visits' },
      { month: 'Oct', fullName: 'October', tempHigh: 33, tempLow: 19, rainfallMm: 10, condition: 'Pleasant', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Royal season begins, Pushkar fair setup' },
      { month: 'Nov', fullName: 'November', tempHigh: 29, tempLow: 13, rainfallMm: 2, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'World-famous Pushkar Camel Fair' },
      { month: 'Dec', fullName: 'December', tempHigh: 24, tempLow: 9, rainfallMm: 1, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Desert bonfires & royal palace celebrations' }
    ],
    packingTips: [
      'Warm jacket or thermal wear for open-air desert safaris at night in Jaisalmer (temperatures can drop below 7°C).',
      'Comfortable walking shoes for exploring vast cobblestone forts like Mehrangarh and Amber.',
      'Sunscreen, sunglasses, and a wide-brim hat for daytime monument visits.',
      'Small cash for tipping folk performers and local market artisans in Johari Bazaar.'
    ]
  },

  'himachal-pradesh': {
    destinationSlug: 'himachal-pradesh',
    overallBestTime: 'March to June (Pleasant Summers) | November to February (Snow Adventures)',
    currentTrendAdvice: {
      status: 'High Demand Mountain Season',
      headline: 'Fresh Pine Air, Clear Himalayan Views & Mountain Drives',
      advice: 'Ideal time for Atal Tunnel drives into Sissu waterfalls, Solang Valley paragliding, Old Manali cafe hopping, and Shimla heritage walks.',
      recommendedMonths: 'March – June & Nov – Feb'
    },
    seasons: [
      {
        id: 'summer',
        name: 'Summer Alpine Bloom',
        period: 'March to June',
        tag: 'Peak Season',
        rating: 5,
        tempSummary: '12°C to 26°C',
        weatherDescription: 'Pleasant, sunlit mountain weather with blossoming apple orchards, cool breeze, and clear passes.',
        highlights: [
          'Paragliding, zorbing, and river rafting in Kullu & Solang Valley',
          'Drive through Atal Tunnel into scenic Sissu (Lahaul Valley)',
          'Shimla Mall Road walks, Christ Church & Jakhoo ropeway',
          'Dharamshala Dalai Lama temple & McLeod Ganj cafes'
        ],
        clothingAdvice: 'Cotton clothes for sunny daytime, light sweaters or windbreakers for evenings.',
        idealFor: ['Families Escaping City Heat', 'Adventure Enthusiasts', 'Couples']
      },
      {
        id: 'winter',
        name: 'Snow & Winter Sports',
        period: 'November to February',
        tag: 'Winter Wonder',
        rating: 5,
        tempSummary: '-4°C to 12°C',
        weatherDescription: 'White wonderland with snow-laden deodars, snowfall in Manali/Kufri, and freezing clear nights.',
        highlights: [
          'Snow activities, skiing, and snow tubing in Solang & Sissu',
          'Cozy wooden chalets with wood-fired fireplaces and mountain views',
          'Ice skating at Shimla outdoor open rink',
          'White winter photography along Beas river'
        ],
        clothingAdvice: 'Heavy down feather jackets, thermal sets, woolen socks, snow boots, gloves, and caps.',
        idealFor: ['Snow Seekers', 'Honeymooners', 'Winter Sports Enthusiasts']
      },
      {
        id: 'autumn',
        name: 'Crisp Golden Autumn',
        period: 'September to November',
        tag: 'Shoulder Season',
        rating: 4.7,
        tempSummary: '8°C to 20°C',
        weatherDescription: 'Crystal clear azure skies, unhindered views of Himalayan snow peaks, and golden foliage.',
        highlights: [
          'Best panoramic visibility of Pir Panjal and Dhauladhar ranges',
          'Apple harvesting season in Kotgarh & Old Manali',
          'Less crowd on mountain roads and lower hotel tariffs'
        ],
        clothingAdvice: 'Sweaters, light jackets, denim, and comfortable sneakers.',
        idealFor: ['Photographers', 'Peace Seekers', 'Budget Travelers']
      }
    ],
    monthlyData: [
      { month: 'Jan', fullName: 'January', tempHigh: 6, tempLow: -4, rainfallMm: 80, condition: 'Heavy Snow', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Peak snowfall in Manali, Kufri & Sissu' },
      { month: 'Feb', fullName: 'February', tempHigh: 9, tempLow: -2, rainfallMm: 95, condition: 'Snowfall', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Winter carnival & snow play' },
      { month: 'Mar', fullName: 'March', tempHigh: 15, tempLow: 3, rainfallMm: 85, condition: 'Pleasant', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Spring blossoms & Solang snow activities' },
      { month: 'Apr', fullName: 'April', tempHigh: 20, tempLow: 8, rainfallMm: 60, condition: 'Pleasant', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'River rafting & paragliding in Kullu' },
      { month: 'May', fullName: 'May', tempHigh: 25, tempLow: 12, rainfallMm: 45, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Atal Tunnel drive & Old Manali cafes' },
      { month: 'Jun', fullName: 'June', tempHigh: 27, tempLow: 15, rainfallMm: 65, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Spiti Valley passes open & Rohtang trips' },
      { month: 'Jul', fullName: 'July', tempHigh: 25, tempLow: 16, rainfallMm: 220, condition: 'Monsoon Rain', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Lush greenery (check road advisories)' },
      { month: 'Aug', fullName: 'August', tempHigh: 24, tempLow: 16, rainfallMm: 240, condition: 'Monsoon Rain', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Apple picking season begins' },
      { month: 'Sep', fullName: 'September', tempHigh: 23, tempLow: 12, rainfallMm: 90, condition: 'Sunny', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Crystal clear skies & Himalayan vistas' },
      { month: 'Oct', fullName: 'October', tempHigh: 19, tempLow: 6, rainfallMm: 25, condition: 'Pleasant', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Kullu Dussehra & crisp autumn walks' },
      { month: 'Nov', fullName: 'November', tempHigh: 14, tempLow: 1, rainfallMm: 15, condition: 'Pleasant', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'First winter frost & peaceful retreats' },
      { month: 'Dec', fullName: 'December', tempHigh: 8, tempLow: -3, rainfallMm: 40, condition: 'Snowfall', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Christmas & New Year snow celebrations' }
    ],
    packingTips: [
      'Warm thermal inners and a fleece jacket are recommended even in summer for high mountain passes.',
      'Motion-sickness pills if sensitive to curving hill roads.',
      'Waterproof snow boots and gloves for snow activities (can also be rented locally).',
      'Power banks and camera batteries (batteries discharge faster in sub-zero temperatures).'
    ]
  },

  uttarakhand: {
    destinationSlug: 'uttarakhand',
    overallBestTime: 'October to June (River Rafting, Hill Stations & Tiger Safaris)',
    currentTrendAdvice: {
      status: 'Prime Adventure & Wellness Window',
      headline: 'Grade IV Rafting, Jim Corbett Safaris & Mussoorie Promenades',
      advice: 'The sacred Ganges runs emerald clear for 16 km river rafting in Rishikesh, while Jim Corbett National Park provides high probability tiger and wild elephant sightings.',
      recommendedMonths: 'October – June'
    },
    seasons: [
      {
        id: 'adventure-spring',
        name: 'Spring & Rafting Season',
        period: 'October to May',
        tag: 'Best For Adventures',
        rating: 5,
        tempSummary: '12°C to 28°C',
        weatherDescription: 'Pleasant sunshine, crystal waters on the Ganges, and active wildlife in national parks.',
        highlights: [
          '16km / 24km White water river rafting with cliff jumping at Shivpuri',
          'Open 4x4 Jeep Safari in Jim Corbett (Dhikala / Bijrani zones)',
          'Evening Ganga Aarti at Parmarth Niketan & Triveni Ghat',
          'Mussoorie Mall Road, Kempty Falls, and Gun Hill ropeway'
        ],
        clothingAdvice: 'T-shirts and shorts for rafting, light jacket for morning Corbett safaris, and comfortable sneakers.',
        idealFor: ['Adventure Seekers', 'Spiritual & Yoga Retreats', 'Wildlife Photographers']
      },
      {
        id: 'winter',
        name: 'Winter Hill Magic & Auli Snow',
        period: 'November to February',
        tag: 'Winter Wonder',
        rating: 4.8,
        tempSummary: '3°C to 18°C',
        weatherDescription: 'Chilly mountain air with snow in Auli, Dhanaulti, and upper Mussoorie hills.',
        highlights: [
          'Skiing on snow slopes at Auli with views of Nanda Devi peak',
          'Clear unobstructed Himalayan sunrise views from Mussoorie & Nainital',
          'Riverside luxury glamping with bonfires and live acoustic music'
        ],
        clothingAdvice: 'Heavy woolens, thermal innerwear, gloves, and warm headwear.',
        idealFor: ['Honeymooners', 'Winter Skiers', 'Weekend Getaway Travelers']
      },
      {
        id: 'monsoon',
        name: 'Monsoon (Valley of Flowers)',
        period: 'July to September',
        tag: 'Value / Monsoon',
        rating: 4.2,
        tempSummary: '18°C to 27°C',
        weatherDescription: 'Rains that bring the UNESCO Valley of Flowers into full 500+ species floral bloom.',
        highlights: [
          'Trek to UNESCO World Heritage Valley of Flowers & Hemkund Sahib',
          'Lush misty green Garhwal hills and roaring mountain cascades',
          '(Note: River rafting remains closed during peak monsoon for safety)'
        ],
        clothingAdvice: 'Waterproof trekking gear, poncho/raincoat, hiking boots with grip, and trekking poles.',
        idealFor: ['Botanists & Trekkers', 'Pilgrims', 'Nature Photographers']
      }
    ],
    monthlyData: [
      { month: 'Jan', fullName: 'January', tempHigh: 16, tempLow: 3, rainfallMm: 35, condition: 'Pleasant', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Auli skiing & Corbett winter tiger safaris' },
      { month: 'Feb', fullName: 'February', tempHigh: 19, tempLow: 5, rainfallMm: 45, condition: 'Pleasant', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'International Yoga Festival in Rishikesh' },
      { month: 'Mar', fullName: 'March', tempHigh: 25, tempLow: 10, rainfallMm: 30, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Peak 16km Ganga rafting & riverside camping' },
      { month: 'Apr', fullName: 'April', tempHigh: 31, tempLow: 15, rainfallMm: 20, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Cliff jumping, zipline & Mussoorie hill drive' },
      { month: 'May', fullName: 'May', tempHigh: 35, tempLow: 19, rainfallMm: 30, condition: 'Warm & Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Char Dham Yatra opens & Nainital yachting' },
      { month: 'Jun', fullName: 'June', tempHigh: 34, tempLow: 21, rainfallMm: 90, condition: 'Warm & Sunny', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Summer family escapes & hill viewpoints' },
      { month: 'Jul', fullName: 'July', tempHigh: 29, tempLow: 21, rainfallMm: 420, condition: 'Monsoon Rain', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Valley of Flowers bloom (rafting closed)' },
      { month: 'Aug', fullName: 'August', tempHigh: 28, tempLow: 21, rainfallMm: 450, condition: 'Monsoon Rain', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Hemkund Sahib & green cloud hills' },
      { month: 'Sep', fullName: 'September', tempHigh: 29, tempLow: 18, rainfallMm: 180, condition: 'Pleasant', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'River rafting reopens & post-monsoon freshness' },
      { month: 'Oct', fullName: 'October', tempHigh: 28, tempLow: 12, rainfallMm: 20, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Corbett jungle safari zones reopen' },
      { month: 'Nov', fullName: 'November', tempHigh: 23, tempLow: 7, rainfallMm: 5, condition: 'Pleasant', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Crisp river air, bonfires & yoga ashrams' },
      { month: 'Dec', fullName: 'December', tempHigh: 18, tempLow: 4, rainfallMm: 15, condition: 'Pleasant', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Winter gala, snow in Dhanaulti & glamping' }
    ],
    packingTips: [
      'Quick-dry shorts and synthetic t-shirts for river rafting & body surfing.',
      'Earth-toned clothing (olive, khaki, brown) for Jim Corbett tiger reserve safaris.',
      'Light thermals and windproof jacket for open 6 AM jeep safari drives in winter.',
      'Eco-friendly water bottle and sturdy walking shoes for ashram and ghat walks.'
    ]
  },

  andaman: {
    destinationSlug: 'andaman',
    overallBestTime: 'October to May (Turquoise Waters, Scuba & Beach Cruises)',
    currentTrendAdvice: {
      status: 'Prime Tropical Island Season',
      headline: 'Crystal Visibility for Coral Diving & Luxury Ferry Cruises',
      advice: 'Gentle sea tides make inter-island luxury ferry transit smooth, with peak underwater clarity at Havelock Elephant Beach and Radhanagar.',
      recommendedMonths: 'October – May'
    },
    seasons: [
      {
        id: 'peak-tropical',
        name: 'Peak Tropical Sunshine',
        period: 'October to May',
        tag: 'Peak Season',
        rating: 5,
        tempSummary: '23°C to 31°C',
        weatherDescription: 'Clear blue skies, calm azure waters, and gentle tropical island breezes.',
        highlights: [
          'Discover Scuba Diving & Sea Walking with certified divemasters at Havelock',
          'Sunsets on Asia’s best beach: Radhanagar Beach (Beach No. 7)',
          'High-speed Makruzz or Nautika catamaran transfers between islands',
          'Natural coral bridge and glass-bottom boat rides at Neil Island'
        ],
        clothingAdvice: 'Light tropical beachwear, cotton shorts, UV swimsuits, flip-flops, and sunglasses.',
        idealFor: ['Honeymooners', 'Water Sports Enthusiasts', 'Family Island Holidays']
      },
      {
        id: 'monsoon',
        name: 'Tropical Monsoon',
        period: 'June to September',
        tag: 'Value / Monsoon',
        rating: 3.8,
        tempSummary: '24°C to 29°C',
        weatherDescription: 'Frequent sea showers and dramatic rolling tropical clouds with lush island foliage.',
        highlights: [
          'Deep discounts on beachfront luxury pool villas in Havelock',
          'Quiet uncrowded beaches with dramatic sea photography',
          'Historic indoor visits to Cellular Jail National Memorial'
        ],
        clothingAdvice: 'Quick-dry clothes, waterproof backpack, light rain jackets, and waterproof sandals.',
        idealFor: ['Budget Explorers', 'Photographers Seeking Dramatic Tropics']
      }
    ],
    monthlyData: [
      { month: 'Jan', fullName: 'January', tempHigh: 29, tempLow: 23, rainfallMm: 30, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Peak scuba diving clarity & Radhanagar sunsets' },
      { month: 'Feb', fullName: 'February', tempHigh: 30, tempLow: 23, rainfallMm: 15, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Island hopping & coral watching in Neil Island' },
      { month: 'Mar', fullName: 'March', tempHigh: 31, tempLow: 24, rainfallMm: 10, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Glass-bottom boats & night bioluminescence' },
      { month: 'Apr', fullName: 'April', tempHigh: 32, tempLow: 25, rainfallMm: 45, condition: 'Tropical Breeze', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Deep sea fishing & peaceful beach walks' },
      { month: 'May', fullName: 'May', tempHigh: 31, tempLow: 25, rainfallMm: 320, condition: 'Light Showers', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Early monsoon breezes & luxury resort rates' },
      { month: 'Jun', fullName: 'June', tempHigh: 29, tempLow: 24, rainfallMm: 480, condition: 'Monsoon Rain', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Lush tropical forests & quiet shores' },
      { month: 'Jul', fullName: 'July', tempHigh: 29, tempLow: 24, rainfallMm: 420, condition: 'Monsoon Rain', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Cellular Jail light & sound history tour' },
      { month: 'Aug', fullName: 'August', tempHigh: 29, tempLow: 24, rainfallMm: 390, condition: 'Monsoon Rain', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Dramatic waves & serene island cafes' },
      { month: 'Sep', fullName: 'September', tempHigh: 29, tempLow: 24, rainfallMm: 410, condition: 'Light Showers', crowdLevel: 'Moderate', isRecommended: false, activityHighlight: 'End of monsoons, water sports resume' },
      { month: 'Oct', fullName: 'October', tempHigh: 30, tempLow: 24, rainfallMm: 260, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Ferry cruises reopen full schedules' },
      { month: 'Nov', fullName: 'November', tempHigh: 30, tempLow: 24, rainfallMm: 180, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Crystal waters & coral reef snorkeling' },
      { month: 'Dec', fullName: 'December', tempHigh: 29, tempLow: 23, rainfallMm: 80, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Christmas & New Year island celebrations' }
    ],
    packingTips: [
      'Reef-safe biodegradable sunscreen (SPF 50) to protect coral reefs.',
      'Waterproof phone case and dry bag for catamaran cruises and beach boat landings.',
      'Rash guards or UV protective swimwear for snorkeling and water sports.',
      'Sea-sickness medication if you are prone to motion sickness on open ferry waters.'
    ]
  },

  'northeast-india': {
    destinationSlug: 'northeast-india',
    overallBestTime: 'October to May (Clear Skies, Root Bridges & Rhino Safaris)',
    currentTrendAdvice: {
      status: 'Prime Adventure & Eco-Tour Season',
      headline: 'Transparent Dawki Waters & Kaziranga Rhino Safaris',
      advice: 'The Umngot river in Dawki reaches maximum glass-like transparency, while Kaziranga National Park opens all jeep and elephant safari zones.',
      recommendedMonths: 'October – May'
    },
    seasons: [
      {
        id: 'autumn-winter',
        name: 'Clear Winter & Safari Season',
        period: 'October to April',
        tag: 'Peak Season',
        rating: 5,
        tempSummary: '10°C to 24°C',
        weatherDescription: 'Dry, crisp weather with transparent rivers, clear mountain passes, and open national parks.',
        highlights: [
          'Boating over transparent pebble riverbeds in Dawki (Umngot River)',
          'Trekking down to Double Decker Living Root Bridge in Nongriat',
          'One-Horned Rhinoceros safaris in Kaziranga National Park',
          'Exploring Asia’s cleanest village Mawlynnong & sacred Khasi groves'
        ],
        clothingAdvice: 'Comfortable layers, woolens for Shillong/Tawang evenings, sturdy non-slip trekking shoes.',
        idealFor: ['Eco-Travelers', 'Adventure Trekkers', 'Wildlife Photographers']
      },
      {
        id: 'monsoon',
        name: 'Kingdom of Clouds (Cherrapunji Falls)',
        period: 'June to September',
        tag: 'Value / Monsoon',
        rating: 4.5,
        tempSummary: '18°C to 26°C',
        weatherDescription: 'The wettest place on earth at its most dramatic, with roaring multi-tiered waterfalls piercing mist.',
        highlights: [
          'Nohkalikai, Wei Sawdong & Seven Sisters Falls in full thunder',
          'Living in eco-resorts perched over deep limestone gorges',
          'Misty mountain driving along Shillong-Cherrapunji highway'
        ],
        clothingAdvice: 'Heavy-duty rain ponchos, waterproof hiking boots with grip, and water-sealed dry bags.',
        idealFor: ['Monsoon Enthusiasts', 'Waterfall Chasers', 'Photographers']
      }
    ],
    monthlyData: [
      { month: 'Jan', fullName: 'January', tempHigh: 16, tempLow: 6, rainfallMm: 12, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Peak Dawki river transparency & root bridge treks' },
      { month: 'Feb', fullName: 'February', tempHigh: 19, tempLow: 8, rainfallMm: 20, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Kaziranga elephant safaris & birdwatching' },
      { month: 'Mar', fullName: 'March', tempHigh: 23, tempLow: 12, rainfallMm: 50, condition: 'Pleasant', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Wild orchids blooming & pleasant Shillong hills' },
      { month: 'Apr', fullName: 'April', tempHigh: 25, tempLow: 15, rainfallMm: 120, condition: 'Pleasant', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Rongali Bihu festival & spring tea gardens' },
      { month: 'May', fullName: 'May', tempHigh: 24, tempLow: 16, rainfallMm: 280, condition: 'Light Showers', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Waterfalls gaining volume & cloud valleys' },
      { month: 'Jun', fullName: 'June', tempHigh: 24, tempLow: 18, rainfallMm: 650, condition: 'Monsoon Rain', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Nohkalikai falls in majestic thunder' },
      { month: 'Jul', fullName: 'July', tempHigh: 25, tempLow: 19, rainfallMm: 850, condition: 'Monsoon Rain', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Full cloud kingdom & misty limestone gorges' },
      { month: 'Aug', fullName: 'August', tempHigh: 25, tempLow: 19, rainfallMm: 600, condition: 'Monsoon Rain', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Lush greenery & Khasi cultural homestays' },
      { month: 'Sep', fullName: 'September', tempHigh: 25, tempLow: 17, rainfallMm: 350, condition: 'Light Showers', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Rivers clearing up & autumn breeze' },
      { month: 'Oct', fullName: 'October', tempHigh: 23, tempLow: 14, rainfallMm: 150, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Kaziranga safari season reopens' },
      { month: 'Nov', fullName: 'November', tempHigh: 19, tempLow: 10, rainfallMm: 30, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Cherry Blossom Festival in Shillong' },
      { month: 'Dec', fullName: 'December', tempHigh: 17, tempLow: 7, rainfallMm: 10, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Hornbill Festival (Nagaland) & clear Dawki' }
    ],
    packingTips: [
      'Sturdy trekking shoes with rubber lug soles for wet rock staircases in Meghalaya.',
      'Trekking pole or collapsible walking stick for the 3,500-step Double Decker Root Bridge hike.',
      'Windbreaker / light fleece for high altitude hill stations like Shillong and Tawang.',
      'Cash in Indian Rupees for remote tribal village stops in Mawlynnong and Dawki.'
    ]
  },
  ladakh: {
    destinationSlug: 'ladakh',
    overallBestTime: 'May to September (Warm Sunny Days & Open High-Altitude Passes)',
    currentTrendAdvice: {
      status: 'Prime Mountain Travel Window',
      headline: 'Best Time for Pangong Tso, Nubra Dunes & High Mountain Passes',
      advice: 'Warm daylight, clear blue skies, and fully accessible mountain passes (Khardung La & Chang La). High altitude UV protection and gradual Day-1 acclimatization are strongly advised.',
      recommendedMonths: 'May – September'
    },
    seasons: [
      {
        id: 'summer-peak',
        name: 'Himalayan Summer & Peak Season',
        period: 'June to August',
        tag: 'Peak Season',
        rating: 5,
        tempSummary: '15°C to 25°C (Day) | 5°C to 10°C (Night)',
        weatherDescription: 'Pleasant warm daytime sun, stark blue skies, blooming apricot orchards, and accessible high-altitude lakes.',
        highlights: [
          'Crystal-clear turquoise views at Pangong Tso and Tso Moriri',
          'Camel safari in Hunder Sand Dunes and Diskit Monastery festival',
          'Scenic road trips via Manali-Leh and Srinagar-Leh highways'
        ],
        clothingAdvice: 'Cotton shirts for daytime sun, warm fleece / windproof jacket for evenings and high passes.',
        idealFor: ['Couples', 'Adventure Enthusiasts', 'Road Trippers', 'Photographers']
      },
      {
        id: 'autumn-shoulder',
        name: 'Autumn Golden Season',
        period: 'September to October',
        tag: 'Shoulder Season',
        rating: 4.6,
        tempSummary: '8°C to 18°C (Day) | -2°C to 5°C (Night)',
        weatherDescription: 'Golden poplar trees lining Indus riverbanks, quiet uncrowded monasteries, and crisp transparent mountain air.',
        highlights: [
          'Golden autumn foliage throughout Sham Valley and Nubra',
          'Uncrowded serene monastery visits with butter lamp ceremonies',
          'Stargazing under crisp dark skies'
        ],
        clothingAdvice: 'Thermal innerwear, down jacket, woolen gloves, and warm beanie.',
        idealFor: ['Peace Seekers', 'Stargazers', 'Landscape Photographers']
      }
    ],
    monthlyData: [
      { month: 'Jan', fullName: 'January', tempHigh: -2, tempLow: -14, rainfallMm: 8, condition: 'Heavy Snow', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Chadar Frozen River Trek' },
      { month: 'Feb', fullName: 'February', tempHigh: 1, tempLow: -12, rainfallMm: 6, condition: 'Snowfall', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Snow Leopard spotting in Hemis' },
      { month: 'Mar', fullName: 'March', tempHigh: 6, tempLow: -5, rainfallMm: 7, condition: 'Snowfall', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Late winter monastery festivals' },
      { month: 'Apr', fullName: 'April', tempHigh: 12, tempLow: 0, rainfallMm: 5, condition: 'Pleasant', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Apricot blossom festival in Kargil & Sham' },
      { month: 'May', fullName: 'May', tempHigh: 17, tempLow: 4, rainfallMm: 4, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Season opening & Zoji La pass clears' },
      { month: 'Jun', fullName: 'June', tempHigh: 21, tempLow: 8, rainfallMm: 3, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Manali-Leh highway opens & Pangong camps' },
      { month: 'Jul', fullName: 'July', tempHigh: 25, tempLow: 12, rainfallMm: 12, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Hemis Festival & Nubra Valley safaris' },
      { month: 'Aug', fullName: 'August', tempHigh: 24, tempLow: 11, rainfallMm: 15, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Warmest month & pristine lake reflections' },
      { month: 'Sep', fullName: 'September', tempHigh: 20, tempLow: 6, rainfallMm: 6, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Ladakh Festival & golden autumn leaves' },
      { month: 'Oct', fullName: 'October', tempHigh: 13, tempLow: -1, rainfallMm: 3, condition: 'Sunny', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Crisp mountain air & quiet gompas' },
      { month: 'Nov', fullName: 'November', tempHigh: 6, tempLow: -7, rainfallMm: 2, condition: 'Snowfall', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Early winter freeze on lakes' },
      { month: 'Dec', fullName: 'December', tempHigh: 0, tempLow: -12, rainfallMm: 5, condition: 'Heavy Snow', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Losar (Ladakhi New Year) celebrations' }
    ],
    packingTips: [
      'High SPF 50+ Sunscreen and UV-400 polarized sunglasses (UV radiation is intense at 11,000+ ft).',
      'Hydration bottle and ORS / electrolyte packets for altitude acclimatization.',
      'Windproof thermal jacket and comfortable broken-in walking shoes.',
      'Moisturizing cream, lip balm, and personal medications.'
    ]
  }
};

export function getDestinationWeather(slug: string): DestinationWeatherSummary {
  const normalized = slug?.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  
  if (destinationsWeatherData[normalized]) {
    return destinationsWeatherData[normalized];
  }

  // Generic fallback if slug isn't found
  return {
    destinationSlug: slug,
    overallBestTime: 'October to May (Pleasant & Clear Weather)',
    currentTrendAdvice: {
      status: 'Active Travel Season',
      headline: `Ideal Conditions for Sightseeing in ${slug}`,
      advice: 'Mild temperatures and favorable climate provide optimal conditions for outdoor sightseeing, cultural tours, and customized excursions.',
      recommendedMonths: 'October – May'
    },
    seasons: [
      {
        id: 'peak',
        name: 'Peak Season',
        period: 'October to March',
        tag: 'Peak Season',
        rating: 5,
        tempSummary: '15°C to 28°C',
        weatherDescription: 'Pleasant, dry days with comfortable evenings for sightseeing and excursions.',
        highlights: ['Optimal weather for outdoor exploration', 'Clear skies and vibrant local culture', 'Full availability of tours and activities'],
        clothingAdvice: 'Light cottons for day, light jacket for evening.',
        idealFor: ['Couples', 'Families', 'First-time Visitors']
      },
      {
        id: 'summer',
        name: 'Summer / Value Season',
        period: 'April to June',
        tag: 'Shoulder Season',
        rating: 4.2,
        tempSummary: '22°C to 34°C',
        weatherDescription: 'Warm days with excellent value on premium stays and fewer tourist crowds.',
        highlights: ['Uncrowded attractions', 'Special off-peak rates', 'Relaxed leisurely pace'],
        clothingAdvice: 'Breathable linens, sun protection, and hats.',
        idealFor: ['Budget Travelers', 'Relaxed Getaways']
      }
    ],
    monthlyData: [
      { month: 'Jan', fullName: 'January', tempHigh: 22, tempLow: 10, rainfallMm: 15, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Peak sightseeing weather' },
      { month: 'Feb', fullName: 'February', tempHigh: 25, tempLow: 12, rainfallMm: 10, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Pleasant outdoor explorations' },
      { month: 'Mar', fullName: 'March', tempHigh: 29, tempLow: 16, rainfallMm: 15, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Spring blossoms & tours' },
      { month: 'Apr', fullName: 'April', tempHigh: 33, tempLow: 20, rainfallMm: 25, condition: 'Warm & Sunny', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Cultural excursions' },
      { month: 'May', fullName: 'May', tempHigh: 35, tempLow: 23, rainfallMm: 40, condition: 'Warm & Sunny', crowdLevel: 'Moderate', isRecommended: false, activityHighlight: 'Resort stays & indoor sights' },
      { month: 'Jun', fullName: 'June', tempHigh: 34, tempLow: 24, rainfallMm: 120, condition: 'Light Showers', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Early monsoon discounts' },
      { month: 'Jul', fullName: 'July', tempHigh: 30, tempLow: 23, rainfallMm: 280, condition: 'Monsoon Rain', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Lush greenery & nature walks' },
      { month: 'Aug', fullName: 'August', tempHigh: 29, tempLow: 23, rainfallMm: 260, condition: 'Monsoon Rain', crowdLevel: 'Low (Value)', isRecommended: false, activityHighlight: 'Rain-washed landscapes' },
      { month: 'Sep', fullName: 'September', tempHigh: 30, tempLow: 21, rainfallMm: 140, condition: 'Pleasant', crowdLevel: 'Moderate', isRecommended: true, activityHighlight: 'Post-monsoon freshness' },
      { month: 'Oct', fullName: 'October', tempHigh: 29, tempLow: 17, rainfallMm: 30, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Festive season & pleasant breezes' },
      { month: 'Nov', fullName: 'November', tempHigh: 26, tempLow: 13, rainfallMm: 10, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Comfortable day tours' },
      { month: 'Dec', fullName: 'December', tempHigh: 23, tempLow: 10, rainfallMm: 10, condition: 'Sunny', crowdLevel: 'High (Peak)', isRecommended: true, activityHighlight: 'Winter holidays & celebrations' }
    ],
    packingTips: [
      'Layered clothing for varying day and night temperatures.',
      'Sun protection: SPF 50 sunscreen, sunglasses, and hat.',
      'Comfortable walking shoes with good grip.'
    ]
  };
}
