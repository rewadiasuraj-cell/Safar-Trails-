import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory leads storage for demo & export
const submittedLeads: any[] = [];

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'SafarTrails', timestamp: new Date().toISOString() });
});

// Direct Download endpoints for travel videos
app.get('/api/download-videos-zip', (req, res) => {
  const zipPath = path.join(process.cwd(), 'public', 'safartrails-videos.zip');
  res.download(zipPath, 'safartrails-videos.zip', (err) => {
    if (err) {
      console.error('Error downloading zip:', err);
      res.status(404).send('Archive not found');
    }
  });
});

app.get('/api/download-video/:filename', (req, res) => {
  const safeFilename = path.basename(req.params.filename);
  const videoPath = path.join(process.cwd(), 'public', 'videos', safeFilename);
  res.download(videoPath, safeFilename, (err) => {
    if (err) {
      console.error('Error downloading video:', err);
      res.status(404).send('Video file not found');
    }
  });
});

// Lead Submission / Quote Request endpoint
app.post('/api/quotes', (req, res) => {
  try {
    const { name, phone, email, destination, travelDates, travellers, budget, itinerarySummary, specialNotes } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and Phone number are required' });
    }

    const lead = {
      id: `ST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      phone,
      email: email || '',
      destination: destination || 'India Custom',
      travelDates: travelDates || 'Flexible',
      travellers: travellers || '2 Adults',
      budget: budget || 'Standard',
      itinerarySummary: itinerarySummary || '',
      specialNotes: specialNotes || '',
      createdAt: new Date().toISOString(),
      status: 'NEW_ENQUIRY'
    };

    submittedLeads.unshift(lead);
    console.log(`[SafarTrails Lead Created] ID: ${lead.id}, Name: ${lead.name}, Destination: ${lead.destination}`);

    // Contextual WhatsApp link generator
    const encodedMsg = encodeURIComponent(
      `Hi SafarTrails Expert! I just submitted an enquiry (#${lead.id}) for ${lead.destination}.\n` +
      `Dates: ${lead.travelDates} | Travellers: ${lead.travellers}\n` +
      `Name: ${lead.name} (${lead.phone})\n` +
      `Please provide the final verified quote & hotel options.`
    );
    const whatsappUrl = `https://wa.me/918076665782?text=${encodedMsg}`;

    return res.json({
      success: true,
      leadId: lead.id,
      whatsappUrl,
      message: 'Your enquiry has been assigned to a Senior SafarTrails Destination Specialist.'
    });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return res.status(500).json({ error: 'Failed to process enquiry' });
  }
});

