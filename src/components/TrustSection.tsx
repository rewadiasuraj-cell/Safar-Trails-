import React from 'react';
import { ShieldCheck, Car, IndianRupee, Clock, CheckCircle2, HeartHandshake } from 'lucide-react';
import { AIIcon } from './AIIcon';

export const TrustSection: React.FC = () => {
  const pillars = [
    {
      icon: AIIcon,
      color: 'text-black bg-gray-100 border-gray-200',
      title: 'Smart Speed, Human Warmth',
      description: 'Generate customized day-by-day itineraries in seconds. Our senior destination specialists review room categories, verify road conditions, and lock live inventory.'
    },
    {
      icon: ShieldCheck,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      title: 'Verified Stays & Clean Rooms',
      description: 'We partner directly with boutique properties rated 4.5+ on hospitality. Central heating in snow valleys, private balconies, and hygienic dining assured.'
    },
    {
      icon: Car,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      title: 'Dedicated Chauffeur & Cab',
      description: 'Private sanitized sedan or SUV assigned exclusively to your family. All toll taxes, driver night allowances, parking, and state permits are pre-covered.'
    },
    {
      icon: IndianRupee,
      color: 'text-amber-800 bg-amber-50 border-amber-200',
      title: '100% Transparent Quotes',
      description: 'Clear itemized budgets with zero hidden surcharges on ground. What you see is what you pay, with realistic indicative starting prices.'
    },
    {
      icon: Clock,
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      title: '24/7 On-Trip Concierge',
      description: 'A dedicated trip coordinator stays reachable on WhatsApp throughout your journey to coordinate driver pickups, hotel check-ins, and activity slots.'
    },
    {
      icon: HeartHandshake,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      title: 'Hassle-Free Flexibility',
      description: 'Need to add an extra day, swap a hotel, or request Jain/halal meals? Every SafarTrails itinerary is 100% tailored to your specific family preferences.'
    }
  ];

  return (
    <section id="why-safar-trails-section" className="py-16 lg:py-24 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-widest mb-3">
            <span>The SafarTrails Promise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-black tracking-tight">
            Why Discerning Travelers Choose SafarTrails
          </h2>
          <p className="mt-2 text-gray-500 text-sm sm:text-base font-normal">
            We bridge modern artificial intelligence with trusted human hospitality to deliver memorable Indian holidays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200/80 hover:border-black/30 shadow-xs hover:shadow-lg transition-all duration-300 space-y-4"
              >
                <div className="w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-xl font-serif font-bold text-black">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
