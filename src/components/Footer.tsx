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
    <footer id="main-footer" className="bg-[#0A0A0A] text-gray-400 pt-16 pb-24 lg:pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          {/* Column 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <SafarLogo 
              variant="dark" 
              size="md" 
              imgStyle={{
                paddingLeft: '0px',
                marginLeft: '-23px',
                marginTop: '1px',
                height: '52.9943px',
                width: '198px'
              }}
            />
            
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm pt-2">
              SafarTrails is India’s premier AI-powered domestic travel agency. We combine instant AI itinerary generation with verified boutique stays, private sanitized cabs, and 24/7 dedicated human concierge.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-gray-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ministry of Tourism Compliant • GST Registered</span>
            </div>
          </div>

          {/* Column 2: Popular Destinations */}
          <div className="space-y-3 text-xs">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">
              Destinations
            </h4>
            <ul className="space-y-2 text-gray-400">
              {popularDestinations.slice(0, 6).map((d) => (
                <li key={d.slug}>
                  <button
                    onClick={() => onNavigate('destination-detail', d.slug)}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    {d.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3 text-xs">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">
              Explore
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-planner')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <AIIcon className="w-3 h-3 text-white" />
                  <span>AI Trip Studio</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('packages')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Curated Holiday Packages
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('guides')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Travel Guides & Insights
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('why-us')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Why SafarTrails
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Concierge */}
          <div className="space-y-3 text-xs">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">
              Contact Concierge
            </h4>
            <ul className="space-y-2.5 text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FF6B00] flex-shrink-0 mt-0.5" />
                <span>1st Floor, Plot No. 2, Metro Pillar 786, Dwarka Mor, New Delhi</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                <a 
                  href="tel:+918076665782"
                  className="hover:text-white transition-colors"
                >
                  +91 80766 65782 <span className="text-gray-500">(24/7 Helpline)</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                <a 
                  href="mailto:safartrail2104@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  safartrail2104@gmail.com
                </a>
              </li>
              <li className="pt-2">
                <div className="inline-block px-3 py-1.5 rounded-xl bg-gray-900 text-gray-300 text-[11px] font-medium border border-gray-800">
                  ⚡ Average WhatsApp Response: <strong className="text-white">Under 3 mins</strong>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} SafarTrails Private Limited. All rights reserved. • <span className="italic">AI plans. Experts perfect.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenPolicyModal('privacy')}
              className="hover:text-gray-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPolicyModal('terms')}
              className="hover:text-gray-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPolicyModal('cancellation')}
              className="hover:text-gray-300 transition-colors cursor-pointer"
            >
              Booking & Cancellation
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
