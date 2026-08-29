// Shared AI Trip Planner orchestration: parses the request, tries Gemini (if an API
// key is configured), validates/pads its output, and falls back to the offline-safe
// template engine on any failure. Runs identically from server.ts (Express) and
// functions/api/ai-plan.ts (Cloudflare Pages Function) - same pattern as
// src/lib/email/sendQuoteEmail.ts.

import { parseTripPrompt } from '../../utils/promptParser';
import { generateGeminiPlan } from './generateGeminiPlan';
import { generateFallbackPlan } from './generateFallbackPlan';

export interface TripPlanRequestBody {
  userPrompt?: string;
  destination?: string;
  durationDays?: number;
  travellers?: number;
  tripType?: string;
  hotelCategory?: string;
  transportMode?: string;
  interests?: string[];
  budgetTotal?: number;
  startCity?: string;
}

export async function generateTripPlan(rawBody: TripPlanRequestBody, geminiApiKey?: string): Promise<any> {
  const userPrompt = rawBody.userPrompt || '';

  const parsed = parseTripPrompt(userPrompt, {
    destination: rawBody.destination,
    durationDays: rawBody.durationDays,
    travellers: rawBody.travellers,
    tripType: rawBody.tripType as any,
    hotelCategory: rawBody.hotelCategory as any,
    transportMode: rawBody.transportMode as any,
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

  if (geminiApiKey) {
    const parsedResult = await generateGeminiPlan({
      apiKey: geminiApiKey,
      requestedDestination,
      numDays,
      numTravellers,
      tripType,
      hotelCategory,
      transportMode,
      interests,
      budgetTotal,
      userPrompt
    });

    if (parsedResult) {
      const outputTitle = parsedResult.title || `${numDays}-Day Bespoke ${requestedDestination} Journey`;

      let validatedItinerary = Array.isArray(parsedResult.itinerary) ? parsedResult.itinerary : [];
      if (validatedItinerary.length !== numDays) {
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

      validatedItinerary = validatedItinerary.map((day: any, idx: number) => ({
        ...day,
        dayNumber: idx + 1
      }));

      return {
        success: true,
        plan: {
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
        }
      };
    }
  }

  // Fallback Curated Engine (guarantees fast, robust, offline-safe generation for ALL destinations)
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

  return { success: true, plan: fallbackPlan };
}
