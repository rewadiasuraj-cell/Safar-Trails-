// Shared Resend email logic for the "Get Your Custom Trip Quote" enquiry.
// Deliberately dependency-free and environment-agnostic (only uses `fetch`
// and string building) so the exact same code runs from both:
//   - functions/api/send-quote-email.ts (Cloudflare Pages Function / Workers runtime)
//   - functions/api/quotes.ts (Cloudflare Pages Function)
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
  submittedAt?: string;
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

// Email format validation (RFC 5322 standard check)
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// safartrails.co.in is verified in Resend. Override via fromEmail/RESEND_FROM_EMAIL if needed.
export const DEFAULT_FROM_EMAIL = 'SafarTrails Enquiries <noreply@safartrails.co.in>';

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function sanitizeInput(val: unknown, maxLength = 500): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .trim()
    .slice(0, maxLength);
}

/** Formats a timestamp into IST and UTC strings. */
export function formatSubmissionDate(dateInput?: string | Date): { ist: string; utc: string } {
  const date = dateInput ? new Date(dateInput) : new Date();
  const validDate = isNaN(date.getTime()) ? new Date() : date;

  try {
    const istFormatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return {
      ist: `${istFormatter.format(validDate)} (IST)`,
      utc: validDate.toISOString(),
    };
  } catch {
    return {
      ist: validDate.toLocaleString(),
      utc: validDate.toISOString(),
    };
  }
}

