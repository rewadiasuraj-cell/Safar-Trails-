import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import compression from 'compression';
import { sendQuoteEmail } from './src/lib/email/sendQuoteEmail';
import { generateTripPlan } from './src/lib/ai/generateTripPlan';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(compression());
app.use(express.json());

// In-memory leads storage for demo & export
const submittedLeads: any[] = [];

const QUOTE_NOTIFY_EMAIL = 'info.safartrails@gmail.com';

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'SafarTrails', timestamp: new Date().toISOString() });
});

// Lead Submission / Quote Request endpoint
app.post('/api/quotes', (req, res) => {
  try {
    const { name, phone, email, destination, travelDates, travellers, budget, itinerarySummary, specialNotes } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and Phone number are required' });
    }

    const lead = {
      id: `ST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      phone,
      email: email || '',
      destination: destination || 'India Custom',
      travelDates: travelDates || 'Flexible',
      travellers: travellers || '2 Adults',
      budget: budget || 'Standard',
      itinerarySummary: itinerarySummary || '',
      specialNotes: specialNotes || '',
      createdAt: new Date().toISOString(),
      status: 'NEW_ENQUIRY'
    };

    submittedLeads.unshift(lead);
    console.log(`[SafarTrails Lead Created] ID: ${lead.id}, Name: ${lead.name}, Destination: ${lead.destination}`);

    // Contextual WhatsApp link generator
    const encodedMsg = encodeURIComponent(
      `Hi SafarTrails Expert! I just submitted an enquiry (#${lead.id}) for ${lead.destination}.\n` +
      `Dates: ${lead.travelDates} | Travellers: ${lead.travellers}\n` +
      `Name: ${lead.name} (${lead.phone})\n` +
      `Please provide the final verified quote & hotel options.`
    );
    const whatsappUrl = `https://wa.me/918076665782?text=${encodedMsg}`;

    // Fire-and-forget: never awaited, and a failure here must never affect the
    // response below - the enquiry itself and the WhatsApp link already succeeded.
    if (process.env.RESEND_API_KEY) {
      sendQuoteEmail({
        apiKey: process.env.RESEND_API_KEY,
        fromEmail: process.env.RESEND_FROM_EMAIL,
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

    return res.json({
      success: true,
      leadId: lead.id,
      whatsappUrl,
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
    app.use(express.static(distPath, {
      maxAge: '1y',
      immutable: true,
      index: false
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SafarTrails Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
