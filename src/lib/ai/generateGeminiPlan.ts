// Calls the Gemini API directly via fetch (no @google/genai SDK) so this module runs
// identically from server.ts (Express/Node) and functions/api/ai-plan.ts (Cloudflare
// Pages Function / Workers runtime) - same pattern as src/lib/email/sendQuoteEmail.ts.

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    summary: { type: 'STRING' },
    includedHighlights: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    estimatedBudget: {
      type: 'OBJECT',
      properties: {
        min: { type: 'NUMBER' },
        max: { type: 'NUMBER' },
        perPerson: { type: 'NUMBER' },
        breakdown: {
          type: 'OBJECT',
          properties: {
            hotels: { type: 'NUMBER' },
            transport: { type: 'NUMBER' },
            sightseeingAndPermits: { type: 'NUMBER' },
            foodAndMisc: { type: 'NUMBER' }
          },
          required: ['hotels', 'transport', 'sightseeingAndPermits', 'foodAndMisc']
        }
      },
      required: ['min', 'max', 'perPerson', 'breakdown']
    },
    itinerary: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          dayNumber: { type: 'INTEGER' },
          title: { type: 'STRING' },
          location: { type: 'STRING' },
          description: { type: 'STRING' },
          morningActivity: { type: 'STRING' },
          afternoonActivity: { type: 'STRING' },
          eveningActivity: { type: 'STRING' },
          stay: { type: 'STRING' },
          mealsIncluded: { type: 'STRING' },
          transfers: { type: 'STRING' },
          insiderTip: { type: 'STRING' }
        },
        required: ['dayNumber', 'title', 'location', 'description']
      }
    },
    expertTips: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    packingEssentials: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    bestTimeToVisitInfo: { type: 'STRING' }
  },
  required: ['title', 'summary', 'includedHighlights', 'estimatedBudget', 'itinerary', 'expertTips', 'packingEssentials', 'bestTimeToVisitInfo']
};

export interface GeminiPlanParams {
  apiKey: string;
  requestedDestination: string;
  numDays: number;
  numTravellers: number;
  tripType: string;
  hotelCategory: string;
  transportMode: string;
  interests: string[];
  budgetTotal?: number;
  userPrompt?: string;
  timeoutMs?: number;
}

// Returns the parsed itinerary JSON, or null if the call failed/timed out/was
// malformed - callers should fall back to generateFallbackPlan in that case.
export async function generateGeminiPlan(params: GeminiPlanParams): Promise<any | null> {
  const {
    apiKey,
    requestedDestination,
    numDays,
    numTravellers,
    tripType,
    hotelCategory,
    transportMode,
    interests,
    budgetTotal,
    userPrompt,
    timeoutMs = 12000
  } = params;

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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'aistudio-build'
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: userPromptText }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA
          }
        }),
        signal: controller.signal
      }
    );

    if (!response.ok) {
      console.warn('[Gemini] Non-OK response:', response.status, await response.text().catch(() => ''));
      return null;
    }

    const data: any = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    return JSON.parse(text);
  } catch (error: any) {
    console.warn('[Gemini] Call failed or timed out, will use fallback engine:', error?.message);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
