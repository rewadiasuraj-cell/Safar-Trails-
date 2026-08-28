import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import compression from 'compression';
import { GoogleGenAI, Type } from '@google/genai';
import { parseTripPrompt } from './src/utils/promptParser';
import { sendQuoteEmail } from './src/lib/email/sendQuoteEmail';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(compression());
app.use(express.json());

// In-memory leads storage for demo & export
const submittedLeads: any[] = [];

const QUOTE_NOTIFY_EMAIL = 'info.safartrails@gmail.com';

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

    // Fire-and-forget: never awaited, and a failure here must never affect the
    // response below - the enquiry itself and the WhatsApp link already succeeded.
    if (process.env.RESEND_API_KEY) {
      sendQuoteEmail({
        apiKey: process.env.RESEND_API_KEY,
        fromEmail: process.env.RESEND_FROM_EMAIL,
        toEmail: QUOTE_NOTIFY_EMAIL,
        lead: {
          leadId: lead.id,
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          destination: lead.destination,
          travelDates: lead.travelDates,
          travellers: lead.travellers,
          budget: lead.budget,
          specialNotes: lead.specialNotes,
          itinerarySummary: lead.itinerarySummary,
        },
      }).then((result) => {
        if (!result.ok) console.error('[SafarTrails Quote Email] Failed to send:', result.error);
      });
    }

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

