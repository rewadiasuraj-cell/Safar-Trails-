// Cloudflare Pages Function: POST /api/send-quote-email
//
// Sends an email notification (via Resend) to the SafarTrails inbox whenever
// a "Get Your Custom Trip Quote" enquiry is submitted. This runs server-side
// so the Resend API key never reaches the browser.
//
// Configure RESEND_API_KEY (and optionally RESEND_FROM_EMAIL) as environment
// variables/secrets in the Cloudflare Pages project settings for production,
// or in a local .dev.vars file (see .dev.vars.example) for `wrangler pages dev`.

interface Env {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}

interface QuoteEmailPayload {
  leadId?: string;
  name?: string;
  phone?: string;
  email?: string;
  destination?: string;
  travelDates?: string;
  travellers?: string;
  budget?: string;
  specialNotes?: string;
  itinerarySummary?: string;
}

const NOTIFY_TO = 'info.safartrails@gmail.com';
// Resend's shared sandbox sender - works immediately with no domain setup.
// Once you verify your own domain in Resend, set RESEND_FROM_EMAIL to send from it instead.
const DEFAULT_FROM = 'SafarTrails Enquiries <onboarding@resend.dev>';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildEmailHtml(lead: Required<Omit<QuoteEmailPayload, 'itinerarySummary'>> & { itinerarySummary: string }): string {
  const rows: [string, string][] = [
    ['Enquiry Reference ID', lead.leadId],
    ['Name', lead.name],
    ['Phone / WhatsApp', lead.phone],
    ['Email', lead.email || '(not provided)'],
    ['Destination', lead.destination],
    ['Travel Month/Date', lead.travelDates || 'Flexible'],
    ['Travellers', lead.travellers],
    ['Budget Preference', lead.budget],
    ['Special Notes', lead.specialNotes || '(none)'],
  ];
  if (lead.itinerarySummary) {
    rows.push(['Itinerary Context', lead.itinerarySummary]);
  }

  const rowsHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:bold;color:#555;white-space:nowrap;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#111;">${escapeHtml(value).replace(/\n/g, '<br/>')}</td>
        </tr>`
    )
    .join('');

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#111;margin-bottom:4px;">New Trip Quote Enquiry</h2>
      <p style="color:#666;margin-top:0;">Reference #${escapeHtml(lead.leadId)}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">${rowsHtml}</table>
      <p style="margin-top:20px;font-size:12px;color:#999;">Sent automatically by the SafarTrails website when this enquiry was submitted.</p>
    </div>
  `;
}

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

  let payload: QuoteEmailPayload;
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

  const lead = {
    leadId: payload.leadId || 'N/A',
    name,
    phone,
    email: (payload.email || '').trim(),
    destination: payload.destination || 'India Custom',
    travelDates: payload.travelDates || 'Flexible',
    travellers: payload.travellers || '',
    budget: payload.budget || '',
    specialNotes: payload.specialNotes || '',
    itinerarySummary: payload.itinerarySummary || '',
  };

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL || DEFAULT_FROM,
        to: [NOTIFY_TO],
        reply_to: lead.email || undefined,
        subject: `New Trip Enquiry #${lead.leadId} — ${lead.destination}`,
        html: buildEmailHtml(lead),
      }),
    });

    if (!resendResponse.ok) {
      const errText = await resendResponse.text();
      console.error('send-quote-email: Resend API error', resendResponse.status, errText);
      return jsonResponse({ error: 'Failed to send email' }, 502);
    }

    return jsonResponse({ success: true }, 200);
  } catch (err) {
    console.error('send-quote-email: unexpected error', err);
    return jsonResponse({ error: 'Failed to send email' }, 500);
  }
}
