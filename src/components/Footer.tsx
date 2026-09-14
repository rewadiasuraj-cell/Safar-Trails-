import React from 'react';
import { SafarLogo } from './SafarLogo';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Heart,
  Globe,
  Lock
} from 'lucide-react';
import { AIIcon } from './AIIcon';
import { trackPhoneCallClick } from '../lib/analytics';
import {
  BRAND_TAGLINE,
  DISPLAY_ADDRESS,
  PRIMARY_EMAIL,
  PRIMARY_PHONE,
  PRIMARY_PHONE_DISPLAY,
} from '../lib/seo/siteConfig';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenPolicyModal: (policyType: 'privacy' | 'terms' | 'cancellation') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPolicyModal
}) => {
  const popularDestinations = [
    { name: 'Kashmir Holiday Packages', slug: 'kashmir' },
    { name: 'Goa Beach & Heritage Packages', slug: 'goa' },
    { name: 'Kerala Backwaters & Munnar', slug: 'kerala' },
    { name: 'Royal Rajasthan Heritage Circuit', slug: 'rajasthan' },
    { name: 'Himachal Snow & Valleys', slug: 'himachal-pradesh' },
    { name: 'Andaman Island & Scuba Tours', slug: 'andaman' },
    { name: 'Northeast & Meghalaya Living Bridges', slug: 'northeast-india' },
    { name: 'Uttarakhand Rafting & Devbhoomi', slug: 'uttarakhand' }
  ];

  return (
    <footer id="main-footer" className="w-full bg-midnight-blue text-gray-300 pt-16 pb-24 lg:pb-12 border-t border-luxury-gold/20">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('home')}
              className="cursor-pointer inline-flex items-center"
            >
              <SafarLogo 
                variant="dark" 
                size="lg" 
              />
            </div>
            
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-sm pt-1">
              SafarTrails is India’s premier AI-powered domestic travel agency. We combine instant AI itinerary generation with verified boutique stays, private sanitized cabs, and 24/7 dedicated human concierge.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-gray-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-forest-green" />
              <span>Ministry of Tourism Compliant • GST Registered</span>
            </div>
          </div>

          {/* Column 2: Popular Destinations */}
          <div className="space-y-3 text-xs">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">
              Destinations
            </h3>
            <ul className="space-y-2 text-gray-300">
              {popularDestinations.slice(0, 6).map((d) => (
                <li key={d.slug}>
                  <button
                    onClick={() => onNavigate('destination-detail', d.slug)}
                    className="hover:text-luxury-gold transition-colors text-left cursor-pointer"
                  >
                    {d.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3 text-xs">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">
              Explore
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-luxury-gold transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-planner')}
                  className="hover:text-luxury-gold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <AIIcon className="w-3 h-3 text-white" />
                  <span>AI Trip Studio</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('packages')}
                  className="hover:text-luxury-gold transition-colors cursor-pointer"
                >
                  Curated Holiday Packages
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('guides')}
                  className="hover:text-luxury-gold transition-colors cursor-pointer"
                >
                  Travel Guides & Insights
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('why-us')}
                  className="hover:text-luxury-gold transition-colors cursor-pointer"
                >
                  Why SafarTrails
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Concierge */}
          <div className="space-y-3 text-xs">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">
              Contact Concierge
            </h3>
            <ul className="space-y-2.5 text-gray-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                <address className="not-italic leading-relaxed">{DISPLAY_ADDRESS}</address>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-luxury-gold flex-shrink-0" aria-hidden="true" />
                <a
                  href={`tel:${PRIMARY_PHONE}`}
                  onClick={() => trackPhoneCallClick('footer')}
                  className="hover:text-luxury-gold transition-colors"
                >
                  {PRIMARY_PHONE_DISPLAY} <span className="text-gray-400">(24/7 helpline)</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-luxury-gold flex-shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${PRIMARY_EMAIL}`}
                  className="hover:text-luxury-gold transition-colors break-all"
                >
                  {PRIMARY_EMAIL}
                </a>
              </li>
              <li className="pt-2">
                <div className="inline-block px-3 py-1.5 rounded-xl bg-white/5 text-gray-300 text-[11px] font-medium border border-white/10">
                  ⚡ Average WhatsApp Response: <strong className="text-white">Under 3 mins</strong>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 border-t border-white/5">
          <div>
            © {new Date().getFullYear()} SafarTrails Private Limited. All rights reserved. •{' '}
            <span className="italic">{BRAND_TAGLINE} — AI plans. Experts perfect.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenPolicyModal('privacy')}
              className="hover:text-luxury-gold transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPolicyModal('terms')}
              className="hover:text-luxury-gold transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPolicyModal('cancellation')}
              className="hover:text-luxury-gold transition-colors cursor-pointer"
            >
              Booking & Cancellation
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
