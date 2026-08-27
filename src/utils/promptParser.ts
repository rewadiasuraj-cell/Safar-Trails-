import { TripType, HotelCategory, TransportType } from '../types';

export interface ParsedTripDetails {
  destination: string;
  durationDays: number;
  durationNights: number;
  travellers: number;
  tripType: TripType;
  hotelCategory: HotelCategory;
  transportMode: TransportType;
  budgetTotal?: number;
  interests: string[];
  specialRequests?: string;
  rawPrompt: string;
}

const DESTINATION_DICTIONARY: { [key: string]: string } = {
  // Goa & Beaches
  goa: 'Goa',
  'north goa': 'Goa',
  'south goa': 'Goa',
  panaji: 'Goa',
  panjim: 'Goa',
  calangute: 'Goa',
  baga: 'Goa',
  anjuna: 'Goa',
  candolim: 'Goa',
  vagator: 'Goa',
  morjim: 'Goa',
  palolem: 'Goa',

  // Kashmir
  kashmir: 'Kashmir',
  srinagar: 'Kashmir',
  gulmarg: 'Kashmir',
  pahalgam: 'Kashmir',
  sonamarg: 'Kashmir',
  sonmarg: 'Kashmir',
  'dal lake': 'Kashmir',
  doodhpathri: 'Kashmir',
  yusmarg: 'Kashmir',

  // Kerala
  kerala: 'Kerala',
  munnar: 'Kerala',
  alleppey: 'Kerala',
  alappuzha: 'Kerala',
  kochi: 'Kerala',
  cochin: 'Kerala',
  thekkady: 'Kerala',
  wayanad: 'Kerala',
  kovalam: 'Kerala',
  varkala: 'Kerala',
  kumarakom: 'Kerala',
  bekal: 'Kerala',

  // Rajasthan
  rajasthan: 'Rajasthan',
  jaipur: 'Rajasthan',
  udaipur: 'Rajasthan',
  jodhpur: 'Rajasthan',
  jaisalmer: 'Rajasthan',
  pushkar: 'Rajasthan',
  'mount abu': 'Rajasthan',
  bikaner: 'Rajasthan',
  chittorgarh: 'Rajasthan',
  ranthambore: 'Rajasthan',

  // Himachal Pradesh
  himachal: 'Himachal Pradesh',
  'himachal pradesh': 'Himachal Pradesh',
  manali: 'Himachal Pradesh',
  shimla: 'Himachal Pradesh',
  dharamshala: 'Himachal Pradesh',
  dharamsala: 'Himachal Pradesh',
  mcleodganj: 'Himachal Pradesh',
  kasol: 'Himachal Pradesh',
  spiti: 'Himachal Pradesh',
  'spiti valley': 'Himachal Pradesh',
  jibhi: 'Himachal Pradesh',
  dalhousie: 'Himachal Pradesh',
  'bir billing': 'Himachal Pradesh',
  kullu: 'Himachal Pradesh',
  tirthan: 'Himachal Pradesh',

  // Uttarakhand
  uttarakhand: 'Uttarakhand',
  rishikesh: 'Uttarakhand',
  haridwar: 'Uttarakhand',
  nainital: 'Uttarakhand',
  mussoorie: 'Uttarakhand',
  corbett: 'Uttarakhand',
  'jim corbett': 'Uttarakhand',
  auli: 'Uttarakhand',
  dehradun: 'Uttarakhand',
  kedarnath: 'Uttarakhand',
  badrinath: 'Uttarakhand',
  chopta: 'Uttarakhand',
  kausani: 'Uttarakhand',

  // Ladakh
  ladakh: 'Ladakh',
  leh: 'Ladakh',
  nubra: 'Ladakh',
  'nubra valley': 'Ladakh',
  pangong: 'Ladakh',
  'pangong lake': 'Ladakh',
  zanskar: 'Ladakh',
  'tso moriri': 'Ladakh',

  // Andaman & Nicobar
  andaman: 'Andaman & Nicobar',
  'andaman & nicobar': 'Andaman & Nicobar',
  'andaman and nicobar': 'Andaman & Nicobar',
  havelock: 'Andaman & Nicobar',
  'port blair': 'Andaman & Nicobar',
  'neil island': 'Andaman & Nicobar',

  // Northeast India
  meghalaya: 'Northeast India',
  shillong: 'Northeast India',
  cherrapunji: 'Northeast India',
  cherrapunjee: 'Northeast India',
  dawki: 'Northeast India',
  kaziranga: 'Northeast India',
  assam: 'Northeast India',
  sikkim: 'Northeast India',
  gangtok: 'Northeast India',
  darjeeling: 'Northeast India',
  arunachal: 'Northeast India',
  tawang: 'Northeast India',
  northeast: 'Northeast India',

  // Other popular destinations
  coorg: 'Coorg (Karnataka)',
  ooty: 'Ooty (Tamil Nadu)',
  kodaikanal: 'Kodaikanal (Tamil Nadu)',
  hampi: 'Hampi (Karnataka)',
  mysore: 'Mysore (Karnataka)',
  gokarna: 'Gokarna (Karnataka)',
  chikmagalur: 'Chikmagalur (Karnataka)',
  pondicherry: 'Puducherry (Pondicherry)',
  varanasi: 'Varanasi',
  agra: 'Agra (Golden Triangle)'
};

