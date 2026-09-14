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

  // Sizing: Maintains clean 560:135 (approx 4.15:1) ratio for full brand logo + tagline
  const sizeClasses = {
    sm: 'w-[130px] h-[31px] sm:w-[150px] sm:h-[36px]',
    md: 'w-[160px] h-[38px] sm:w-[185px] sm:h-[44px]',
    lg: 'w-[200px] h-[48px] md:w-[230px] md:h-[55px]',
    // The extra min-[360px] step keeps the header from overflowing 320px-wide
    // phones, where the logo plus four controls exceeded the viewport.
    responsive:
      'w-[112px] h-[27px] min-[360px]:w-[135px] min-[360px]:h-[33px] sm:w-[155px] sm:h-[37px] md:w-[175px] md:h-[42px] lg:w-[195px] lg:h-[47px]'
  }[size] || 'w-[195px] h-[47px]';

  return (
    <div
      className={`inline-flex items-center select-none cursor-pointer group ${className}`}
      title="Safar Trails — Travel with Trust"
    >
      <img
        src={logoSrc}
        alt="Safar Trails — Travel with Trust"
        className={`${sizeClasses} ${imgClassName} object-contain transition-transform duration-200 group-hover:scale-[1.01]`}
        style={imgStyle}
        width={560}
        height={135}
        loading="eager"
      />
    </div>
  );
};

export default SafarLogo;