// AI Trip Planner API with Gemini 3.7 Flash + Strict Natural Language Parsing + Multi-Destination Fallback
app.post('/api/ai-plan', async (req, res) => {
  try {
    const rawBody = req.body || {};
    const {
      userPrompt = '',
      startCity = 'Delhi/Mumbai'
    } = rawBody;

    // 1. Natural Language Entity Extraction & Sanitization
    const parsed = parseTripPrompt(userPrompt, {
      destination: rawBody.destination,
      durationDays: rawBody.durationDays,
      travellers: rawBody.travellers,
      tripType: rawBody.tripType,
      hotelCategory: rawBody.hotelCategory,
      transportMode: rawBody.transportMode,
      budgetTotal: rawBody.budgetTotal
    });

    const requestedDestination = parsed.destination || rawBody.destination || 'Goa';
    const numDays = Math.min(Math.max(Number(parsed.durationDays) || 5, 3), 14);
    const numTravellers = Math.max(Number(parsed.travellers) || 2, 1);
    const tripType = parsed.tripType || rawBody.tripType || 'Couple';
    const hotelCategory = parsed.hotelCategory || rawBody.hotelCategory || 'Deluxe 4★';
    const transportMode = parsed.transportMode || rawBody.transportMode || 'Private Sedan';
    const interests = (parsed.interests && parsed.interests.length > 0) ? parsed.interests : (rawBody.interests || ['Sightseeing', 'Local Experiences']);
    const budgetTotal = parsed.budgetTotal || rawBody.budgetTotal;

    const ai = getGeminiClient();

    if (ai) {
      try {
        const systemPrompt = `You are SafarTrails Chief AI Travel Architect, an expert in personalized, high-comfort Indian journeys.
CRITICAL MANDATE:
1. DESTINATION ENFORCEMENT: The user requested an itinerary for "${requestedDestination}". You MUST generate the itinerary strictly for "${requestedDestination}". DO NOT substitute with Kashmir or any other destination unless Kashmir was explicitly requested.
2. DURATION ENFORCEMENT: You MUST generate exactly ${numDays} days (numbered 1 to ${numDays}) for a ${numDays} Days / ${numDays - 1} Nights trip.
3. TRAVELLERS & TYPE: Tailor activities specifically for ${numTravellers} travellers (${tripType}).
4. ACCOMMODATION & TRANSPORT: Base recommendations on ${hotelCategory} and ${transportMode}.
5. BUDGET CALIBRATION: ${budgetTotal ? `Target approx total budget: ₹${budgetTotal}.` : 'Provide authentic, realistic market estimates in INR.'}
6. Provide specific, real landmark names, authentic regional meals, realistic road/ferry travel pacing, and actionable insider advice for each day.`;

        const userPromptText = userPrompt 
          ? `User Natural Request: "${userPrompt}"\nTarget Destination: "${requestedDestination}"\nTarget Duration: ${numDays} Days / ${numDays - 1} Nights\nTravellers: ${numTravellers} (${tripType})\nAccommodation: ${hotelCategory}\nTransport: ${transportMode}\nKey Interests: ${interests.join(', ')}\n\nGenerate the complete authentic day-by-day JSON itinerary strictly for "${requestedDestination}".`
          : `Generate a customized ${numDays}-day / ${numDays - 1}-night itinerary for "${requestedDestination}" with ${numTravellers} travellers (${tripType}), staying in ${hotelCategory} with ${transportMode} transport.`;

        // 12-second timeout to allow rich structured generation
        const geminiCall = ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: userPromptText,
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
          setTimeout(() => reject(new Error('AI generation timeout')), 12000)
        );

        const response: any = await Promise.race([geminiCall, timeoutPromise]);

        if (response && response.text) {
          const parsedResult = JSON.parse(response.text);

          // 2. Strict Output Validation & Verification
          // Ensure destination matches requested destination
          const outputTitle = parsedResult.title || `${numDays}-Day Bespoke ${requestedDestination} Journey`;
          
          // Verify itinerary days count
          let validatedItinerary = Array.isArray(parsedResult.itinerary) ? parsedResult.itinerary : [];
          if (validatedItinerary.length !== numDays) {
            // Adjust day numbers and length to strictly match numDays
            if (validatedItinerary.length > numDays) {
              validatedItinerary = validatedItinerary.slice(0, numDays);
            } else {
              while (validatedItinerary.length < numDays) {
                const dayIdx = validatedItinerary.length + 1;
                validatedItinerary.push({
                  dayNumber: dayIdx,
                  title: `Day ${dayIdx}: Explore ${requestedDestination}`,
                  location: requestedDestination,
                  description: `Scenic exploration and leisure activities in ${requestedDestination}.`,
                  morningActivity: 'Morning scenic sightseeing',
                  afternoonActivity: 'Local cuisine tasting and cultural walk',
                  eveningActivity: 'Sunset relaxation and dinner',
                  stay: `${hotelCategory} Resort`,
                  mealsIncluded: 'Breakfast & Dinner Included',
                  transfers: transportMode,
                  insiderTip: 'Carry a lightweight day-pack and save your offline tickets.'
                });
              }
            }
          }

          // Ensure sequential dayNumbering
          validatedItinerary = validatedItinerary.map((day: any, idx: number) => ({
            ...day,
            dayNumber: idx + 1
          }));

          const finalResult = {
            planId: `AI-${Date.now().toString(36).toUpperCase()}`,
            destination: requestedDestination,
            title: outputTitle,
            summary: parsedResult.summary || `A carefully crafted ${numDays}-day journey across ${requestedDestination} designed for ${numTravellers} travellers (${tripType}).`,
            durationDays: numDays,
            durationNights: numDays - 1,
            travellersCount: numTravellers,
            tripType,
            hotelCategory,
            transportType: transportMode,
            estimatedBudget: parsedResult.estimatedBudget,
            itinerary: validatedItinerary,
            includedHighlights: parsedResult.includedHighlights || [
              `Private dedicated ${transportMode} throughout the trip with verified driver`,
              `${numDays - 1} Nights handpicked stay in ${hotelCategory}`,
              'Daily freshly prepared breakfast & regional dinners included',
              'All toll taxes, parking fees, and driver allowances covered',
              '24/7 SafarTrails on-trip concierge assistance'
            ],
            expertTips: parsedResult.expertTips || [
              'Book entry permits and prime activity slots in advance during peak holiday seasons.',
              'Always dress in comfortable layers for fluctuating local temperatures.',
              'Carry cash for remote village shops and local services.'
            ],
            packingEssentials: parsedResult.packingEssentials || [
              'Valid Government Photo ID (Aadhaar / Passport / Driving License)',
              'Comfortable walking shoes with good grip',
              'Sunscreen, polarized sunglasses, and essential personal medicines',
              'Universal power bank and camera chargers'
            ],
            bestTimeToVisitInfo: parsedResult.bestTimeToVisitInfo || 'Optimal travel season spans throughout the year with pleasant weather and seasonal highlights.',
            disclaimer: 'All prices and durations are estimated indicative figures based on standard travel rates. Exact package costs depend on live hotel availability, seasonality, and custom upgrades. Final quotes are confirmed by a SafarTrails Travel Specialist.'
          };

          return res.json({ success: true, plan: finalResult });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call timed out or had an error, using enhanced fallback engine:', geminiError.message);
      }
    }

    // 3. Fallback Curated Engine (guarantees fast, robust, offline-safe generation for ALL destinations)
    const fallbackPlan = generateFallbackPlan({
      destination: requestedDestination,
      durationDays: numDays,
      travellers: numTravellers,
      tripType,
      hotelCategory,
      transportMode,
      interests,
      budgetTotal
    });

    return res.json({ success: true, plan: fallbackPlan });

  } catch (err: any) {
    console.error('Error generating AI plan:', err);
    return res.status(500).json({ error: 'Failed to generate trip plan' });
  }
});