const NUMBER_WORDS: { [key: string]: number } = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14
};

export function parseTripPrompt(
  prompt: string,
  defaults?: Partial<ParsedTripDetails>
): ParsedTripDetails {
  const p = (prompt || '').trim();
  const lower = p.toLowerCase();

  // 1. DESTINATION EXTRACTION
  let extractedDestination = '';

  // Check dictionary keys (sorted by descending key length to match specific cities before states)
  const sortedKeys = Object.keys(DESTINATION_DICTIONARY).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    // Word boundary regex check
    const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lower)) {
      extractedDestination = DESTINATION_DICTIONARY[key];
      break;
    }
  }

  // If not found in dictionary, search for prepositional patterns e.g. "in Goa", "trip to Manali", "tour of Kerala"
  if (!extractedDestination) {
    const prepositionMatch = p.match(/(?:trip to|tour of|holiday in|vacation in|visit|travel to|explore|going to|in|to)\s+([A-Za-z\s]{2,25}?)(?:,|\.|\s+for|\s+with|\s+under|\s+in\s+\d|\s+\d|$)/i);
    if (prepositionMatch && prepositionMatch[1]) {
      const candidate = prepositionMatch[1].trim();
      if (!['a', 'the', 'my', 'our', 'some', 'any', 'couple', 'family', 'budget', 'days', 'nights'].includes(candidate.toLowerCase())) {
        extractedDestination = candidate.charAt(0).toUpperCase() + candidate.slice(1);
      }
    }
  }

  if (!extractedDestination) {
    extractedDestination = defaults?.destination || 'Goa';
  }

  // 2. DURATION EXTRACTION (DAYS & NIGHTS)
  let extractedDays = 0;

  // Check "5D/4N" or "5D 4N" or "5d/4n"
  const dnMatch = lower.match(/(\d+)\s*d\s*(?:\/|\s*and\s*|\s*,\s*|-|\s+)\s*(\d+)\s*n/i);
  if (dnMatch) {
    extractedDays = parseInt(dnMatch[1], 10);
  }

  // Check "5 days" or "5 day" or "5days"
  if (!extractedDays) {
    const daysMatch = lower.match(/(\d+)\s*(?:days?|d\b)/i);
    if (daysMatch) {
      extractedDays = parseInt(daysMatch[1], 10);
    }
  }

  // Check "4 nights" -> 5 days
  if (!extractedDays) {
    const nightsMatch = lower.match(/(\d+)\s*(?:nights?|n\b)/i);
    if (nightsMatch) {
      extractedDays = parseInt(nightsMatch[1], 10) + 1;
    }
  }

  // Check word numbers "five days", "six days", "a week", "weekend"
  if (!extractedDays) {
    if (lower.includes('a week') || lower.includes('one week') || lower.includes('1 week')) {
      extractedDays = 7;
    } else if (lower.includes('two weeks') || lower.includes('2 weeks')) {
      extractedDays = 14;
    } else if (lower.includes('long weekend')) {
      extractedDays = 4;
    } else if (lower.includes('weekend')) {
      extractedDays = 3;
    } else {
      for (const [word, num] of Object.entries(NUMBER_WORDS)) {
        if (new RegExp(`\\b${word}\\s*(?:days?|d\\b)`, 'i').test(lower)) {
          extractedDays = num;
          break;
        }
        if (new RegExp(`\\b${word}\\s*(?:nights?|n\\b)`, 'i').test(lower)) {
          extractedDays = num + 1;
          break;
        }
      }
    }
  }

  // Enforce realistic bounds (3 to 14 days)
  if (extractedDays > 0) {
    extractedDays = Math.min(Math.max(extractedDays, 3), 14);
  } else {
    extractedDays = defaults?.durationDays || 5;
  }

  // 3. TRAVELLERS COUNT & TRIP TYPE EXTRACTION
  let extractedTravellers = 0;
  let extractedTripType: TripType = 'Couple';

  // Check explicit passenger / people counts e.g. "4 people", "4 pax", "4 adults", "2 travellers"
  const paxMatch = lower.match(/(\d+)\s*(?:people|pax|travellers?|travelers?|adults?|persons?|guests?|members?|friends?)/i);
  if (paxMatch) {
    extractedTravellers = parseInt(paxMatch[1], 10);
  }

  // Check word number pax e.g. "four people", "two adults"
  if (!extractedTravellers) {
    for (const [word, num] of Object.entries(NUMBER_WORDS)) {
      if (new RegExp(`\\b${word}\\s*(?:people|pax|travellers?|travelers?|adults?|persons?|guests?)`, 'i').test(lower)) {
        extractedTravellers = num;
        break;
      }
    }
  }

  // Trip Type Detection
  if (lower.includes('honeymoon') || lower.includes('honey moon')) {
    extractedTripType = 'Honeymoon';
    if (!extractedTravellers) extractedTravellers = 2;
  } else if (lower.includes('family') || lower.includes('kids') || lower.includes('children') || lower.includes('parents')) {
    extractedTripType = 'Family';
    if (!extractedTravellers) extractedTravellers = 4;
  } else if (lower.includes('friends') || lower.includes('bachelor') || lower.includes('colleagues') || lower.includes('boys trip') || lower.includes('girls trip')) {
    extractedTripType = 'Friends';
    if (!extractedTravellers) extractedTravellers = 4;
  } else if (lower.includes('solo') || lower.includes('alone') || lower.includes('myself') || lower.includes('1 person') || lower.includes('single')) {
    extractedTripType = 'Solo';
    extractedTravellers = 1;
  } else if (lower.includes('adventure') || lower.includes('trekking') || lower.includes('trek') || lower.includes('biking') || lower.includes('bike trip')) {
    extractedTripType = 'Adventure';
    if (!extractedTravellers) extractedTravellers = 2;
  } else if (lower.includes('luxury') || lower.includes('5 star') || lower.includes('vip') || lower.includes('palace')) {
    extractedTripType = 'Luxury';
    if (!extractedTravellers) extractedTravellers = 2;
  } else if (lower.includes('spiritual') || lower.includes('temple') || lower.includes('darshan') || lower.includes('yatra') || lower.includes('pilgrimage')) {
    extractedTripType = 'Spiritual';
    if (!extractedTravellers) extractedTravellers = 2;
  } else if (lower.includes('weekend')) {
    extractedTripType = 'Weekend';
    if (!extractedTravellers) extractedTravellers = 2;
  } else if (lower.includes('couple') || lower.includes('husband') || lower.includes('wife') || lower.includes('partner') || lower.includes('2 of us') || lower.includes('two of us')) {
    extractedTripType = 'Couple';
    if (!extractedTravellers) extractedTravellers = 2;
  }

  if (!extractedTravellers) {
    if (defaults?.travellers) {
      extractedTravellers = defaults.travellers;
    } else if (extractedTripType === 'Family' || extractedTripType === 'Friends') {
      extractedTravellers = 4;
    } else if (extractedTripType === 'Solo') {
      extractedTravellers = 1;
    } else {
      extractedTravellers = 2;
    }
  }

  // 4. HOTEL & STAY PREFERENCES
  let extractedHotel: HotelCategory = 'Deluxe 4★';
  if (lower.includes('5 star') || lower.includes('5-star') || lower.includes('5★') || lower.includes('five star') || lower.includes('luxury resort') || lower.includes('palace')) {
    extractedHotel = 'Luxury 5★';
  } else if (lower.includes('heritage') || lower.includes('haveli') || lower.includes('boutique')) {
    extractedHotel = 'Heritage Boutique';
  } else if (lower.includes('houseboat') || lower.includes('treehouse') || lower.includes('shikara stay')) {
    extractedHotel = 'Houseboat & Resort';
  } else if (lower.includes('3 star') || lower.includes('3-star') || lower.includes('3★') || lower.includes('three star') || lower.includes('budget') || lower.includes('standard') || lower.includes('affordable')) {
    extractedHotel = 'Standard 3★';
  } else if (lower.includes('beach resort') || lower.includes('resort') || lower.includes('deluxe') || lower.includes('4 star') || lower.includes('4-star') || lower.includes('4★')) {
    extractedHotel = 'Deluxe 4★';
  } else if (defaults?.hotelCategory) {
    extractedHotel = defaults.hotelCategory;
  }

  // 5. TRANSPORT MODE
  let extractedTransport: TransportType = 'Private Sedan';
  if (lower.includes('suv') || lower.includes('innova') || lower.includes('crysta') || lower.includes('fortuner')) {
    extractedTransport = 'Private SUV (Innova/Crysta)';
  } else if (lower.includes('tempo') || lower.includes('traveller') || lower.includes('mini bus') || extractedTravellers >= 6) {
    extractedTransport = 'Tempo Traveller';
  } else if (lower.includes('self drive') || lower.includes('self-drive') || lower.includes('rental car')) {
    extractedTransport = 'Self Drive / Flight + Cab';
  } else if (extractedTravellers >= 4) {
    extractedTransport = 'Private SUV (Innova/Crysta)';
  } else if (defaults?.transportMode) {
    extractedTransport = defaults.transportMode;
  }

  // 6. BUDGET EXTRACTION
  let extractedBudget: number | undefined = undefined;
  // Match "80k", "80,000", "1.5 lakh", "under 80000", "₹80,000"
  const budgetMatch = lower.match(/(?:budget|under|around|approx|for|within|below|max)?\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|thousand|lakh|lakhs|lac|lacs|cr)?\b/i);
  if (budgetMatch && (lower.includes('budget') || lower.includes('under') || lower.includes('₹') || lower.includes('rs') || lower.includes('inr') || lower.includes('k') || lower.includes('lakh'))) {
    let rawNum = parseFloat(budgetMatch[1].replace(/,/g, ''));
    const unit = (budgetMatch[2] || '').toLowerCase();
    if (unit === 'k' || unit === 'thousand') {
      rawNum *= 1000;
    } else if (unit === 'lakh' || unit === 'lakhs' || unit === 'lac' || unit === 'lacs') {
      rawNum *= 100000;
    } else if (unit === 'cr') {
      rawNum *= 10000000;
    }
    if (rawNum >= 10000) {
      extractedBudget = Math.round(rawNum);
    }
  }

  // 7. INTERESTS & THEMES
  const interests: string[] = [];
  if (lower.includes('beach') || lower.includes('sea') || lower.includes('ocean') || lower.includes('coastal') || lower.includes('shack')) {
    interests.push('Beach & Coastal Vibes');
  }
  if (lower.includes('honeymoon') || lower.includes('romantic') || lower.includes('candlelight')) {
    interests.push('Candlelight Dinners & Sunset Points');
  }
  if (lower.includes('snow') || lower.includes('gondola') || lower.includes('mountain') || lower.includes('valley')) {
    interests.push('Mountains & Snow');
  }
  if (lower.includes('water sports') || lower.includes('scuba') || lower.includes('snorkeling') || lower.includes('parasailing') || lower.includes('kayak')) {
    interests.push('Water Sports & Marine Adventures');
  }
  if (lower.includes('backwater') || lower.includes('houseboat') || lower.includes('shikara') || lower.includes('lake')) {
    interests.push('Houseboats & Waters');
  }
  if (lower.includes('heritage') || lower.includes('fort') || lower.includes('palace') || lower.includes('temple') || lower.includes('monument')) {
    interests.push('Heritage & Royal Forts');
  }
  if (lower.includes('trek') || lower.includes('adventure') || lower.includes('rafting') || lower.includes('safari') || lower.includes('paragliding')) {
    interests.push('Adventure & Treks');
  }
  if (lower.includes('ayurveda') || lower.includes('spa') || lower.includes('wellness') || lower.includes('massage')) {
    interests.push('Ayurveda & Spa Wellness');
  }
  if (lower.includes('food') || lower.includes('cuisine') || lower.includes('wazwan') || lower.includes('seafood') || lower.includes('curry')) {
    interests.push('Food & Regional Delicacies');
  }
  if (lower.includes('shopping') || lower.includes('souvenir') || lower.includes('handicraft') || lower.includes('bazaar')) {
    interests.push('Shopping & Handicrafts');
  }

  if (interests.length === 0) {
    interests.push('Sightseeing & Scenic Spots', 'Local Experiences');
  }

  return {
    destination: extractedDestination,
    durationDays: extractedDays,
    durationNights: Math.max(extractedDays - 1, 1),
    travellers: extractedTravellers,
    tripType: extractedTripType,
    hotelCategory: extractedHotel,
    transportMode: extractedTransport,
    budgetTotal: extractedBudget || defaults?.budgetTotal,
    interests,
    rawPrompt: p
  };
}
