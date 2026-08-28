// Cloudflare Pages Function: POST /api/send-quote-email
//
// Sends an email notification (via Resend) to the SafarTrails inbox whenever
// a "Get Your Custom Trip Quote" enquiry is submitted. This runs server-side
// so the Resend API key never reaches the browser.
//
// Configure RESEND_API_KEY (and optionally RESEND_FROM_EMAIL) as environment
// variables/secrets in the Cloudflare Pages project settings for production,
// or in a local .dev.vars file (see .dev.vars.example) for `wrangler pages dev`.
//
// The actual Resend call lives in src/lib/email/sendQuoteEmail.ts, shared with
// the equivalent code path in server.ts for hosts that aren't Cloudflare Pages.

import { sendQuoteEmail, type QuoteLead } from '../../src/lib/email/sendQuoteEmail';

interface Env {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}

const NOTIFY_TO = 'info.safartrails@gmail.com';

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  if (!env.RESEND_API_KEY) {
    console.error('send-quote-email: RESEND_API_KEY is not configured');
    return jsonResponse({ error: 'Email is not configured' }, 500);
  }

  let payload: Partial<QuoteLead>;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const name = (payload.name || '').trim();
  const phone = (payload.phone || '').trim();
  if (!name || !phone) {
    return jsonResponse({ error: 'name and phone are required' }, 400);
  }

  const result = await sendQuoteEmail({
    apiKey: env.RESEND_API_KEY,
    fromEmail: env.RESEND_FROM_EMAIL,
    toEmail: NOTIFY_TO,
    lead: { ...payload, leadId: payload.leadId || 'N/A', name, phone },
  });

  if (!result.ok) {
    console.error('send-quote-email:', result.error);
    return jsonResponse({ error: 'Failed to send email' }, 502);
  }

  return jsonResponse({ success: true }, 200);
}
