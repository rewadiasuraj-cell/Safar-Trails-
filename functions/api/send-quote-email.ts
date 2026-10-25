// Cloudflare Pages Function: POST /api/send-quote-email
//
// Sends an email notification (via Resend) to info.safartrails@gmail.com whenever
// a "Get Your Custom Trip Quote" enquiry is submitted. Runs server-side.

import {
  sendQuoteEmail,
  sanitizeInput,
  EMAIL_REGEX,
  type QuoteLead,
} from '../../src/lib/email/sendQuoteEmail';
import { LEAD_NOTIFICATION_EMAIL } from '../../src/lib/seo/siteConfig';

interface Env {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}

const NOTIFY_TO = LEAD_NOTIFICATION_EMAIL;

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  if (!env.RESEND_API_KEY) {
    console.error('[send-quote-email] RESEND_API_KEY is not configured');
    return jsonResponse({ error: 'Email service is not configured' }, 500);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  // Honeypot check
  if (typeof payload.website_hp === 'string' && payload.website_hp.trim().length > 0) {
    return jsonResponse({ success: true }, 200);
  }

  const name = sanitizeInput(payload.name, 100);
  const phone = sanitizeInput(payload.phone, 30);
  const email = sanitizeInput(payload.email, 120);

  if (!name || !phone) {
    return jsonResponse({ error: 'Name and phone are required' }, 400);
  }

  if (email && !EMAIL_REGEX.test(email)) {
    return jsonResponse({ error: 'Invalid email address' }, 400);
  }

  const lead: QuoteLead = {
    leadId: sanitizeInput(payload.leadId, 50) || `ST-${Date.now().toString().slice(-6)}`,
    name,
    phone,
    email: email || undefined,
    destination: sanitizeInput(payload.destination, 100) || 'India Custom',
    travelDates: sanitizeInput(payload.travelDates, 100) || 'Flexible',
    travellers: sanitizeInput(payload.travellers, 100) || '2 Adults',
    budget: sanitizeInput(payload.budget, 100) || 'Standard',
    specialNotes: sanitizeInput(payload.specialNotes, 1000) || undefined,
    itinerarySummary: sanitizeInput(payload.itinerarySummary, 1000) || undefined,
    submittedAt: (payload.submittedAt as string) || new Date().toISOString(),
  };

  const result = await sendQuoteEmail({
    apiKey: env.RESEND_API_KEY,
    fromEmail: env.RESEND_FROM_EMAIL,
    toEmail: NOTIFY_TO,
    lead,
  });

  if (!result.ok) {
    console.error('[send-quote-email] Resend failure:', result.error);
    return jsonResponse({ error: 'Failed to send email notification' }, 502);
  }

  return jsonResponse({ success: true }, 200);
}
