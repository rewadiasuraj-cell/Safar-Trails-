// Cloudflare Pages Function: POST /api/quotes
//
// Mirrors server.ts's Express /api/quotes handler for hosts that serve this
// app via Cloudflare Pages (no Node/Express process running there - only
// static assets + these Functions). Without this file, Cloudflare Pages has
// no route to match POST /api/quotes at all, and returns a bare 405 - the
// enquiry form never reaches a real backend, so no lead is recorded and the
// success screen/WhatsApp link only appear via the client's offline-fallback
// path. Keep this in sync with server.ts's /api/quotes if that ever changes.

import { sendQuoteEmail } from '../../src/lib/email/sendQuoteEmail';

interface Env {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}

const QUOTE_NOTIFY_EMAIL = 'info.safartrails@gmail.com';

interface QuoteRequestBody {
  name?: string;
  phone?: string;
  email?: string;
  destination?: string;
  travelDates?: string;
  travellers?: string;
  budget?: string;
  itinerarySummary?: string;
  specialNotes?: string;
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  let body: QuoteRequestBody;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const name = (body.name || '').trim();
  const phone = (body.phone || '').trim();
  if (!name || !phone) {
    return jsonResponse({ error: 'Name and Phone number are required' }, 400);
  }

  const lead = {
    id: `ST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name,
    phone,
    email: body.email || '',
    destination: body.destination || 'India Custom',
    travelDates: body.travelDates || 'Flexible',
    travellers: body.travellers || '2 Adults',
    budget: body.budget || 'Standard',
    itinerarySummary: body.itinerarySummary || '',
    specialNotes: body.specialNotes || '',
  };

  const encodedMsg = encodeURIComponent(
    `Hi SafarTrails Expert! I just submitted an enquiry (#${lead.id}) for ${lead.destination}.\n` +
      `Dates: ${lead.travelDates} | Travellers: ${lead.travellers}\n` +
      `Name: ${lead.name} (${lead.phone})\n` +
      `Please provide the final verified quote & hotel options.`
  );
  const whatsappUrl = `https://wa.me/918076665782?text=${encodedMsg}`;

  // Fire-and-forget: never awaited, and a failure here must never affect the
  // response below - the enquiry itself and the WhatsApp link already succeeded.
  if (env.RESEND_API_KEY) {
    sendQuoteEmail({
      apiKey: env.RESEND_API_KEY,
      fromEmail: env.RESEND_FROM_EMAIL,
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

  return jsonResponse(
    {
      success: true,
      leadId: lead.id,
      whatsappUrl,
      message: 'Your enquiry has been assigned to a Senior SafarTrails Destination Specialist.',
    },
    200
  );
}
