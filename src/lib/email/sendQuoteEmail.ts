// Shared Resend email logic for the "Get Your Custom Trip Quote" enquiry.
// Deliberately dependency-free and environment-agnostic (only uses `fetch`
// and string building) so the exact same code runs from both:
//   - functions/api/send-quote-email.ts (Cloudflare Pages Function / Workers runtime)
//   - server.ts (Node/Express) - for hosts that aren't Cloudflare Pages
// Callers are responsible for reading their own env vars and passing them in.

export interface QuoteLead {
  leadId: string;
  name: string;
  phone: string;
  email?: string;
  destination?: string;
  travelDates?: string;
  travellers?: string;
  budget?: string;
  specialNotes?: string;
  itinerarySummary?: string;
}

export interface SendQuoteEmailOptions {
  apiKey: string;
  toEmail: string;
  fromEmail?: string;
  lead: QuoteLead;
}

export interface SendQuoteEmailResult {
  ok: boolean;
  error?: string;
}

// Resend's shared sandbox sender - works immediately with no domain setup.
// Once you verify your own domain in Resend, pass fromEmail to send from it instead.
export const DEFAULT_FROM_EMAIL = 'SafarTrails Enquiries <onboarding@resend.dev>';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildQuoteEmailHtml(lead: QuoteLead): string {
  const rows: [string, string][] = [
    ['Enquiry Reference ID', lead.leadId],
    ['Name', lead.name],
    ['Phone / WhatsApp', lead.phone],
    ['Email', lead.email || '(not provided)'],
    ['Destination', lead.destination || 'India Custom'],
    ['Travel Month/Date', lead.travelDates || 'Flexible'],
    ['Travellers', lead.travellers || ''],
    ['Budget Preference', lead.budget || ''],
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

/** Sends the quote enquiry notification email via Resend. Never throws - check the returned result instead. */
export async function sendQuoteEmail(options: SendQuoteEmailOptions): Promise<SendQuoteEmailResult> {
  const { apiKey, toEmail, fromEmail, lead } = options;

  if (!apiKey) {
    return { ok: false, error: 'Resend API key is not configured' };
  }
  if (!lead.name?.trim() || !lead.phone?.trim()) {
    return { ok: false, error: 'name and phone are required' };
  }

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail || DEFAULT_FROM_EMAIL,
        to: [toEmail],
        reply_to: lead.email || undefined,
        subject: `New Trip Enquiry #${lead.leadId} — ${lead.destination || 'Custom Tour'}`,
        html: buildQuoteEmailHtml(lead),
      }),
    });

    if (!resendResponse.ok) {
      const errText = await resendResponse.text();
      return { ok: false, error: `Resend API error ${resendResponse.status}: ${errText}` };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
