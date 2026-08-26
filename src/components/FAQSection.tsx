import React, { useState } from 'react';
import { generalFaqs } from '../data/reviewsAndTrustData';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-16 lg:py-24 bg-white border-t border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-[10px] font-bold uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-black" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-gray-500 text-sm sm:text-base font-normal">
            Everything you need to know about booking, customized planning, and on-trip assistance.
          </p>
        </div>

        <div className="space-y-4">
          {generalFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#FAF9F6] rounded-2xl border border-gray-200 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left font-serif font-bold text-base sm:text-lg text-black flex items-center justify-between hover:bg-gray-100/50 transition-colors cursor-pointer"
                >
                  <span className="pr-4">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-black flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal border-t border-gray-200/60 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
