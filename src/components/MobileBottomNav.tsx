import React from 'react';
import { NavLink } from 'react-router';
import { Home, Compass, Package as PackageIcon } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { AIIcon } from './AIIcon';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = () => {
  const handleWhatsApp = () => {
    const text = encodeURIComponent("Hi SafarTrails Expert! I want to plan a custom India holiday.");
    window.open(`https://wa.me/918076665782?text=${text}`, '_blank');
  };

  const navItems = [
    { id: 'home', to: '/', label: 'Home', icon: Home, end: true },
    { id: 'destinations', to: '/destinations', label: 'Explore', icon: Compass },
    { id: 'ai-planner', to: '/ai-planner', label: 'AI Plan', icon: AIIcon, isSpecial: true },
    { id: 'packages', to: '/packages', label: 'Trips', icon: PackageIcon },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.isSpecial) {
            return (
              <NavLink
                key={item.id}
                to={item.to}
                id="mobile-bottom-ai-plan"
                className="flex flex-col items-center justify-center -mt-5 cursor-pointer focus:outline-none"
              >
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-lg border-2 border-white transition-transform active:scale-95">
                  <AIIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-black mt-0.5">
                  {item.label}
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.end}
              id={`mobile-bottom-${item.id}`}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                  isActive ? 'text-black font-bold' : 'text-gray-400 hover:text-black font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[10px] mt-0.5 uppercase tracking-wider">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}

        {/* WhatsApp Icon Button */}
        <button
          id="mobile-bottom-whatsapp"
          onClick={handleWhatsApp}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer group"
        >
          <WhatsAppIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold text-emerald-700 mt-0.5 uppercase tracking-wider">
            WhatsApp
          </span>
        </button>
      </div>
    </div>
  );
};
