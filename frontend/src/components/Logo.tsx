import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  }[size];

  const svgDimensions = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }[size];

  const textClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 min-w-0 ${className}`}>
      {/* Exact Mint Circle with Sky-Blue Wind-Swirl "Z" from Google Stitch */}
      <div
        className={`${iconDimensions} rounded-full bg-emerald-100 flex items-center justify-center text-sky-600 flex-shrink-0 shadow-sm`}
        aria-hidden="true"
      >
        <svg
          className={svgDimensions}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
          viewBox="0 0 24 24"
        >
          <path d="M7 8.5C8 6.8 11 6.5 13.5 7.5C16 8.5 17 10 16 11.5L8.5 15.5C7.2 16.2 8.5 17.5 11 17.5C13.5 17.5 15.8 16.5 17 15.5" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col min-w-0 text-left">
          <span className={`font-headline-sm ${textClasses} text-primary font-bold tracking-tight truncate`}>
            Zephyre
          </span>
          <span className="text-[11px] text-on-surface-variant font-medium truncate leading-tight">
            A gentle breeze for your family
          </span>
        </div>
      )}
    </div>
  );
};
