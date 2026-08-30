import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

const AITripPlanner = lazy(() => import('../../src/components/AITripPlanner/AITripPlanner').then(m => ({ default: m.AITripPlanner })));

export default function AIPlannerRoute() {
  const navigate = useNavigate();
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
      <Suspense fallback={<div className="w-full py-12 flex items-center justify-center min-h-[140px]" />}>
        <AITripPlanner onOpenQuoteModal={() => {}} />
      </Suspense>
    </div>
  );
}
