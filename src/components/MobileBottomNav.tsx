import React from 'react';
import { Home, Compass, Package as PackageIcon } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { AIIcon } from './AIIcon';
import { enquiryMessage, openWhatsApp } from '../lib/contact';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate
}) => {
  const handleWhatsApp = () => openWhatsApp(enquiryMessage(), 'mobile_bottom_nav');

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'destinations', label: 'Explore', icon: Compass },
    { id: 'ai-planner', label: 'AI Plan', icon: AIIcon, isSpecial: true },
    { id: 'packages', label: 'Trips', icon: PackageIcon },
  ];

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#D9E6F0] px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-[0_-6px_24px_-6px_rgba(15,23,42,0.18)]"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                id="mobile-bottom-ai-plan"
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className="flex flex-col items-center justify-center -mt-5 min-w-[48px] cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink"
              >
                <div className="w-12 h-12 rounded-full bg-deep-emerald text-white flex items-center justify-center shadow-[0_6px_18px_-4px_rgba(3,105,161,0.65)] border-2 border-white transition-transform active:scale-95">
                  <AIIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-deep-emerald mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`mobile-bottom-${item.id}`}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-[48px] min-w-[48px] flex-col items-center justify-center rounded-lg px-2.5 py-1 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink ${
                isActive ? 'text-deep-emerald font-bold' : 'text-stone-600 hover:text-deep-emerald font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} aria-hidden="true" />
              <span className="text-[10px] mt-0.5 uppercase tracking-wider">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* WhatsApp Icon Button with Original Logo */}
        <button
          id="mobile-bottom-whatsapp"
          onClick={handleWhatsApp}
          aria-label="Chat with a Safar Trails travel specialist on WhatsApp"
          className="flex min-h-[48px] min-w-[48px] flex-col items-center justify-center rounded-lg px-2.5 py-1 transition-colors cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp"
        >
          <WhatsAppIcon className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
          <span className="text-[10px] font-bold text-whatsapp mt-0.5 uppercase tracking-wider">
            WhatsApp
          </span>
        </button>
      </div>
    </nav>
  );
};
