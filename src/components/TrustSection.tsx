import React from 'react';
import { ShieldCheck, Car, IndianRupee, Clock, CheckCircle2, HeartHandshake } from 'lucide-react';
import { AIIcon } from './AIIcon';

export const TrustSection: React.FC = () => {
  const pillars = [
    {
      icon: AIIcon,
      color: 'text-midnight-blue bg-luxury-gold border-luxury-gold',
      title: 'Smart Speed, Human Warmth',
      description: 'Generate customized day-by-day itineraries in seconds. Our senior destination specialists review room categories, verify road conditions, and lock live inventory.'
    },
    {
      icon: ShieldCheck,
      color: 'text-midnight-blue bg-luxury-gold border-luxury-gold',
      title: 'Verified Stays & Clean Rooms',
      description: 'We partner directly with boutique properties rated 4.5+ on hospitality. Central heating in snow valleys, private balconies, and hygienic dining assured.'
    },
    {
      icon: Car,
      color: 'text-midnight-blue bg-luxury-gold border-luxury-gold',
      title: 'Dedicated Chauffeur & Cab',
      description: 'Private sanitized sedan or SUV assigned exclusively to your family. All toll taxes, driver night allowances, parking, and state permits are pre-covered.'
    },
    {
      icon: IndianRupee,
      color: 'text-midnight-blue bg-luxury-gold border-luxury-gold',
      title: 'Clear Pricing. No Hidden Costs.',
      description: 'Clear itemized budgets with zero hidden surcharges on ground. What you see is what you pay, with realistic indicative starting prices.'
    },
    {
      icon: Clock,
      color: 'text-midnight-blue bg-luxury-gold border-luxury-gold',
      title: '24/7 Expert Travel Support.',
      description: 'A dedicated trip coordinator stays reachable on WhatsApp throughout your journey to coordinate driver pickups, hotel check-ins, and activity slots.'
    },
    {
      icon: HeartHandshake,
      color: 'text-midnight-blue bg-luxury-gold border-luxury-gold',
      title: 'Freedom to Customize.',
      description: 'Need to add an extra day, swap a hotel, or request Jain/halal meals? Every SafarTrails itinerary is 100% tailored to your specific family preferences.'
    }
  ];

  return (
    <section id="why-safar-trails-section" className="w-full py-16 lg:py-24 bg-royal-navy">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-luxury-gold/30 text-luxury-gold text-xs font-bold uppercase tracking-widest mb-3">
            <span>The SafarTrails Promise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight">
            Why Experienced Travelers Choose Safar Trails
          </h2>
          <p className="mt-2 text-gray-300 text-sm sm:text-base font-normal">
            We bridge modern artificial intelligence with trusted human hospitality to deliver memorable Indian holidays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-white/[0.06] border border-white/10 hover:border-luxury-gold/50 shadow-xs hover:shadow-lg transition-all duration-300 space-y-4"
              >
                <div className="w-11 h-11 rounded-xl bg-luxury-gold text-midnight-blue flex items-center justify-center shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-xl font-serif font-bold text-white">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
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
