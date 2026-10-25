// Cloudflare Pages Function: POST /api/quotes
//
// Handles lead submissions for Cloudflare Pages deployment.
// Validates, sanitizes, applies anti-spam / rate-limiting, and sends lead details
// to info.safartrails@gmail.com via Resend.

import {
  sendQuoteEmail,
  sanitizeInput,
  EMAIL_REGEX,
  SimpleRateLimiter,
  type QuoteLead,
} from '../../src/lib/email/sendQuoteEmail';
import { LEAD_NOTIFICATION_EMAIL } from '../../src/lib/seo/siteConfig';

interface Env {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}

const QUOTE_NOTIFY_EMAIL = LEAD_NOTIFICATION_EMAIL;

// 5 requests per 10 minutes per IP
const rateLimiter = new SimpleRateLimiter(5, 10 * 60 * 1000);

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
  website_hp?: string; // honeypot
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  // Rate Limiting by IP
  const clientIp =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for') ||
    '127.0.0.1';

  if (rateLimiter.isRateLimited(clientIp)) {
    return jsonResponse(
      {
        error:
          'Too many enquiries received from this connection. Please wait a few minutes or contact us directly on WhatsApp.',
      },
      429
    );
  }

  let body: QuoteRequestBody;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON request format.' }, 400);
  }

  // Honeypot spam check: if filled, quietly succeed without emailing or processing
  if (body.website_hp && body.website_hp.trim().length > 0) {
    return jsonResponse(
      {
        success: true,
        leadId: `ST-${Date.now().toString().slice(-6)}`,
        message: 'Enquiry received.',
      },
      200
    );
  }

  // Validation & Sanitization
  const name = sanitizeInput(body.name, 100);
  const phone = sanitizeInput(body.phone, 30);
  const email = sanitizeInput(body.email, 120);

  if (!name || name.length < 2) {
    return jsonResponse({ error: 'Please enter a valid full name (minimum 2 characters).' }, 400);
  }

  // Basic phone validation: digits, +, -, spaces, parentheses, minimum 8 characters
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  if (!cleanPhone || cleanPhone.length < 8) {
    return jsonResponse(
      { error: 'Please enter a valid phone or WhatsApp number (minimum 8 digits).' },
      400
    );
  }

  // If email is provided, validate format
  if (email && !EMAIL_REGEX.test(email)) {
    return jsonResponse({ error: 'Please enter a valid email address.' }, 400);
  }

  const destination = sanitizeInput(body.destination, 100) || 'India Custom';
  const travelDates = sanitizeInput(body.travelDates, 100) || 'Flexible';
  const travellers = sanitizeInput(body.travellers, 100) || '2 Adults';
  const budget = sanitizeInput(body.budget, 100) || 'Standard';
  const specialNotes = sanitizeInput(body.specialNotes, 1000);
  const itinerarySummary = sanitizeInput(body.itinerarySummary, 1000);
  const submittedAt = new Date().toISOString();

  const lead: QuoteLead = {
    leadId: `ST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name,
    phone,
    email: email || undefined,
    destination,
    travelDates,
    travellers,
    budget,
    specialNotes: specialNotes || undefined,
    itinerarySummary: itinerarySummary || undefined,
    submittedAt,
  };

  const encodedMsg = encodeURIComponent(
    `Hi SafarTrails Expert! I just submitted an enquiry (#${lead.leadId}) for ${lead.destination}.\n` +
      `Dates: ${lead.travelDates} | Travellers: ${lead.travellers}\n` +
      `Name: ${lead.name} (${lead.phone})\n` +
      `Please provide the final verified quote & hotel options.`
  );
  const whatsappUrl = `https://wa.me/918076665782?text=${encodedMsg}`;

  // Email Delivery via Resend
  let emailDelivered = false;
  if (env.RESEND_API_KEY) {
    const emailResult = await sendQuoteEmail({
      apiKey: env.RESEND_API_KEY,
      fromEmail: env.RESEND_FROM_EMAIL,
      toEmail: QUOTE_NOTIFY_EMAIL,
      lead,
    });

    if (emailResult.ok) {
      emailDelivered = true;
    } else {
      console.error('[SafarTrails Quote Email] Delivery failed:', emailResult.error);
    }
  } else {
    console.warn(
      '[SafarTrails Quote Email] RESEND_API_KEY is not set in Cloudflare Pages environment variables.'
    );
  }

  return jsonResponse(
    {
      success: true,
      leadId: lead.leadId,
      whatsappUrl,
      emailDelivered,
      message: 'Your enquiry has been received and routed to a Senior Destination Specialist.',
    },
    200
  );
}
