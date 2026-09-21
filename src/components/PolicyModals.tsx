import React from 'react';
import { X, ShieldCheck, FileText, RefreshCw } from 'lucide-react';

interface PolicyModalsProps {
  type: 'privacy' | 'terms' | 'cancellation' | null;
  onClose: () => void;
}

export const PolicyModals: React.FC<PolicyModalsProps> = ({ type, onClose }) => {
  if (!type) return null;

  const contentMap = {
    privacy: {
      title: 'Privacy Policy',
      icon: ShieldCheck,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>
            <strong>Effective Date:</strong> January 1, 2026
          </p>
          <p>
            At SafarTrails (SafarTrails Private Limited), we respect your personal data and privacy. This Privacy Policy details how we collect, handle, and protect your information when using our website and holiday booking services.
          </p>
          <h3 className="font-bold text-[#0B4A78] text-sm">1. Information We Collect</h3>
          <p>
            We collect personal contact details (Name, Phone Number/WhatsApp, Email Address) solely to prepare travel itineraries, book verified hotel stays, and assign transport chauffeurs.
          </p>
          <h3 className="font-bold text-[#0B4A78] text-sm">2. Zero Third-Party Spam</h3>
          <p>
            We do NOT sell, rent, or lease your phone number or email to third-party telemarketers. All interactions remain strictly between you and your assigned SafarTrails Destination Specialist.
          </p>
          <h3 className="font-bold text-[#0B4A78] text-sm">3. Data Security</h3>
          <p>
            All submitted enquiries and payment records are encrypted with industry-standard 256-bit SSL protocols.
          </p>
        </div>
      )
    },
    terms: {
      title: 'Terms of Service',
      icon: FileText,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>
            <strong>Terms & Conditions of SafarTrails.com</strong>
          </p>
          <h3 className="font-bold text-[#0B4A78] text-sm">1. Scope of Service</h3>
          <p>
            SafarTrails acts as an AI-powered holiday curator and tour organizer. All website package prices are estimated indicative figures based on standard season rates. Exact quotes are finalized with the customer before advance token payment.
          </p>
          <h3 className="font-bold text-[#0B4A78] text-sm">2. Hotel Check-in & Identification</h3>
          <p>
            All guests must present valid Government-issued photo ID cards (Aadhaar, Passport, Driving License) at hotel check-in. PAN cards are not accepted by hotels as proof of address.
          </p>
          <h3 className="font-bold text-[#0B4A78] text-sm">3. Force Majeure</h3>
          <p>
            SafarTrails is not liable for weather-related flight cancellations, landslide road blocks, or government-imposed curfews. In such events, our 24/7 concierge will make reasonable efforts to reschedule stays and reroute transport.
          </p>
        </div>
      )
    },
    cancellation: {
      title: 'Booking & Cancellation Policy',
      icon: RefreshCw,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>
            We believe in fair, transparent cancellation terms for our travelers.
          </p>
          <h3 className="font-bold text-[#0B4A78] text-sm">Standard Domestic Package Cancellation Schedule:</h3>
          <ul className="space-y-2 bg-stone-50 p-4 rounded-xl border border-stone-200">
            <li>• <strong>30+ Days Prior to Travel:</strong> 100% Refund of deposit (minus a modest ₹1,000 administrative processing fee).</li>
            <li>• <strong>15 to 29 Days Prior to Travel:</strong> 75% Refund of total package cost.</li>
            <li>• <strong>7 to 14 Days Prior to Travel:</strong> 50% Refund of total package cost.</li>
            <li>• <strong>Less than 7 Days Prior to Travel:</strong> Non-refundable due to pre-locked hotel commitments.</li>
          </ul>
          <p className="text-xs text-stone-500">
            *Non-refundable flight tickets and Peak Holiday Season bookings (Dec 20 - Jan 5) follow airline and hotel-specific terms.
          </p>
        </div>
      )
    }
  };

  const active = contentMap[type];
  const Icon = active.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[80vh]">
        <div className="bg-[#0F172A] p-5 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <Icon className="w-5 h-5 text-white" />
            <h2 className="font-serif font-bold text-base sm:text-lg tracking-tight">
              {active.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto bg-[#F2F8FC]">
          {active.body}
        </div>

        <div className="p-4 border-t border-stone-200 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
