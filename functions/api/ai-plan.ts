// Cloudflare Pages Function: POST /api/ai-plan
//
// Mirrors server.ts's Express /api/ai-plan handler for hosts that serve this
// app via Cloudflare Pages (no Node/Express process running there - only
// static assets + these Functions). Without this file, Cloudflare Pages has
// no route to match POST /api/ai-plan at all, and returns a bare 405 - every
// "Build My Custom Itinerary" click in the AI Trip Planner fails.
//
// The actual generation logic lives in src/lib/ai/generateTripPlan.ts, shared
// with the equivalent code path in server.ts for hosts that aren't Cloudflare
// Pages. Configure GEMINI_API_KEY as an environment variable/secret in the
// Cloudflare Pages project settings for production (optional - falls back to
// the offline-safe template engine when unset).

import { generateTripPlan, type TripPlanRequestBody } from '../../src/lib/ai/generateTripPlan';

interface Env {
  GEMINI_API_KEY?: string;
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  let body: TripPlanRequestBody;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  try {
    const result = await generateTripPlan(body || {}, env.GEMINI_API_KEY);
    return jsonResponse(result, 200);
  } catch (error) {
    console.error('Error generating AI plan:', error);
    return jsonResponse({ error: 'Failed to generate trip plan' }, 500);
  }
}
