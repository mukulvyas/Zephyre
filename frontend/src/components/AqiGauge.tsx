import React from 'react';
import { AQIReading } from '../types';
import { getAqiTheme } from '../lib/aqiTheme';
import { ArrowUp, Droplets, Wind, Shield } from 'lucide-react';

interface AqiGaugeProps {
  reading: AQIReading;
  directiveText?: string;
  className?: string;
}

export const AqiGauge: React.FC<AqiGaugeProps> = ({
  reading,
  directiveText,
  className = '',
}) => {
  const theme = getAqiTheme(reading.category);

  // Circumference for r=66: 2 * Math.PI * 66 = 414.69
  const circumference = 414;
  // Calculate dashoffset proportional to aqi (0 to 500)
  const clampedAqi = Math.max(0, Math.min(500, reading.aqi));
  const dynamicOffset = Math.round(circumference - (clampedAqi / 500) * circumference);

  return (
    <div
      className={`relative overflow-hidden rounded-24 bg-surface-container-lowest p-6 sm:p-8 shadow-md border border-outline-variant/20 ${className}`}
      role="region"
      aria-label="Air Quality Index Gauge"
    >
      {/* Warm Ambient Underglow Backdrop */}
      <div
        className={`absolute -top-12 -right-12 w-56 h-56 rounded-full blur-3xl pointer-events-none ${theme.cardGlow}`}
      />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-primary-fixed/20 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Radial SVG Gauge Container */}
        <div
          className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center my-2"
          role="progressbar"
          aria-valuenow={reading.aqi}
          aria-valuemin={0}
          aria-valuemax={500}
          aria-label={`Current AQI is ${reading.aqi}, categorized as ${reading.category}`}
        >
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background track */}
            <circle
              className="text-surface-container-high"
              cx="80"
              cy="80"
              fill="transparent"
              r="66"
              stroke="currentColor"
              strokeWidth="12"
            />
            {/* Active CPCB progress track */}
            <circle
              className={`${theme.trackColor} transition-all duration-1000 ease-out`}
              cx="80"
              cy="80"
              fill="transparent"
              r="66"
              stroke="currentColor"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={dynamicOffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Center Metrics */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs uppercase font-bold tracking-widest text-on-surface-variant">
              Live AQI
            </span>
            <span className="font-headline-lg text-4xl sm:text-5xl text-on-surface font-extrabold leading-none my-1 tracking-tight">
              {reading.aqi}
            </span>
            <span className={`text-xs font-semibold flex items-center gap-0.5 ${theme.badgeText}`}>
              <ArrowUp className="w-3.5 h-3.5" />
              {reading.category} Air
            </span>
          </div>
        </div>

        {/* Empathetic Badge: CPCB Category Standard */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.badgeBg} ${theme.badgeText} mt-2 shadow-xs`}
        >
          <Shield className="w-4 h-4 fill-current" />
          <span className="text-sm font-bold">{theme.cpcbLabel}</span>
        </div>

        {/* Actionable Clear Directive */}
        {directiveText && (
          <p className="text-sm sm:text-base text-on-surface font-semibold mt-3 max-w-md leading-relaxed">
            {directiveText}
          </p>
        )}

        {/* Atmospheric Micro Pills: PM2.5 and Humidity */}
        <div className="grid grid-cols-2 gap-3 w-full mt-5 pt-3 bg-surface-container-low/80 rounded-2xl p-3 border border-outline-variant/15">
          <div className="flex items-center justify-center gap-2.5 py-1 px-2 border-r border-outline-variant/20">
            <Wind className="w-5 h-5 text-primary" />
            <div className="flex flex-col text-left">
              <span className="text-[11px] text-on-surface-variant font-medium">PM2.5</span>
              <span className="text-sm font-bold text-on-surface">{reading.pm25} µg/m³</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2.5 py-1 px-2">
            <Droplets className="w-5 h-5 text-primary-container" />
            <div className="flex flex-col text-left">
              <span className="text-[11px] text-on-surface-variant font-medium">Humidity</span>
              <span className="text-sm font-bold text-on-surface">{reading.humidity || 68}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
