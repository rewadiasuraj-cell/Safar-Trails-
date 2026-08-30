import React from 'react';
import { ContactUs } from '../../src/components/ContactUs';
import type { Route } from './+types/contact-us';

export const meta: Route.MetaFunction = () => [
  { title: "Contact Safar Trails — 24/7 Travel Concierge & Helpline" },
  { name: "description", content: "Get in touch with Safar Trails travel specialists. Call +91 80766 65782 or WhatsApp us for custom holiday package quotes and itinerary planning." },
  { property: "og:title", content: "Contact Safar Trails — 24/7 Travel Concierge & Helpline" },
  { property: "og:description", content: "Get in touch with Safar Trails travel specialists. Call +91 80766 65782 or WhatsApp us for custom holiday package quotes and itinerary planning." },
  { property: "og:url", content: "https://safartrails.co.in/contact-us" },
  { property: "og:image", content: "https://safartrails.co.in/og-image.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
];

export default function ContactUsRoute() {
  return (
    <div className="pt-20">
      <ContactUs onOpenQuoteModal={() => {}} />
    </div>
  );
}
