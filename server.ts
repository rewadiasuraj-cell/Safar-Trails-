import express from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import compression from 'compression';
import {
  sendQuoteEmail,
  sanitizeInput,
  EMAIL_REGEX,
  SimpleRateLimiter,
  type QuoteLead,
} from './src/lib/email/sendQuoteEmail';
import { generateTripPlan } from './src/lib/ai/generateTripPlan';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.use(compression());
app.use(express.json());

// In-memory leads storage for demo & export
const submittedLeads: any[] = [];

import { LEAD_NOTIFICATION_EMAIL } from './src/lib/seo/siteConfig';

const QUOTE_NOTIFY_EMAIL = LEAD_NOTIFICATION_EMAIL;

// Rate limiter: 5 submissions per 10 minutes per IP
const quotesRateLimiter = new SimpleRateLimiter(5, 10 * 60 * 1000);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'SafarTrails', timestamp: new Date().toISOString() });
});

// Lead Submission / Quote Request endpoint
app.post('/api/quotes', async (req, res) => {
  try {
    const clientIp = (req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') as string;

    if (quotesRateLimiter.isRateLimited(clientIp)) {
      return res.status(429).json({
        error: 'Too many enquiries from this network. Please wait a few minutes or contact us on WhatsApp.',
      });
    }

    const {
      name: rawName,
      phone: rawPhone,
      email: rawEmail,
      destination: rawDest,
      travelDates: rawDates,
      travellers: rawTravellers,
      budget: rawBudget,
      itinerarySummary: rawSummary,
      specialNotes: rawNotes,
      website_hp: honeypot,
    } = req.body || {};

    // Honeypot bot protection
    if (honeypot && String(honeypot).trim().length > 0) {
      return res.json({
        success: true,
        leadId: `ST-${Date.now().toString().slice(-6)}`,
        message: 'Enquiry received.',
      });
    }

    const name = sanitizeInput(rawName, 100);
    const phone = sanitizeInput(rawPhone, 30);
    const email = sanitizeInput(rawEmail, 120);

    if (!name || name.length < 2) {
      return res.status(400).json({ error: 'Please provide your full name (minimum 2 characters).' });
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      return res.status(400).json({ error: 'Please provide a valid phone or WhatsApp number (minimum 8 digits).' });
    }

    if (email && !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const destination = sanitizeInput(rawDest, 100) || 'India Custom';
    const travelDates = sanitizeInput(rawDates, 100) || 'Flexible';
    const travellers = sanitizeInput(rawTravellers, 100) || '2 Adults';
    const budget = sanitizeInput(rawBudget, 100) || 'Standard';
    const itinerarySummary = sanitizeInput(rawSummary, 1000);
    const specialNotes = sanitizeInput(rawNotes, 1000);
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
      itinerarySummary: itinerarySummary || undefined,
      specialNotes: specialNotes || undefined,
      submittedAt,
    };

    submittedLeads.unshift(lead);
    console.log(`[SafarTrails Lead Created] ID: ${lead.leadId}, Name: ${lead.name}, Destination: ${lead.destination}`);

    // Contextual WhatsApp link generator
    const encodedMsg = encodeURIComponent(
      `Hi SafarTrails Expert! I just submitted an enquiry (#${lead.leadId}) for ${lead.destination}.\n` +
      `Dates: ${lead.travelDates} | Travellers: ${lead.travellers}\n` +
      `Name: ${lead.name} (${lead.phone})\n` +
      `Please provide the final verified quote & hotel options.`
    );
    const whatsappUrl = `https://wa.me/918076665782?text=${encodedMsg}`;

    // Email delivery via Resend
    let emailDelivered = false;
    if (process.env.RESEND_API_KEY) {
      const emailResult = await sendQuoteEmail({
        apiKey: process.env.RESEND_API_KEY,
        fromEmail: process.env.RESEND_FROM_EMAIL,
        toEmail: QUOTE_NOTIFY_EMAIL,
        lead,
      });

      if (emailResult.ok) {
        emailDelivered = true;
      } else {
        console.error('[SafarTrails Quote Email] Delivery failed:', emailResult.error);
      }
    } else {
      console.warn('[SafarTrails Quote Email] RESEND_API_KEY is not set in environment.');
    }

    return res.json({
      success: true,
      leadId: lead.leadId,
      whatsappUrl,
      emailDelivered,
      message: 'Your enquiry has been assigned to a Senior SafarTrails Destination Specialist.'
    });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return res.status(500).json({ error: 'Failed to process enquiry' });
  }
});

// AI Trip Planner API - shared logic lives in src/lib/ai/generateTripPlan.ts so the
// same Gemini + fallback behavior runs identically on Cloudflare Pages
// (functions/api/ai-plan.ts) when this app isn't served by this Express process.
app.post('/api/ai-plan', async (req, res) => {
  try {
    const result = await generateTripPlan(req.body || {}, process.env.GEMINI_API_KEY);
    return res.json(result);
  } catch (err: any) {
    console.error('Error generating AI plan:', err);
    return res.status(500).json({ error: 'Failed to generate trip plan' });
  }
});

// Explicit Robots.txt and Sitemap.xml routes (100% standard compliance, no HTML fallback)
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(process.cwd(), 'public', 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.sendFile(path.join(process.cwd(), 'public', 'sitemap.xml'));
});

// Start Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');

    // Hashed build assets are safe to cache forever; the prerendered HTML files
    // are not, or a content update would never reach a returning visitor.
    app.use(
      express.static(distPath, {
        index: false,
        // Without this, Express 301s /destinations/kashmir to the trailing-slash
        // form, contradicting the canonical URL. The handler below serves the
        // prerendered file at the exact requested path instead.
        redirect: false,
        setHeaders(res, filePath) {
          res.setHeader(
            'Cache-Control',
            filePath.endsWith('.html') ? 'public, max-age=0, must-revalidate' : 'public, max-age=31536000, immutable',
          );
        },
      }),
    );

    // Serve the per-route HTML written by scripts/prerender.ts. Falling straight
    // through to the SPA shell (the previous behavior) is what made every URL
    // return the homepage's title, meta and canonical.
    app.get('*', (req, res) => {
      const requestPath = req.path.replace(/\/+$/, '');

      if (!requestPath) {
        return res.sendFile(path.join(distPath, 'index.html'));
      }

      // path.resolve + prefix check keeps a crafted "../" path from escaping dist.
      const prerendered = path.resolve(distPath, `.${requestPath}`, 'index.html');
      if (prerendered.startsWith(distPath + path.sep) && fs.existsSync(prerendered)) {
        return res.sendFile(prerendered);
      }

      // Packages used to be served from two URLs with the same slug. There is now
      // one - /tour-packages/<slug> - so the retired form redirects into it.
      // Mirrors the rules in public/_redirects for the Cloudflare deployment.
      const retiredPackage = requestPath.match(/^\/packages\/(.+)$/);
      if (retiredPackage) {
        const target =
          retiredPackage[1] === 'chardham-yatra-package'
            ? 'chardham-yatra-haridwar-yamunotri-gangotri-kedarnath-badrinath-10d9n'
            : retiredPackage[1];
        return res.redirect(301, `/tour-packages/${target}`);
      }

      // Client-routed detail pages still need the shell.
      if (/^\/(destinations|tour-packages|guides)\//.test(req.path)) {
        return res.sendFile(path.join(distPath, 'index.html'));
      }

      // Everything else is genuinely missing: answer 404, not a soft 404.
      const notFoundPage = path.join(distPath, '404.html');
      return res
        .status(404)
        .sendFile(fs.existsSync(notFoundPage) ? notFoundPage : path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SafarTrails Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
