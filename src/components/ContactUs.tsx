import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { enquiryMessage, openWhatsApp } from '../lib/contact';
import { trackPhoneCallClick } from '../lib/analytics';
import { DISPLAY_ADDRESS, PRIMARY_PHONE, PRIMARY_PHONE_DISPLAY } from '../lib/seo/siteConfig';

interface ContactUsProps {
  onOpenQuoteModal: (summary?: string) => void;
}

export const ContactUs: React.FC<ContactUsProps> = ({ onOpenQuoteModal }) => {
  const handleWhatsAppClick = () => openWhatsApp(enquiryMessage(), 'contact_page');

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact SafarTrails
        </h1>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
          Have a question, need a custom itinerary, or just want to talk to a human? Our travel
          concierge team is here to help, 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6 bg-soft-blue rounded-2xl p-6 sm:p-8 border border-gray-100">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gold-ink flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="text-sm font-bold text-slate-900">Office Address</div>
              {/* From siteConfig, not typed out here: this copy had drifted to the
                  old "Dwarka Mor" street line and disagreed with both the footer
                  and the Google Business Profile. */}
              <div className="text-sm text-slate-600 mt-1">{DISPLAY_ADDRESS}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gold-ink flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="text-sm font-bold text-slate-900">Phone</div>
              <a
                href={`tel:${PRIMARY_PHONE}`}
                onClick={() => trackPhoneCallClick('contact_page')}
                className="text-sm text-slate-700 hover:text-gold-ink transition-colors"
              >
                {PRIMARY_PHONE_DISPLAY} (24/7 helpline)
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gold-ink flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="text-sm font-bold text-slate-900">Email</div>
              <a href="mailto:info.safartrails@gmail.com" className="text-sm text-slate-700 hover:text-gold-ink transition-colors">
                info.safartrails@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-gold-ink flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="text-sm font-bold text-slate-900">Response Time</div>
              <div className="text-sm text-slate-600 mt-1">
                Average WhatsApp response: under 3 minutes
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Get a Custom Itinerary
          </h2>
          <p className="text-sm text-slate-600">
            Tell us where you want to go and we'll put together a personalized plan with verified
            stays, transport, and pricing.
          </p>
          <button
            onClick={() => onOpenQuoteModal('Contact & General Inquiries')}
            className="w-full py-3 rounded-full bg-warm-orange hover:brightness-95 text-white font-bold text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            Request a Free Quote
          </button>
          <button
            onClick={handleWhatsAppClick}
            className="w-full py-3 rounded-full border border-gray-200 text-slate-800 font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <WhatsAppIcon className="w-5 h-5" />
            <span>Chat on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
