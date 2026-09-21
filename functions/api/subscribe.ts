// Cloudflare Pages Function: POST /api/subscribe
//
// The footer's "get exclusive travel deals" box needs somewhere real to post.
// /api/quotes was the obvious candidate and is the wrong one: it rejects any
// submission without a name AND a phone number, and a subscriber has neither,
// so the box would either 400 on every attempt or have to invent a fake lead
// to get past the check - putting "Newsletter subscriber" rows into the same
// inbox the owner works their actual enquiries from.
//
// So this is its own route. It sends the address to the owner and nothing
// else. There is no list and no automation behind it; when a mailing list
// exists, this is the one function to point at it.

import { LEAD_NOTIFICATION_EMAIL } from '../../src/lib/seo/siteConfig';

interface Env {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}

const FROM = 'SafarTrails Enquiries <noreply@safartrails.co.in>';

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Deliberately loose - the aim is to catch a typo, not to police addresses. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const email = (body.email || '').trim();
  if (!EMAIL.test(email)) {
    return json({ error: 'Enter a valid email address' }, 400);
  }

  // No key configured is not the subscriber's problem: accept the address and
  // say so in the logs rather than showing them an error they cannot act on.
  if (!env.RESEND_API_KEY) {
    console.warn('[subscribe] RESEND_API_KEY missing; not delivered:', email);
    return json({ ok: true, delivered: false }, 200);
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL || FROM,
        to: [LEAD_NOTIFICATION_EMAIL],
        reply_to: email,
        subject: `Newsletter signup — ${email}`,
        text:
          `${email} asked to be added to the Safar Trails travel-deals list.\n\n` +
          `Reply to this message to reach them directly.`,
      }),
    });
    if (!res.ok) {
      console.error('[subscribe] Resend rejected:', res.status, await res.text());
      return json({ ok: true, delivered: false }, 200);
    }
  } catch (err) {
    console.error('[subscribe] send failed:', err);
    return json({ ok: true, delivered: false }, 200);
  }

  return json({ ok: true, delivered: true }, 200);
}