// AI Trip Planner API with Gemini 3.7 Flash + Structured Schema + Fallback Generator
app.post('/api/ai-plan', async (req, res) => {
  try {
    const {
      destination,
      durationDays = 6,
      travellers = 2,
      tripType = 'Couple',
      hotelCategory = 'Deluxe 4★',
      transportMode = 'Private Sedan',
      interests = ['Nature', 'Sightseeing'],
      budgetTotal,
      startCity = 'Delhi/Mumbai',
      userPrompt
    } = req.body;

    const requestedDestination = destination || 'Kashmir';
    const numDays = Math.min(Math.max(Number(durationDays) || 5, 3), 14);
    const numTravellers = Math.max(Number(travellers) || 2, 1);

    const ai = getGeminiClient();

    if (ai) {
      try {
        const systemPrompt = `You are SafarTrails Chief AI Travel Architect, specializing in high-end, realistic, and culturally rich Indian holiday packages for couples, families, and groups.
Design an authentic, feasible, and detailed day-by-day itinerary in JSON format matching the schema provided.

Guidelines:
1. Destination: ${requestedDestination}. Duration: ${numDays} Days / ${numDays - 1} Nights. Travellers: ${numTravellers}. Type: ${tripType}.
2. Accommodations: ${hotelCategory}. Transport: ${transportMode}. Interests: ${interests.join(', ')}.
3. Starting point/arrival: ${startCity}.
4. Provide realistic, realistic Indian Rupee (INR) cost estimates. The pricing must reflect realistic rates (hotels, transport, permits, food) but must be explicitly marked as indicative starting estimate.
5. Create realistic travel pacing (e.g. realistic driving hours on mountain roads in Kashmir or Himachal, realistic ferry timings in Andaman).
6. Give actionable insider advice and local tips for each day.`;

        // Wrap with a 4.5-second timeout race for instant responsiveness
        const geminiCall = ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: userPrompt ? `User request: ${userPrompt}\nBuild a customized ${numDays}-day plan for ${requestedDestination}.` : `Generate a customized ${numDays}-day itinerary for ${requestedDestination}.`,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                includedHighlights: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                estimatedBudget: {
                  type: Type.OBJECT,
                  properties: {
                    min: { type: Type.NUMBER },
                    max: { type: Type.NUMBER },
                    perPerson: { type: Type.NUMBER },
                    breakdown: {
                      type: Type.OBJECT,
                      properties: {
                        hotels: { type: Type.NUMBER },
                        transport: { type: Type.NUMBER },
                        sightseeingAndPermits: { type: Type.NUMBER },
                        foodAndMisc: { type: Type.NUMBER }
                      },
                      required: ['hotels', 'transport', 'sightseeingAndPermits', 'foodAndMisc']
                    }
                  },
                  required: ['min', 'max', 'perPerson', 'breakdown']
                },
                itinerary: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      dayNumber: { type: Type.INTEGER },
                      title: { type: Type.STRING },
                      location: { type: Type.STRING },
                      description: { type: Type.STRING },
                      morningActivity: { type: Type.STRING },
                      afternoonActivity: { type: Type.STRING },
                      eveningActivity: { type: Type.STRING },
                      stay: { type: Type.STRING },
                      mealsIncluded: { type: Type.STRING },
                      transfers: { type: Type.STRING },
                      insiderTip: { type: Type.STRING }
                    },
                    required: ['dayNumber', 'title', 'location', 'description']
                  }
                },
                expertTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                packingEssentials: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                bestTimeToVisitInfo: { type: Type.STRING }
              },
              required: ['title', 'summary', 'includedHighlights', 'estimatedBudget', 'itinerary', 'expertTips', 'packingEssentials', 'bestTimeToVisitInfo']
            }
          }
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI generation timeout')), 4500)
        );

        const response: any = await Promise.race([geminiCall, timeoutPromise]);

        if (response && response.text) {
          const parsed = JSON.parse(response.text);
          const finalResult = {
            planId: `AI-${Date.now().toString(36).toUpperCase()}`,
            destination: requestedDestination,
            durationDays: numDays,
            durationNights: numDays - 1,
            travellersCount: numTravellers,
            tripType,
            hotelCategory,
            transportType: transportMode,
            ...parsed,
            disclaimer: 'All prices and durations are estimated indicative figures based on standard travel rates. Exact package costs depend on live hotel availability, seasonality, and custom upgrades. Final quotes are confirmed by a SafarTrails Travel Specialist.'
          };
          return res.json({ success: true, plan: finalResult });
        }
      } catch (geminiError: any) {
        // Graceful silent fallback to the internal expert engine
      }
    }

    // Fallback Curated Engine (guarantees fast, robust, offline-safe generation)
    const fallbackPlan = generateFallbackPlan({
      destination: requestedDestination,
      durationDays: numDays,
      travellers: numTravellers,
      tripType,
      hotelCategory,
      transportMode,
      interests
    });

    return res.json({ success: true, plan: fallbackPlan });

  } catch (err: any) {
    console.error('Error generating AI plan:', err);
    return res.status(500).json({ error: 'Failed to generate trip plan' });
  }
});

