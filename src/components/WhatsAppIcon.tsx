import React from 'react';

interface WhatsAppIconProps {
  className?: string;
  hasBackground?: boolean;
}

/**
 * Official WhatsApp Vector Brand Icon with green speech bubble and white handset
 */
export const WhatsAppIcon: React.FC<WhatsAppIconProps> = ({
  className = 'w-6 h-6',
  hasBackground = false,
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer subtle shadow/border halo if requested */}
      {hasBackground && (
        <circle cx="50" cy="50" r="48" fill="#F4F4F4" />
      )}
      
      {/* Official WhatsApp Green Speech Bubble with pointed corner */}
      <path
        d="M50 6C25.7 6 6 25.7 6 50C6 58.2 8.3 66 12.3 72.7L7.5 90.5L25.9 85.7C32.9 89.9 41.2 92.3 50 92.3C74.3 92.3 94 72.6 94 48.3C94 24 74.3 6 50 6Z"
        fill="#25D366"
      />

      {/* Official WhatsApp White Phone Receiver */}
      <path
        d="M69.5 61.8C68.4 61.2 63.1 58.6 62.1 58.2C61.1 57.8 60.4 57.6 59.7 58.6C59 59.6 57.1 61.8 56.5 62.5C55.9 63.2 55.4 63.3 54.3 62.8C53.3 62.3 50.1 61.2 46.3 57.8C43.3 55.1 41.3 51.8 40.7 50.8C40.1 49.8 40.6 49.3 41.1 48.7C41.6 48.2 42.1 47.6 42.7 46.9C43.2 46.2 43.4 45.7 43.8 45C44.1 44.3 43.9 43.8 43.7 43.2C43.5 42.7 41.4 37.5 40.5 35.4C39.6 33.3 38.7 33.6 38.1 33.6C37.5 33.6 36.9 33.6 36.2 33.6C35.5 33.6 34.4 33.8 33.4 34.9C32.4 36 29.7 38.5 29.7 43.7C29.7 48.9 33.5 53.8 34 54.6C34.5 55.4 41.3 66 51.8 70.5C54.3 71.6 56.3 72.3 57.8 72.7C60.3 73.5 62.6 73.4 64.4 73.1C66.4 72.8 70.6 70.6 71.5 68.1C72.4 65.6 72.4 63.5 72.1 63.1C71.8 62.7 71.1 62.4 69.5 61.8Z"
        fill="white"
      />
    </svg>
  );
};
