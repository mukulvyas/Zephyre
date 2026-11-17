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
    sm: 'w-7 h-7 p-1.5',
    md: 'w-9 h-9 p-2',
    lg: 'w-12 h-12 p-2.5',
  }[size];

  const textClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 min-w-0 ${className}`}>
      {/* Mint circle with blue 'Z' swirl vector logo from Google Stitch */}
      <div
        className={`${iconDimensions} rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 shadow-sm`}
        aria-hidden="true"
      >
        <svg
          className="w-full h-full text-primary"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path d="M4 6h12a4 4 0 0 1 0 8H8a4 4 0 0 0 0 8h12" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col min-w-0">
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
