import React from 'react';

interface AIIconProps {
  className?: string;
}

export const AIIcon: React.FC<AIIconProps> = ({ className = 'w-4 h-4 text-current' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Large Star (Left/Bottom) */}
      <path d="M10 4.5C10 9.747 13.753 13.5 19 13.5C13.753 13.5 10 17.253 10 22.5C10 17.253 6.247 13.5 1 13.5C6.247 13.5 10 9.747 10 4.5Z" />
      {/* Small Star (Top/Right) */}
      <path d="M18.5 1.5C18.5 3.985 20.515 6 23 6C20.515 6 18.5 8.015 18.5 10.5C18.5 8.015 16.485 6 14 6C16.485 6 18.5 3.985 18.5 1.5Z" />
    </svg>
  );
};
