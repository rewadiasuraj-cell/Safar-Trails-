import React from 'react';
import { ShieldCheck } from 'lucide-react';

export interface ExpertVerifiedBadgeProps {
  variant?: 'light' | 'dark' | 'glass-dark' | 'glass-indigo';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  tooltipText?: string;
  showSubtitle?: boolean;
}

export const ExpertVerifiedBadge: React.FC<ExpertVerifiedBadgeProps> = ({
  variant = 'light',
  size = 'sm',
  className = '',
  tooltipText = 'Expertly curated, vetted, and verified by certified destination specialists',
  showSubtitle = false,
}) => {
  const sizeConfig = {
    xs: {
      pill: 'px-2 py-0.5 text-[9.5px] sm:text-[10px]',
      icon: 'w-3 h-3',
      gap: 'gap-1',
    },
    sm: {
      pill: 'px-2.5 py-1 text-[10.5px] sm:text-[11px]',
      icon: 'w-3.5 h-3.5',
      gap: 'gap-1.5',
    },
    md: {
      pill: 'px-3 py-1.5 text-xs',
      icon: 'w-4 h-4',
      gap: 'gap-1.5',
    },
  }[size];

  const variantStyles = {
    light: 'bg-indigo-50 text-indigo-900 border border-indigo-200/80 shadow-2xs hover:bg-indigo-100/80',
    dark: 'bg-indigo-950/90 text-indigo-100 border border-indigo-400/40 shadow-sm',
    'glass-dark': 'bg-indigo-950/70 backdrop-blur-md text-indigo-100 border border-indigo-400/40 shadow-xs',
    'glass-indigo': 'bg-indigo-500/20 backdrop-blur-md text-indigo-100 border border-indigo-300/40 shadow-xs',
  }[variant];

  const iconColor = {
    light: 'text-indigo-600',
    dark: 'text-indigo-300',
    'glass-dark': 'text-indigo-300',
    'glass-indigo': 'text-indigo-200',
  }[variant];

  return (
    <span
      title={tooltipText}
      className={`inline-flex items-center ${sizeConfig.gap} rounded-full font-bold uppercase tracking-wider leading-none shrink-0 select-none transition-all duration-200 ${sizeConfig.pill} ${variantStyles} ${className}`}
    >
      <ShieldCheck className={`${sizeConfig.icon} ${iconColor} shrink-0 stroke-[2.4]`} />
      <span className="whitespace-nowrap">Expert Verified</span>
      {showSubtitle && (
        <span className="hidden sm:inline opacity-75 font-medium normal-case text-[10px] tracking-normal border-l border-current/30 pl-1.5 ml-0.5">
          Curated by specialists
        </span>
      )}
    </span>
  );
};