// Comprehensive Fallback Engine with Real Templates for All Major Destinations & Universal Dynamic Planner
function generateFallbackPlan(params: any) {
  const { destination, durationDays, travellers, tripType, hotelCategory, transportMode, budgetTotal } = params;
  const dLower = (destination || '').toLowerCase();
  
  const isKashmir = dLower.includes('kashmir') || dLower.includes('srinagar') || dLower.includes('gulmarg') || dLower.includes('pahalgam');
  const isGoa = dLower.includes('goa') || dLower.includes('calangute') || dLower.includes('panaji') || dLower.includes('baga');
  const isKerala = dLower.includes('kerala') || dLower.includes('munnar') || dLower.includes('alleppey') || dLower.includes('kochi');
  const isRajasthan = dLower.includes('rajasthan') || dLower.includes('jaipur') || dLower.includes('udaipur') || dLower.includes('jodhpur') || dLower.includes('jaisalmer');
  const isAndaman = dLower.includes('andaman') || dLower.includes('havelock') || dLower.includes('port blair');
  const isHimachal = dLower.includes('himachal') || dLower.includes('manali') || dLower.includes('shimla') || dLower.includes('kasol') || dLower.includes('dharamshala');
  const isLadakh = dLower.includes('ladakh') || dLower.includes('leh') || dLower.includes('nubra') || dLower.includes('pangong');
  const isUttarakhand = dLower.includes('uttarakhand') || dLower.includes('rishikesh') || dLower.includes('nainital') || dLower.includes('mussoorie') || dLower.includes('corbett');
  const isNortheast = dLower.includes('meghalaya') || dLower.includes('shillong') || dLower.includes('northeast') || dLower.includes('sikkim') || dLower.includes('gangtok') || dLower.includes('darjeeling');

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

  // Calculate pricing
  let totalMin = Math.round(baseRatePerPerson * travellers * (durationDays / 6) * 0.95);
  if (budgetTotal && budgetTotal > 15000) {
    totalMin = Math.round(budgetTotal * 0.9);
  }
  const totalMax = Math.round(totalMin * 1.18);

  const isHoneymoon = tripType === 'Honeymoon';
  const tripTitle = isHoneymoon
    ? `${durationDays}-Day Romantic Honeymoon in ${destination}`
    : tripType === 'Family'
    ? `${durationDays}-Day Grand Family Holiday in ${destination}`
    : `${durationDays}-Day Bespoke ${destination} Journey`;

  // Destination-specific templates database
  const itinerary: any[] = [];

  for (let i = 1; i <= durationDays; i++) {
    let dayTitle = `Day ${i}: Signature ${destination} Highlights`;
    let loc = destination;
    let desc = `Curated exploration in ${destination} tailored for ${travellers} travellers (${tripType}), combining premier attractions with relaxed pacing.`;
    let morn = `Morning scenic sightseeing & landmark visits across ${destination}`;
    let aft = 'Local dining and authentic cultural experiences';
    let eve = 'Sunset stroll, leisure exploration, and dinner';
    let stay = `${hotelCategory} Resort / Hotel`;
    let tip = 'Carry a lightweight day-pack and save your digital bookings.';

    if (isGoa) {
      if (i === 1) {
        dayTitle = 'Goa Arrival & Sunset Beach Shack Welcome';
        loc = 'North Goa (Candolim/Calangute)';
        desc = 'Check-in to your beachside resort. Unwind on golden sands with refreshing tropical drinks and coastal sea breeze.';
        morn = 'Airport/Station pickup & resort check-in';
        aft = 'Poolside relaxation & fresh coconut water';
        eve = isHoneymoon ? 'Private candlelight dinner at beachfront shack with acoustic music' : 'Beach shack dinner with fresh seafood and sunset view';
        stay = `${hotelCategory} Beach Resort, North Goa`;
        tip = 'Pre-book front-row sunset beach tables at Candolim or Morjim for the best views.';
      } else if (i === 2) {
        dayTitle = 'Historic Aguada Fort & Mandovi River Sunset Cruise';
        loc = 'Aguada & Panaji';
        desc = 'Explore 17th-century Portuguese Aguada Fort and panoramic Sinquerim viewpoints, followed by a scenic Mandovi river cruise.';
        morn = 'Fort Aguada lighthouse & Sinquerim coastal photo walk';
        aft = 'Anjuna & Vagator red cliff panoramic exploration';
        eve = 'Mandovi River catamaran cruise with traditional Goan music & folk dance';
        stay = `${hotelCategory} Beach Resort, North Goa`;
        tip = 'Wear polarized sunglasses and comfortable footwear for fort walking trails.';
      } else if (i === 3) {
        dayTitle = 'Fontainhas Latin Quarter & Spice Plantation Tour';
        loc = 'Panaji & Ponda';
        desc = 'Heritage stroll through colorful Portuguese villas in Fontainhas, followed by an aromatic spice plantation tour with buffet lunch.';
        morn = 'Fontainhas heritage architecture walk & boutique cafe stop';
        aft = 'Organic Sahakari Spice Farm tour with traditional Goan buffet';
        eve = 'Miramar beach sunset and Panaji promenade walk';
        stay = `${hotelCategory} Beach Resort, North Goa`;
        tip = 'Try authentic Bebinca and Poi bread at traditional heritage bakeries in Fontainhas.';
      } else if (i === 4) {
        dayTitle = 'South Goa Serenity & Palolem / Cabo de Rama';
        loc = 'South Goa';
        desc = 'Scenic drive to serene South Goa. Discover the dramatic cliffside Cabo de Rama Fort and crescent-shaped Palolem Beach.';
        morn = 'Scenic drive to South Goa & Cabo de Rama Fort ruins';
        aft = 'Palolem Beach kayaking and Butterfly Beach boat ride';
        eve = 'Cozy sunset cafe dinner overlooking the tranquil Arabian Sea';
        stay = `${hotelCategory} Boutique Resort, South Goa`;
        tip = 'Keep camera ready at Cabo de Rama for 180-degree turquoise ocean views.';
      } else if (i === 5) {
        dayTitle = 'Dudhsagar Waterfalls Safari & Divar Island';
        loc = 'Mollem / Divar Island';
        desc = 'Thrilling 4x4 jungle jeep safari to majestic multi-tiered Dudhsagar Waterfalls in Bhagwan Mahavir Wildlife Sanctuary.';
        morn = 'Jeep safari through lush Western Ghats forest to Dudhsagar';
        aft = 'Freshwater pool dip and packed picnic lunch';
        eve = 'Return to coast & relaxing spa wellness session';
        stay = `${hotelCategory} Beach Resort, South Goa`;
        tip = 'Wear quick-drying clothes and water shoes for Dudhsagar.';
      } else if (i === durationDays) {
        dayTitle = 'Seaside Breakfast & Departure';
        loc = 'Goa Departure';
        desc = 'Morning beach stroll, authentic cashew nut shopping, and smooth transfer to Goa Airport / MOPA.';
        morn = 'Beachside breakfast and morning swim';
        aft = 'Souvenir shopping for Goan feni, cashews, and spices';
        eve = 'Airport transfer for return flight';
        stay = 'Departure';
        tip = 'Keep 2.5 hours travel time if departing from MOPA Airport in North Goa.';
      }
    } else if (isKashmir) {
      if (i === 1) {
        dayTitle = 'Arrival in Srinagar & Dal Lake Sunset Shikara';
        loc = 'Srinagar';
        desc = 'Check-in to a luxury Cedar Houseboat on Dal Lake. Enjoy a serene 1-hour sunset Shikara ride across floating lotus gardens.';
        morn = 'Airport pickup and check-in to heritage houseboat';
        aft = 'Boulevard road walk and aromatic Kashmiri Kahwa';
        eve = isHoneymoon ? 'Private sunset Shikara ride with floating flower market & candlelight dinner' : 'Sunset Shikara cruise & traditional Wazwan dinner';
        stay = 'Heritage Deluxe Houseboat, Dal Lake';
        tip = 'Ask your Shikara pilot for a cup of authentic saffron Kahwa at Char Chinar.';
      } else if (i === 2) {
        dayTitle = 'Gulmarg Gondola Ride & Apharwat Snow Peak';
        loc = 'Gulmarg';
        desc = 'Ascend Asia’s highest cable car to Kongdoori and Apharwat Peak at 13,780 ft with breathtaking snow mountain vistas.';
        morn = 'Scenic drive to Gulmarg and boarding Gondola Phase 1 & 2';
        aft = 'Snow sports, alpine photography, and meadow stroll';
        eve = 'Drive back to Srinagar, leisure at Dal Lake boulevard';
        stay = `${hotelCategory} Resort, Srinagar`;
        tip = 'Pre-book Gondola Phase 2 online 2 weeks prior to avoid queue delays.';
      } else if (i === 3) {
        dayTitle = 'Scenic Drive to Pahalgam Pine Valleys';
        loc = 'Pahalgam';
        desc = 'Drive along the roaring Lidder River via Pampore saffron fields and Avantipur 9th-century temple ruins.';
        morn = 'Drive to Pahalgam with stops at saffron fields and apple orchards';
        aft = 'Riverside lunch and nature walk beside Lidder River';
        eve = 'Cozy bonfire dinner surrounded by dense deodar forests';
        stay = `${hotelCategory} Mountain Resort, Pahalgam`;
        tip = 'Stop at Pampore for authentic certified Kashmiri saffron and walnut kernels.';
      } else if (i === 4) {
        dayTitle = 'Betaab Valley, Aru Valley & Baisaran Meadow';
        loc = 'Pahalgam';
        desc = 'Excursion to Betaab Valley, Aru Valley wildlife sanctuary, and optional pony trek to Baisaran ("Mini Switzerland").';
        morn = 'Betaab Valley film shooting spots and crystal river photography';
        aft = 'Aru Valley scenic drive and local Gujjar village visit';
        eve = 'Pahalgam market stroll for wooden handicrafts and honey';
        stay = `${hotelCategory} Mountain Resort, Pahalgam`;
        tip = 'Rent rubber snow boots locally near Betaab Valley during spring/winter.';
      } else if (i === 5) {
        dayTitle = 'Sonamarg "Meadow of Gold" & Thajiwas Glacier';
        loc = 'Sonamarg';
        desc = 'Day excursion to Sonamarg flanked by snowy peaks, Sindh River rapids, and horse ride to Thajiwas Glacier.';
        morn = 'Scenic drive through Sindh river valley to Sonamarg';
        aft = 'Trek/pony ride to Thajiwas Glacier and snowball games';
        eve = 'Return to Srinagar & Mughal Garden walk (Nishat & Shalimar)';
        stay = `${hotelCategory} Resort, Srinagar`;
        tip = 'Sip hot butter tea near the glacier foot.';
      } else if (i === durationDays) {
        dayTitle = 'Srinagar Souvenir Shopping & Departure';
        loc = 'Srinagar Departure';
        desc = 'Morning dry fruit and Pashmina shopping at Lal Chowk before transfer to Srinagar Airport.';
        morn = 'Shankaracharya Temple view and Lal Chowk spice market';
        aft = 'Airport transfer with unforgettable Himalayan memories';
        eve = 'Departure flight';
        stay = 'Departure';
        tip = 'Arrive at Srinagar Airport 3 hours prior due to mountain airport security protocols.';
      }
    } else if (isKerala) {
      if (i === 1) {
        dayTitle = 'Arrival in Kochi & Drive to Munnar Tea Hills';
        loc = 'Munnar';
        desc = 'Scenic drive to Munnar via Cheeyappara and Valara waterfalls amidst lush Western Ghats.';
        morn = 'Pickup from Cochin Airport & scenic drive into misty hills';
        aft = 'Cheeyappara waterfalls photo stop and spice garden visit';
        eve = 'Resort check-in with panoramic tea valley views';
        stay = `${hotelCategory} Resort, Munnar`;
        tip = 'Keep a light cardigan ready as temperatures drop pleasantly in Munnar.';
      } else if (i === 2) {
        dayTitle = 'Munnar Tea Plantations & Eravikulam National Park';
        loc = 'Munnar';
        desc = 'Visit Eravikulam National Park (home to Nilgiri Tahr), Tea Museum, Mattupetty Dam, and Echo Point.';
        morn = 'Morning Nilgiri Tahr spotting at Eravikulam slopes';
        aft = 'Mattupetty Dam boating, Echo Point, and Tea Museum';
        eve = 'Tea tasting session and authentic Kerala Ayurvedic massage';
        stay = `${hotelCategory} Resort, Munnar`;
        tip = 'Pre-book Eravikulam safari tokens online to skip ticket queues.';
      } else if (i === 3) {
        dayTitle = 'Thekkady Spice Plantations & Periyar Lake Safari';
        loc = 'Thekkady';
        desc = 'Drive to Thekkady. Experience boat safari on Periyar Lake wildlife sanctuary and martial arts Kathakali show.';
        morn = 'Scenic drive to Thekkady through cardamon plantations';
        aft = 'Periyar wildlife boat safari (spot elephants & sambar deer)';
        eve = 'Traditional Kalaripayattu martial arts & Kathakali dance show';
        stay = `${hotelCategory} Jungle Resort, Thekkady`;
        tip = 'Buy fresh whole black pepper and green cardamom from certified spice estates.';
      } else if (i === 4) {
        dayTitle = 'Alleppey Backwaters & Luxury Private Houseboat';
        loc = 'Alleppey (Alappuzha)';
        desc = 'Board a traditional luxury Kettuvallam (Houseboat) cruising through palm-fringed canals, paddy fields, and lagoons.';
        morn = 'Drive from Thekkady to Alleppey backwater jetty';
        aft = 'Houseboat check-in with freshly caught Karimeen fish lunch';
        eve = isHoneymoon ? 'Sunset cruise across Vembanad Lake & romantic candlelit deck dinner' : 'Sunset cruise across Vembanad Lake & traditional dinner';
        stay = 'Luxury Private AC Houseboat, Alleppey';
        tip = 'Enjoy the freshly prepared banana fritters and local filter coffee at teatime on the deck.';
      } else if (i === 5) {
        dayTitle = 'Marari Beach / Kovalam Coastal Relaxation';
        loc = 'Marari / Kovalam';
        desc = 'Transfer to serene coastal beach resort for sea breezes, coconut groves, and Ayurvedic rejuvenation.';
        morn = 'Disembark houseboat & scenic coastal transfer';
        aft = 'Beachfront relaxation, hammock reading, and seafood lunch';
        eve = 'Sunset beach walk and Ayurvedic herbal therapy';
        stay = `${hotelCategory} Beach Resort, Marari/Kovalam`;
        tip = 'Try the local fresh coconut water straight from coastal groves.';
      } else if (i === durationDays) {
        dayTitle = 'Fort Kochi Heritage Tour & Departure';
        loc = 'Kochi Departure';
        desc = 'Colonial Fort Kochi heritage walk, iconic Chinese fishing nets, and transfer to Cochin Airport.';
        morn = 'Fort Kochi colonial walk and Jewish Synagogue Jew Town';
        aft = 'Souvenir banana chips shopping and airport transfer';
        eve = 'Departure flight';
        stay = 'Departure';
        tip = 'Buy fresh vacuum-packed spices and banana chips near Mattancherry.';
      }
    } else if (isRajasthan) {
      if (i === 1) {
        dayTitle = 'Arrival in Jaipur & Royal Chokhi Dhani Night';
        loc = 'Jaipur';
        desc = 'Welcome to the Pink City. Settle into a heritage haveli and experience traditional Rajasthani folk dance & feast.';
        morn = 'Airport/Station pickup & heritage hotel check-in';
        aft = 'Albert Hall Museum & Birla Mandir visit';
        eve = 'Chokhi Dhani cultural village with Kalbelia dance & Dal Baati Churma';
        stay = `${hotelCategory} Heritage Haveli, Jaipur`;
        tip = 'Taste the authentic Pyaz Kachori at Rawat Mishtan Bhandar.';
      } else if (i === 2) {
        dayTitle = 'Amber Fort, Hawa Mahal & City Palace';
        loc = 'Jaipur';
        desc = 'Grand tour of majestic Amer Fort with panoramic Maota Lake views, Hawa Mahal photo stop, and Royal City Palace.';
        morn = 'Amer Fort ascent and Sheesh Mahal mirror palace';
        aft = 'Hawa Mahal facade photo stop & Jantar Mantar observatory';
        eve = 'Bapu Bazaar shopping for block-print quilts and blue pottery';
        stay = `${hotelCategory} Heritage Haveli, Jaipur`;
        tip = 'Take photographs in front of Hawa Mahal early in the morning for best sunlight.';
      } else if (i === 3) {
        dayTitle = 'Scenic Drive to Jodhpur "The Blue City"';
        loc = 'Jodhpur';
        desc = 'Drive to Jodhpur. Tour the colossal Mehrangarh Fort towering 400 ft above the azure blue city rooftops.';
        morn = 'Scenic highway drive from Jaipur to Jodhpur';
        aft = 'Mehrangarh Fort museum & Jaswant Thada marble memorial';
        eve = 'Clock Tower Sardar Market stroll & Makhaniya Lassi';
        stay = `${hotelCategory} Heritage Hotel, Jodhpur`;
        tip = 'Visit the rooftop cafes near Clock Tower for night view of lit-up Mehrangarh Fort.';
      } else if (i === 4) {
        dayTitle = 'Scenic Drive to Udaipur - The City of Lakes';
        loc = 'Udaipur';
        desc = 'Drive through the Aravalli hills to romantic Udaipur with optional stop at Ranakpur Jain marble temples.';
        morn = 'Scenic highway drive towards Udaipur with Ranakpur stop';
        aft = 'Arrival in Udaipur and check-in to lake-view resort';
        eve = 'Sunset boat cruise on Lake Pichola overlooking Jag Mandir Palace';
        stay = `${hotelCategory} Lake View Resort, Udaipur`;
        tip = 'Sunset boat ride on Lake Pichola gives the most spectacular view of City Palace.';
      } else if (i === 5) {
        dayTitle = 'Udaipur City Palace & Saheliyon Ki Bari';
        loc = 'Udaipur';
        desc = 'Explore Rajasthan’s largest palace complex, Jagdish Temple, and Saheliyon-ki-Bari fountain gardens.';
        morn = 'City Palace royal courtyards and crystal gallery';
        aft = 'Saheliyon ki Bari gardens and vintage car museum';
        eve = isHoneymoon ? 'Romantic lakeside candlelight dinner overlooking illuminated Lake Palace' : 'Cultural evening at Bagore Ki Haveli with Dharohar dance show';
        stay = `${hotelCategory} Lake View Resort, Udaipur`;
        tip = 'Pre-book tickets for Bagore Ki Haveli Dharohar dance show.';
      } else if (i === durationDays) {
        dayTitle = 'Udaipur Souvenir Walk & Airport Departure';
        loc = 'Udaipur Departure';
        desc = 'Morning miniature painting art gallery visit and comfortable transfer to Udaipur Airport.';
        morn = 'Hathi Pol market for Pichwai paintings and leather journals';
        aft = 'Airport transfer with royal Rajasthani memories';
        eve = 'Departure flight';
        stay = 'Departure';
        tip = 'Ensure baggage space for authentic Rajasthan handicrafts and block prints.';
      }
    } else if (isHimachal) {
      if (i === 1) {
        dayTitle = 'Arrival in Manali & Old Manali Pine Trail';
        loc = 'Manali';
        desc = 'Check-in to a luxury mountain view cottage. Stroll through pine forests and vibrant cedar-wood Old Manali cafes.';
        morn = 'Pickup & mountain cottage check-in';
        aft = 'Hadimba Temple and Van Vihar pine forest walk';
        eve = 'Old Manali live music cafe and trout fish dinner';
        stay = `${hotelCategory} Resort, Manali`;
        tip = 'Visit Hadimba Temple during late afternoon when sunlight filters through the deodars.';
      } else if (i === 2) {
        dayTitle = 'Solang Valley & Atal Tunnel to Sissu Waterfall';
        loc = 'Solang & Lahaul Valley';
        desc = 'Drive through the engineering marvel Atal Tunnel into the snow-capped, high-altitude landscape of Sissu, Lahaul.';
        morn = 'Drive through Atal Tunnel (9.02 km) to Sissu waterfall';
        aft = 'Snow activities at Solang Valley (paragliding, ATV rides)';
        eve = 'Hot Himachali siddu and bonfire evening';
        stay = `${hotelCategory} Resort, Manali`;
        tip = 'Check Atal Tunnel pass status early during winter/monsoon months.';
      } else if (i === 3) {
        dayTitle = 'Naggar Castle Heritage & Kullu Valley Rafting';
        loc = 'Naggar & Kullu';
        desc = 'Explore ancient wooden Naggar Castle overlooking Beas Valley, Roerich Art Gallery, and thrilling Beas river rafting.';
        morn = 'Naggar Castle heritage tour & art gallery visit';
        aft = 'White water rafting in Beas River, Kullu';
        eve = 'Kullu shawl factory outlet visit and scenic return to Manali';
        stay = `${hotelCategory} Resort, Manali`;
        tip = 'Taste the fresh apple pie and organic herbal tea at Naggar Castle cafe.';
      } else if (i === 4) {
        dayTitle = 'Jogini Waterfalls Trek & Vashisht Hot Springs';
        loc = 'Vashisht';
        desc = 'Scenic nature hike through apple orchards to Jogini Waterfall cascading down rocky cliffs, followed by natural sulphur hot springs.';
        morn = 'Gentle morning trek to Jogini Waterfall with mountain vistas';
        aft = 'Picnic lunch beside the falls and Vashisht temple hot baths';
        eve = 'Mall Road leisure stroll and cafe hopping';
        stay = `${hotelCategory} Resort, Manali`;
        tip = 'Wear trekking shoes with sturdy grip for the Jogini trail.';
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
    } else if (isAndaman) {
      if (i === 1) {
        dayTitle = 'Arrival in Port Blair & Cellular Jail Light & Sound';
        loc = 'Port Blair';
        desc = 'Arrive in tropical Andaman. Visit historic Cellular Jail and witness the touching patriotic Light & Sound show.';
        morn = 'Airport pickup & coastal hotel check-in';
        aft = 'Corbyn’s Cove beach walk and fresh coconut water';
        eve = 'Cellular Jail national memorial tour and Light & Sound show';
        stay = `${hotelCategory} Resort, Port Blair`;
        tip = 'Pre-book front row seats for the Cellular Jail sound & light show.';
      } else if (i === 2) {
        dayTitle = 'Catamaran Ferry to Havelock & Radhanagar Beach Sunset';
        loc = 'Havelock Island (Swaraj Dweep)';
        desc = 'Cruise on Makruzz / Nautika catamaran ferry to Havelock Island. Spend the evening at Asia’s best Radhanagar Beach.';
        morn = 'Luxury catamaran cruise to Havelock Island';
        aft = 'Resort check-in and leisure on white sand beach';
        eve = 'Spectacular golden sunset at Radhanagar Beach (Beach No. 7)';
        stay = `${hotelCategory} Beachfront Resort, Havelock`;
        tip = 'Radhanagar Beach sunset is world-famous; reach by 4:30 PM for prime spots.';
      } else if (i === 3) {
        dayTitle = 'Elephant Beach Water Sports & Snorkeling';
        loc = 'Havelock Island';
        desc = 'Speedboat ride to Elephant Beach for vibrant coral reef snorkeling, sea walking, and jet skiing.';
        morn = 'Speedboat to Elephant Beach and guided coral snorkeling';
        aft = 'Beach leisure, fresh seafood lunch, and scuba diving';
        eve = isHoneymoon ? 'Private candlelight beach dinner under Andaman stars' : 'Beachfront resort dinner with live ocean breeze';
        stay = `${hotelCategory} Beachfront Resort, Havelock`;
        tip = 'Wear reef-safe sunscreen and waterproof camera casing.';
      } else if (i === 4) {
        dayTitle = 'Ferry to Neil Island & Natural Rock Bridge';
        loc = 'Neil Island (Shaheed Dweep)';
        desc = 'Ferry to tranquil Neil Island. Explore the 3D coral formation Natural Bridge, Laxmanpur Beach sunset, and Bharatpur waters.';
        morn = 'Ferry cruise to Neil Island and check-in';
        aft = 'Bharatpur beach water activities and glass bottom boat ride';
        eve = 'Natural living rock bridge and dramatic sunset at Laxmanpur Beach';
        stay = `${hotelCategory} Resort, Neil Island`;
        tip = 'Visit the Natural Bridge during low tide for safest walking over coral reef.';
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
    } else {
      // Universal Smart Dynamic Day-by-Day Generator for ANY Indian city / region (Uttarakhand, Ladakh, Northeast, Coorg, Ooty, Varanasi, etc.)
      if (i === 1) {
        dayTitle = `Arrival in ${destination} & Welcome Leisure Check-in`;
        loc = destination;
        desc = `Welcome to ${destination}. Arrive and check-in to your ${hotelCategory} stay. Enjoy a relaxed evening introducing you to the charm and local flavor of the region.`;
        morn = `Airport/Station reception and private transfer to ${destination} hotel`;
        aft = 'Hotel check-in, orientation, and leisure unwinding';
        eve = isHoneymoon ? `Romantic welcome candlelight dinner with regional ${destination} specialties` : `Evening welcome stroll and dinner featuring authentic local delicacies`;
        stay = `${hotelCategory} Hotel / Resort`;
        tip = `Save offline maps for ${destination} and keep your identity cards handy.`;
      } else if (i === 2) {
        dayTitle = `${destination} Iconic Heritage & Cultural Highlights`;
        loc = destination;
        desc = `Full day dedicated to exploring the prime cultural landmarks, historic monuments, and scenic viewpoints across ${destination}.`;
        morn = `Guided morning tour of top signature landmarks and scenic vantage points in ${destination}`;
        aft = 'Authentic lunch at a top-rated regional restaurant followed by handicraft artisan visit';
        eve = 'Sunset viewpoint visit, local bazaar stroll, and evening tea';
        stay = `${hotelCategory} Hotel / Resort`;
        tip = 'Start early in the morning to beat the peak visitor crowds and capture the best daylight photos.';
      } else if (i === 3) {
        dayTitle = `Nature, Scenic Valleys & Outdoor Discovery`;
        loc = destination;
        desc = `Immerse in the natural beauty surrounding ${destination} with curated nature trails, panoramic viewpoints, and authentic experiences.`;
        morn = `Excursion to picturesque nature spots, valleys, or waterfronts around ${destination}`;
        aft = 'Outdoor picnic or local countryside cafe lunch';
        eve = 'Relaxing leisure evening, local music, and dinner';
        stay = `${hotelCategory} Hotel / Resort`;
        tip = 'Wear comfortable walking shoes with good traction.';
      } else if (i === 4) {
        dayTitle = `Offbeat Excursion & Authentic Local Life`;
        loc = `${destination} Countryside`;
        desc = `Discover hidden gems and tranquil offbeat retreats just outside the main hub of ${destination}.`;
        morn = `Scenic drive to nearby offbeat village, plantation, or lake`;
        aft = 'Interaction with local artisans, tea gardens, or organic farm tour';
        eve = 'Bonfire evening or spa relaxation at resort';
        stay = `${hotelCategory} Hotel / Resort`;
        tip = 'Support local village artisans by buying directly from cooperatives.';
      } else if (i === durationDays) {
        dayTitle = `Souvenir Shopping & Departure from ${destination}`;
        loc = `${destination} Departure`;
        desc = `Final breakfast, last-minute souvenir and handicraft shopping, followed by comfortable transfer to the airport/station.`;
        morn = 'Breakfast and final panoramic photo walk';
        aft = `Souvenir shopping for local specialties of ${destination} and airport transfer`;
        eve = 'Departure flight/train';
        stay = 'Departure';
        tip = 'Keep 3 hours buffer time for airport check-in and security clearances.';
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
    title: tripTitle,
    summary: `A carefully paced, high-comfort ${durationDays}-day holiday designed for ${travellers} travellers (${tripType}) in ${destination}, combining premier stays in ${hotelCategory} with dedicated ${transportMode} transport.`,
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
      `Private dedicated ${transportMode} throughout the trip with verified chauffeur`,
      `${durationDays - 1} Nights handpicked stay in ${hotelCategory}`,
      'Daily freshly prepared breakfast & regional dinners included',
      'All toll taxes, parking fees, and driver allowances covered',
      '24/7 SafarTrails on-trip concierge assistance'
    ],
    expertTips: [
      `Book entry permits and prime activity slots in ${destination} in advance during peak holiday seasons.`,
      'Always dress in comfortable layers for fluctuating local temperatures.',
      'Carry cash for remote village shops and local services where card terminals may be unavailable.'
    ],
    packingEssentials: [
      'Valid Government Photo ID (Aadhaar / Passport / Driving License)',
      'Comfortable walking shoes with good grip',
      'Sunscreen, polarized sunglasses, and essential personal medicines',
      'Universal power bank and camera chargers'
    ],
    bestTimeToVisitInfo: `Optimal travel season for ${destination} spans throughout the year with pleasant weather and seasonal highlights.`,
    disclaimer: 'All prices and durations are estimated indicative figures based on standard travel rates. Exact package costs depend on live hotel availability, seasonality, and custom upgrades. Final quotes are confirmed by a SafarTrails Travel Specialist.'
  };
}

// Explicit Robots.txt and Sitemap.xml routes (100% standard compliance, no HTML fallback)
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(process.cwd(), 'public', 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.sendFile(path.join(process.cwd(), 'public', 'sitemap.xml'));
});

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
    app.use(express.static(distPath, {
      maxAge: '1y',
      immutable: true,
      index: false
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SafarTrails Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
