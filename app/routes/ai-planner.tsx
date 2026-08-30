import React from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { AITripPlanner } from '../../src/components/AITripPlanner/AITripPlanner';
import type { Route } from './+types/ai-planner';

export const meta: Route.MetaFunction = () => [
  { title: "AI Trip Planner India — Create Custom Holiday Itineraries | Safar Trails" },
  { name: "description", content: "Generate custom India travel itineraries in seconds with Safar Trails AI. Tailored for budget, travel style & duration, then perfected by local destination experts." },
  { property: "og:title", content: "AI Trip Planner India — Create Custom Holiday Itineraries | Safar Trails" },
  { property: "og:description", content: "Generate custom India travel itineraries in seconds with Safar Trails AI. Tailored for budget, travel style & duration, then perfected by local destination experts." },
  { property: "og:url", content: "https://safartrails.co.in/ai-planner" },
  { property: "og:image", content: "https://safartrails.co.in/og-image.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
];

export default function AIPlannerRoute() {
  const navigate = useNavigate();
  const outletContext = useOutletContext<{
    handleOpenQuoteModal?: (summary?: string, destinationName?: string) => void;
  }>();

  const handleOpenQuoteModal = outletContext?.handleOpenQuoteModal || (() => {});

  return (
    <div className="pt-20 pb-16">
      <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-gray-200 hover:border-black text-slate-800 hover:text-black text-xs font-bold uppercase tracking-wide transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>
      <AITripPlanner onOpenQuoteModal={handleOpenQuoteModal} />
    </div>
  );
}
