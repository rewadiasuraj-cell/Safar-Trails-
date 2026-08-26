import React from 'react';

interface SafarLogoProps {
  className?: string;
  imgClassName?: string;
  imgStyle?: React.CSSProperties;
  variant?: 'light' | 'dark' | 'iconOnly';
  size?: 'sm' | 'md' | 'lg' | 'responsive';
}

export const SafarLogo: React.FC<SafarLogoProps> = ({
  className = '',
  imgClassName = '',
  imgStyle,
  variant = 'light',
  size = 'responsive'
}) => {
  const isDark = variant === 'dark';
  const logoSrc = isDark ? '/logo-dark.svg' : '/logo.svg';

  // Sizing: Desktop 200x40px, Tablet ~180x36px, Mobile ~140x28px (maintains exact 5:1 ratio)
  const sizeClasses = {
    sm: 'w-[130px] h-[26px] sm:w-[150px] sm:h-[30px]',
    md: 'w-[160px] h-[32px] sm:w-[180px] sm:h-[36px]',
    lg: 'w-[200px] h-[40px] md:w-[240px] md:h-[48px]',
    responsive: 'w-[140px] h-[28px] sm:w-[165px] sm:h-[33px] md:w-[180px] md:h-[36px] lg:w-[200px] lg:h-[40px]'
  }[size] || 'w-[200px] h-[40px]';

  return (
    <div 
      className={`inline-flex items-center select-none cursor-pointer group ${className}`}
      title="Safar Trails — Travel With Trust"
    >
      <img
        src={logoSrc}
        alt="Safar Trails - Travel With Trust"
        className={`${sizeClasses} ${imgClassName} object-contain transition-transform duration-200 group-hover:scale-[1.01]`}
        style={imgStyle}
        width={200}
        height={40}
        loading="eager"
      />
    </div>
  );
};

export default SafarLogo;
