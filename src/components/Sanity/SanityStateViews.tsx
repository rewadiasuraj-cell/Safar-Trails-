import React from 'react';

export const SanityLoadingState: React.FC<{ label?: string }> = ({ label }) => (
  <div className="w-full py-24 flex flex-col items-center justify-center text-gray-400">
    <div className="w-8 h-8 border-2 border-gray-200 border-t-luxury-gold rounded-full animate-spin mb-3" />
    <p className="text-sm">{label || 'Loading content…'}</p>
  </div>
);

export const SanityErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="w-full py-24 flex flex-col items-center justify-center text-center px-4">
    <p className="text-sm font-semibold text-red-600 mb-1">Couldn't load content from Sanity</p>
    <p className="text-xs text-gray-500 max-w-md">{message}</p>
  </div>
);

export const SanityEmptyState: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
  <div className="w-full py-24 flex flex-col items-center justify-center text-center px-4">
    <p className="text-base font-bold text-slate-900 mb-1">{title}</p>
    {description && <p className="text-sm text-gray-500 max-w-md">{description}</p>}
  </div>
);