/** Builds a clean, mobile-responsive HTML email for lead notifications. */
export function buildQuoteEmailHtml(lead: QuoteLead): string {
  const { ist } = formatSubmissionDate(lead.submittedAt);

  const rows: [string, string][] = [
    ['Enquiry Reference ID', `#${lead.leadId}`],
    ['Submission Date & Time', ist],
    ['Full Name', lead.name],
    ['Phone / WhatsApp', lead.phone],
    ['Email', lead.email || '(not provided)'],
    ['Destination', lead.destination || 'India Custom'],
    ['Travel Dates / Month', lead.travelDates || 'Flexible'],
    ['Number of Travellers', lead.travellers || '2 Adults'],
    ['Budget Preference', lead.budget || 'Standard'],
    ['Special Requests / Notes', lead.specialNotes || '(none)'],
  ];

  if (lead.itinerarySummary) {
    rows.push(['Itinerary Context', lead.itinerarySummary]);
  }

  const rowsHtml = rows
    .map(
      ([label, value], idx) => `
        <tr style="background-color:${idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'};">
          <td style="padding:10px 14px;border-bottom:1px solid #E2E8F0;font-weight:600;color:#334155;font-size:13px;width:38%;vertical-align:top;">
            ${escapeHtml(label)}
          </td>
          <td style="padding:10px 14px;border-bottom:1px solid #E2E8F0;color:#0F172A;font-size:14px;line-height:1.5;vertical-align:top;">
            ${
              label === 'Phone / WhatsApp'
                ? `<a href="tel:${escapeHtml(value.replace(/[^0-9+]/g, ''))}" style="color:#0284C7;text-decoration:none;font-weight:bold;">${escapeHtml(value)}</a>`
                : label === 'Email' && value !== '(not provided)'
                ? `<a href="mailto:${escapeHtml(value)}" style="color:#0284C7;text-decoration:none;">${escapeHtml(value)}</a>`
                : escapeHtml(value).replace(/\n/g, '<br/>')
            }
          </td>
        </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Website Lead - Safari Trails</title>
</head>
<body style="margin:0;padding:24px 12px;background-color:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:620px;margin:0 auto;background-color:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(15,23,42,0.08);border:1px solid #E2E8F0;">
    
    <!-- Header Bar -->
    <div style="background-color:#0F172A;padding:24px;border-bottom:3px solid #D97706;text-align:left;">
      <div style="font-size:11px;font-weight:bold;letter-spacing:2px;color:#D97706;text-transform:uppercase;margin-bottom:4px;">
        SAFAR TRAILS &bull; NEW ENQUIRY
      </div>
      <h1 style="margin:0;font-size:22px;color:#FFFFFF;font-weight:700;">
        New Website Lead — ${escapeHtml(lead.destination || 'Custom Tour')}
      </h1>
      <p style="margin:6px 0 0;font-size:13px;color:#94A3B8;">
        Received on ${escapeHtml(ist)} &bull; Reference #${escapeHtml(lead.leadId)}
      </p>
    </div>

    <!-- Quick Action Banner -->
    <div style="background-color:#ECFDF5;border-bottom:1px solid #A7F3D0;padding:12px 20px;font-size:13px;color:#065F46;display:flex;align-items:center;">
      <strong>Action Required:</strong>&nbsp;Please contact the customer on WhatsApp or phone to share verified quotes.
    </div>

    <!-- Details Table -->
    <div style="padding:20px;">
      <table style="width:100%;border-collapse:collapse;border:1px solid #E2E8F0;border-radius:8px;overflow:hidden;">
        ${rowsHtml}
      </table>
    </div>

    <!-- Footer -->
    <div style="background-color:#F8FAFC;padding:16px 20px;border-top:1px solid #E2E8F0;font-size:12px;color:#64748B;text-align:center;line-height:1.5;">
      This email was sent automatically by the Safar Trails website enquiry system.<br/>
      Destination Coordinator Inbox: <a href="mailto:info.safartrails@gmail.com" style="color:#0284C7;text-decoration:none;">info.safartrails@gmail.com</a>
    </div>

  </div>
</body>
</html>
  `.trim();
}

/** Builds plain text version for email clients that do not render HTML. */
export function buildQuoteEmailText(lead: QuoteLead): string {
  const { ist } = formatSubmissionDate(lead.submittedAt);
  return `
========================================
NEW WEBSITE LEAD - SAFARI TRAILS
========================================
Reference ID: #${lead.leadId}
Submission Time: ${ist}

Customer Name: ${lead.name}
Phone / WhatsApp: ${lead.phone}
Email: ${lead.email || '(not provided)'}
Destination: ${lead.destination || 'India Custom'}
Travel Dates: ${lead.travelDates || 'Flexible'}
Travellers: ${lead.travellers || '2 Adults'}
Budget Preference: ${lead.budget || 'Standard'}
Special Notes: ${lead.specialNotes || '(none)'}
${lead.itinerarySummary ? `Itinerary Context: ${lead.itinerarySummary}\n` : ''}
========================================
Please reach out to the lead promptly.
`.trim();
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

  // Validate reply-to: only use visitor email as reply_to if valid format
  const validEmail = lead.email && EMAIL_REGEX.test(lead.email.trim()) ? lead.email.trim() : undefined;

  // Clear, descriptive subject line
  const subject = `New Website Lead - Safari Trails: ${lead.name} (${lead.destination || 'Custom Tour'}) [Ref #${lead.leadId}]`;

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail || DEFAULT_FROM_EMAIL,
        to: [toEmail],
        reply_to: validEmail,
        subject,
        html: buildQuoteEmailHtml(lead),
        text: buildQuoteEmailText(lead),
      }),
    });

    if (!resendResponse.ok) {
      const errText = await resendResponse.text();
      return { ok: false, error: `Resend API error (${resendResponse.status}): ${errText}` };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/** Lightweight in-memory rate limiter per IP address. */
export class SimpleRateLimiter {
  private cache = new Map<string, { count: number; resetAt: number }>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 5, windowMs = 600000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = this.cache.get(ip);

    if (!record || now > record.resetAt) {
      this.cache.set(ip, { count: 1, resetAt: now + this.windowMs });
      return false;
    }

    if (record.count >= this.maxRequests) {
      return true;
    }

    record.count += 1;
    return false;
  }
}