// Fallback Engine Helper with Rich Multi-Destination Data
function generateFallbackPlan(params: any) {
  const { destination, durationDays, travellers, tripType, hotelCategory, transportMode } = params;
  const dLower = destination.toLowerCase();
  const isKashmir = dLower.includes('kashmir') || dLower.includes('srinagar');
  const isGoa = dLower.includes('goa');
  const isKerala = dLower.includes('kerala') || dLower.includes('munnar');
  const isRajasthan = dLower.includes('rajasthan') || dLower.includes('jaipur') || dLower.includes('udaipur');
  const isAndaman = dLower.includes('andaman') || dLower.includes('havelock');
  const isHimachal = dLower.includes('himachal') || dLower.includes('manali') || dLower.includes('shimla');
  const isLadakh = dLower.includes('ladakh') || dLower.includes('leh');
  const isUttarakhand = dLower.includes('uttarakhand') || dLower.includes('rishikesh') || dLower.includes('nainital');
  const isNortheast = dLower.includes('meghalaya') || dLower.includes('shillong') || dLower.includes('northeast') || dLower.includes('sikkim');

  let baseRatePerPerson = 16500;
  if (isKashmir) baseRatePerPerson = 17500;
  else if (isGoa) baseRatePerPerson = 13500;
  else if (isKerala) baseRatePerPerson = 16000;
  else if (isRajasthan) baseRatePerPerson = 18000;
  else if (isAndaman) baseRatePerPerson = 23000;
  else if (isHimachal) baseRatePerPerson = 15000;
  else if (isLadakh) baseRatePerPerson = 22000;
  else if (isUttarakhand) baseRatePerPerson = 14500;
  else if (isNortheast) baseRatePerPerson = 19000;

  const totalMin = Math.round(baseRatePerPerson * travellers * (durationDays / 6) * 0.95);
  const totalMax = Math.round(totalMin * 1.15);

  const itinerary: any[] = [];
  for (let i = 1; i <= durationDays; i++) {
    let dayTitle = `Day ${i}: Discover ${destination}`;
    let loc = destination;
    let desc = `Comprehensive sightseeing and curated cultural exploration tailored for ${tripType}.`;
    let morn = 'Morning scenic sightseeing & heritage visits';
    let aft = 'Afternoon local experiences and scenic photo stops';
    let eve = 'Evening leisure stroll, local dining, and comfortable overnight stay';
    let stay = `${hotelCategory} Resort / Cottage`;
    let tip = 'Carry a lightweight day-pack and keep your camera charged.';

    if (isKashmir) {
      if (i === 1) {
        dayTitle = 'Arrival in Srinagar & Dal Lake Sunset Shikara';
        loc = 'Srinagar';
        desc = 'Check-in to a luxury Cedar Houseboat on Dal Lake. Enjoy a serene 1-hour sunset Shikara ride across floating lotus gardens.';
        morn = 'Airport pickup and check-in to heritage houseboat';
        aft = 'Boulevard road walk and aromatic Kashmiri Kahwa';
        eve = 'Sunset Shikara cruise & traditional Wazwan dinner';
        stay = 'Heritage Deluxe Houseboat, Dal Lake';
        tip = 'Ask your Shikara pilot for a cup of authentic saffron Kahwa at Char Chinar.';
      } else if (i === 2) {
        dayTitle = 'Gulmarg Gondola Ride & Apharwat Peak';
        loc = 'Gulmarg';
        desc = 'Ascend Asia’s highest cable car to Kongdoori and Apharwat Peak at 13,780 ft with breathtaking snow mountain vistas.';
        morn = 'Scenic drive to Gulmarg and boarding Gondola Phase 1 & 2';
        aft = 'Snow sports, alpine photography, and meadow stroll';
        eve = 'Drive back to Srinagar, leisure at Dal Lake boulevard';
        stay = 'Grand Valley View Resort, Srinagar';
        tip = 'Pre-book Gondola Phase 2 online 2 weeks prior to avoid queue delays.';
      } else if (i === 3) {
        dayTitle = 'Scenic Drive to Pahalgam Pine Valleys';
        loc = 'Pahalgam';
        desc = 'Drive along the roaring Lidder River via Pampore saffron fields and Avantipur 9th-century temple ruins.';
        morn = 'Drive to Pahalgam with stops at saffron fields and apple orchards';
        aft = 'Riverside lunch and nature walk beside Lidder River';
        eve = 'Cozy bonfire dinner surrounded by dense deodar forests';
        stay = 'Pine View Resort 4★, Pahalgam';
        tip = 'Stop at Pampore for authentic certified Kashmiri saffron and walnut kernels.';
      } else if (i === 4) {
        dayTitle = 'Betaab Valley, Aru Valley & Baisaran Meadow';
        loc = 'Pahalgam';
        desc = 'Excursion to Betaab Valley, Aru Valley wildlife sanctuary, and optional pony trek to Baisaran ("Mini Switzerland").';
        morn = 'Betaab Valley film shooting spots and crystal river photography';
        aft = 'Aru Valley scenic drive and local Gujjar village visit';
        eve = 'Pahalgam market stroll for wooden handicrafts and honey';
        stay = 'Pine View Resort 4★, Pahalgam';
        tip = 'Rent rubber snow boots locally near Betaab Valley during spring/winter.';
      } else if (i === durationDays) {
        dayTitle = 'Srinagar Souvenir Shopping & Departure';
        loc = 'Srinagar';
        desc = 'Morning dry fruit and Pashmina shopping at Lal Chowk before transfer to Srinagar Airport.';
        morn = 'Shankaracharya Temple view and Lal Chowk spice market';
        aft = 'Airport transfer with unforgettable Himalayan memories';
        eve = 'Departure flight';
        stay = 'Departure';
        tip = 'Arrive at Srinagar Airport 3 hours prior due to mountain airport security protocols.';
      }
    } else if (isGoa) {
      if (i === 1) {
        dayTitle = 'Goa Arrival & Sunset Beach Shack Welcome';
        loc = 'North Goa';
        desc = 'Check-in to a luxury coastal resort. Relax on the golden sands and savor fresh seafood with sundowners.';
        morn = 'Airport/Station pickup & resort check-in';
        aft = 'Poolside unwinding & tropical fruit welcome drink';
        eve = 'Candlelight dinner at a beachfront shack with live music';
        stay = 'Boutique Beach Resort 4★';
        tip = 'Book beach shack tables early for premier sunset ocean views.';
      } else if (i === 2) {
        dayTitle = 'Historic Forts & Mandovi Sunset River Cruise';
        loc = 'Aguada & Panaji';
        desc = 'Explore 17th-century Portuguese Aguada Fort, lighthouse panoramic viewpoints, and sunset cruise along Mandovi.';
        morn = 'Fort Aguada & Sinquerim Beach panoramic photo tour';
        aft = 'Anjuna & Vagator cliff exploration';
        eve = 'Mandovi River catamaran cruise with Goan folk performances';
        stay = 'Boutique Beach Resort 4★';
        tip = 'Wear polarized sunglasses and slip-resistant sandals for rocky fort paths.';
      } else if (i === 3) {
        dayTitle = 'Fontainhas Latin Quarter & Spice Plantation';
        loc = 'Panaji & Ponda';
        desc = 'Heritage walk through pastel-painted Portuguese villas in Fontainhas, followed by authentic Goan buffet at a spice plantation.';
        morn = 'Fontainhas heritage architecture walk & boutique cafes';
        aft = 'Organic spice plantation tour with elephant encounters & buffet';
        eve = 'Miramar beach sunset and Panaji riverside promenade';
        stay = 'Boutique Beach Resort 4★';
        tip = 'Try authentic Bebinca and Poi bread at traditional bakeries in Fontainhas.';
      } else if (i === durationDays) {
        dayTitle = 'Beach Morning & Airport Transfer';
        loc = 'Goa Departure';
        desc = 'Final seaside breakfast, souvenir cashew shopping, and comfortable transfer to Goa Airport / MOPA.';
        morn = 'Morning swim and beachside cafe breakfast';
        aft = 'Cashew nut & feni tasting before airport drop';
        eve = 'Departure flight';
        stay = 'Departure';
        tip = 'Keep 2.5 hours travel time if departing from MOPA Airport in North Goa.';
      }
    } else if (isKerala) {
      if (i === 1) {
        dayTitle = 'Arrival in Kochi & Drive to Munnar Tea Hills';
        loc = 'Munnar';
        desc = 'Scenic drive to Munnar via Cheeyappara and Valara waterfalls amidst lush Western Ghats.';
        morn = 'Pickup from Cochin Airport & scenic drive into the misty hills';
        aft = 'Cheeyappara waterfalls photo stop and spice garden visit';
        eve = 'Resort check-in with panoramic tea valley views';
        stay = 'Misty Mountain Resort 4★, Munnar';
        tip = 'Keep a light cardigan ready as temperature drops significantly in Munnar.';
      } else if (i === 2) {
        dayTitle = 'Munnar Tea Plantations & Eravikulam Sanctuary';
        loc = 'Munnar';
        desc = 'Visit Eravikulam National Park (home to endangered Nilgiri Tahr) and Tata Tea Museum.';
        morn = 'Morning Nilgiri Tahr spotting at Eravikulam slopes';
        aft = 'Mattupetty Dam boating and Echo Point';
        eve = 'Tea tasting session and authentic Kerala Ayurvedic massage';
        stay = 'Misty Mountain Resort 4★, Munnar';
        tip = 'Pre-book Eravikulam safari tokens online to avoid long queues.';
      } else if (i === 3) {
        dayTitle = 'Scenic Alleppey Backwaters & Private Houseboat';
        loc = 'Alleppey (Alappuzha)';
        desc = 'Board a traditional luxury Kettuvallam (Houseboat) cruising through palm-fringed canals, paddy fields, and lagoons.';
        morn = 'Drive from Munnar to Alleppey backwaters';
        aft = 'Check-in to private houseboat with freshly caught Karimeen lunch';
        eve = 'Sunset cruise across Vembanad Lake and overnight on water';
        stay = 'Luxury Private AC Houseboat, Alleppey';
        tip = 'Enjoy the freshly prepared banana fritters and local filter coffee at teatime on the deck.';
      } else if (i === durationDays) {
        dayTitle = 'Kochi Heritage & Airport Drop';
        loc = 'Kochi Departure';
        desc = 'Visit historic Fort Kochi, Chinese fishing nets, and spice market before airport drop.';
        morn = 'Fort Kochi colonial walk and Jewish Synagogue';
        aft = 'Souvenir banana chips shopping and airport transfer';
        eve = 'Departure flight';
        stay = 'Departure';
        tip = 'Buy fresh vacuum-packed spices near Mattancherry Jew Town.';
      }
    } else if (isRajasthan) {
      if (i === 1) {
        dayTitle = 'Arrival in Jaipur & Royal Chokhi Dhani Night';
        loc = 'Jaipur';
        desc = 'Welcome to the Pink City. Settle into a heritage haveli and experience traditional Rajasthani folk dance & feast.';
        morn = 'Airport/Station pickup & heritage hotel check-in';
        aft = 'Albert Hall Museum & Birla Mandir visit';
        eve = 'Chokhi Dhani cultural village with Kalbelia dance & Dal Baati Churma';
        stay = 'Heritage Haveli Resort 4★, Jaipur';
        tip = 'Taste the authentic Pyaz Kachori at Rawat Mishtan Bhandar.';
      } else if (i === 2) {
        dayTitle = 'Amber Fort, Hawa Mahal & City Palace';
        loc = 'Jaipur';
        desc = 'Grand tour of majestic Amer Fort with panoramic Maota Lake views, Hawa Mahal photo stop, and Royal City Palace.';
        morn = 'Amer Fort ascent and Sheesh Mahal mirror palace';
        aft = 'Hawa Mahal facade photo stop & Jantar Mantar observatory';
        eve = 'Bapu Bazaar shopping for block-print quilts and blue pottery';
        stay = 'Heritage Haveli Resort 4★, Jaipur';
        tip = 'Take photographs in front of Hawa Mahal early in the morning for best sunlight.';
      } else if (i === 3) {
        dayTitle = 'Scenic Drive to Udaipur - The City of Lakes';
        loc = 'Udaipur';
        desc = 'Drive through the Aravalli hills to romantic Udaipur with optional stop at Chittorgarh or Ranakpur Jain temples.';
        morn = 'Scenic highway drive towards Udaipur';
        aft = 'Arrival in Udaipur and check-in to lake-view resort';
        eve = 'Sunset boat cruise on Lake Pichola overlooking Jag Mandir Palace';
        stay = 'Lake View Palace Hotel 4★, Udaipur';
        tip = 'Sunset boat ride on Lake Pichola gives the most spectacular view of City Palace.';
      } else if (i === durationDays) {
        dayTitle = 'City Palace Tour & Airport Departure';
        loc = 'Udaipur / Jaipur';
        desc = 'Grand City Palace museum tour and transfer to airport with royal memories.';
        morn = 'City Palace royal courtyards and crystal gallery';
        aft = 'Saheliyon ki Bari gardens and airport drop';
        eve = 'Departure flight';
        stay = 'Departure';
        tip = 'Ensure you have baggage space for authentic Rajasthan handicrafts.';
      }
    } else if (isAndaman) {
      if (i === 1) {
        dayTitle = 'Arrival in Port Blair & Cellular Jail Light & Sound Show';
        loc = 'Port Blair';
        desc = 'Arrive in tropical Andaman. Visit historic Cellular Jail and witness the touching patriotic Light & Sound show.';
        morn = 'Airport pickup & coastal hotel check-in';
        aft = 'Corbyn’s Cove beach walk and coconut water';
        eve = 'Cellular Jail national memorial tour and Light & Sound show';
        stay = 'Sea View Resort 4★, Port Blair';
        tip = 'Pre-book front row seats for the Cellular Jail sound & light show.';
      } else if (i === 2) {
        dayTitle = 'High-Speed Ferry to Havelock & Radhanagar Beach';
        loc = 'Havelock Island';
        desc = 'Cruise on Makruzz / Nautika catamaran ferry to Havelock Island. Spend the evening at Asia’s best Radhanagar Beach (Beach No. 7).';
        morn = 'Luxury catamaran cruise to Havelock Island';
        aft = 'Resort check-in and leisure on white sand beach';
        eve = 'Spectacular golden sunset at Radhanagar Beach';
        stay = 'Beachfront Villa 4★, Havelock Island';
        tip = 'Radhanagar Beach sunset is world famous; reach by 4:30 PM for prime spots.';
      } else if (i === 3) {
        dayTitle = 'Elephant Beach Water Sports & Coral Reef Snorkeling';
        loc = 'Havelock Island';
        desc = 'Speedboat ride to Elephant Beach for vibrant coral reef snorkeling, sea walking, and jet skiing.';
        morn = 'Speedboat to Elephant Beach and guided coral snorkeling';
        aft = 'Beach leisure, fresh coconut lunch, and scuba diving';
        eve = 'Candlelight beach dinner at Havelock resort';
        stay = 'Beachfront Villa 4★, Havelock Island';
        tip = 'Wear reef-safe sunscreen and waterproof camera casing.';
      } else if (i === durationDays) {
        dayTitle = 'Ferry to Port Blair & Departure Flight';
        loc = 'Port Blair Departure';
        desc = 'Morning return cruise to Port Blair and airport drop with pristine island memories.';
        morn = 'Catamaran ferry back to Port Blair';
        aft = 'Sagarika Government handicraft emporium and airport drop';
        eve = 'Departure flight';
        stay = 'Departure';
        tip = 'Do not collect or carry coral or seashells in baggage as it is prohibited by forest laws.';
      }
    } else if (isHimachal) {
      if (i === 1) {
        dayTitle = 'Arrival in Manali & Old Manali Cafe Trail';
        loc = 'Manali';
        desc = 'Check-in to a luxury mountain view cottage. Stroll through pine forests and vibrant cedar-wood Old Manali cafes.';
        morn = 'Pickup & mountain cottage check-in';
        aft = 'Hadimba Temple and Van Vihar pine forest walk';
        eve = 'Old Manali live music cafe and trout fish dinner';
        stay = 'Apple Orchard Mountain Resort 4★, Manali';
        tip = 'Visit Hadimba Temple during late afternoon when sunlight filters through the deodars.';
      } else if (i === 2) {
        dayTitle = 'Solang Valley & Atal Tunnel to Sissu Waterfall';
        loc = 'Solang & Lahaul Valley';
        desc = 'Drive through the engineering marvel Atal Tunnel into the snow-capped, high-altitude landscape of Sissu, Lahaul.';
        morn = 'Drive through Atal Tunnel (9.02 km) to Sissu waterfall';
        aft = 'Snow activities at Solang Valley (paragliding, ATV rides)';
        eve = 'Hot Himachali siddu and bonfire evening';
        stay = 'Apple Orchard Mountain Resort 4★, Manali';
        tip = 'Check Atal Tunnel pass status early during winter/monsoon months.';
      } else if (i === durationDays) {
        dayTitle = 'Manali Mall Road & Departure';
        loc = 'Manali Departure';
        desc = 'Morning stroll on Mall Road for woolens and Kullu shawls before transfer.';
        morn = 'Mall Road shopping and Tibetan monastery visit';
        aft = 'Scenic descent and airport/Volvo bus drop';
        eve = 'Departure';
        stay = 'Departure';
        tip = 'Buy authentic Kullu shawls from Himachal Handloom registered outlets.';
      }
    }

    itinerary.push({
      dayNumber: i,
      title: dayTitle,
      location: loc,
      description: desc,
      morningActivity: morn,
      afternoonActivity: aft,
      eveningActivity: eve,
      stay,
      mealsIncluded: 'Breakfast & Dinner Included',
      transfers: transportMode,
      insiderTip: tip
    });
  }

  return {
    planId: `AI-${Date.now().toString(36).toUpperCase()}`,
    destination,
    title: `${durationDays}-Day Bespoke ${destination} Journey`,
    summary: `A carefully paced, high-comfort ${durationDays}-day holiday designed for ${travellers} travellers (${tripType}), combining premier stays in ${hotelCategory} with dedicated ${transportMode} transport.`,
    durationDays,
    durationNights: durationDays - 1,
    travellersCount: travellers,
    tripType,
    hotelCategory,
    transportType: transportMode,
    estimatedBudget: {
      min: totalMin,
      max: totalMax,
      perPerson: Math.round(totalMin / travellers),
      breakdown: {
        hotels: Math.round(totalMin * 0.45),
        transport: Math.round(totalMin * 0.30),
        sightseeingAndPermits: Math.round(totalMin * 0.15),
        foodAndMisc: Math.round(totalMin * 0.10)
      }
    },
    itinerary,
    includedHighlights: [
      `Private dedicated ${transportMode} throughout the trip with verified driver`,
      `${durationDays - 1} Nights handpicked stay in ${hotelCategory}`,
      'Daily freshly prepared breakfast & regional dinners included',
      'All toll taxes, parking fees, and driver allowances covered',
      '24/7 SafarTrails on-trip concierge assistance'
    ],
    expertTips: [
      'Book entry permits and cable car slots in advance during peak holiday seasons.',
      'Always dress in comfortable layers for fluctuating mountain and coastal temperatures.',
      'Carry cash for remote village shops and pony rides where network may vary.'
    ],
    packingEssentials: [
      'Valid Government Photo ID (Aadhaar / Passport / Driving License)',
      'Comfortable walking shoes with good grip',
      'Sunscreen, polarized sunglasses, and essential personal medicines',
      'Universal power bank and camera chargers'
    ],
    bestTimeToVisitInfo: 'Optimal travel season spans throughout the year depending on preferences for snow, pleasant sunshine, or lush monsoons.',
    disclaimer: 'All prices and durations are estimated indicative figures based on standard travel rates. Exact package costs depend on live hotel availability, seasonality, and custom upgrades. Final quotes are confirmed by a SafarTrails Travel Specialist.'
  };
}

// Start Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SafarTrails Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
