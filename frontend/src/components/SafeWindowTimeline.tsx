import React from 'react';
import { SafeWindow } from '../types';
import { Sun, AlertTriangle, Clock } from 'lucide-react';

interface SafeWindowTimelineProps {
  safeWindow: SafeWindow;
  cautionNote?: string;
  className?: string;
}

export const SafeWindowTimeline: React.FC<SafeWindowTimelineProps> = ({
  safeWindow,
  cautionNote = 'Avoid morning walks or park play before 11:00 AM today.',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col gap-3 rounded-24 bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/20 ${className}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">
            <Clock className="w-4 h-4" />
          </span>
          <h2 className="text-base font-bold text-on-surface">Outdoor Windows</h2>
        </div>
        <span className="text-[11px] font-bold text-tertiary-container bg-tertiary-fixed px-3 py-1 rounded-full uppercase tracking-wider">
          Forecast
        </span>
      </div>

      {/* Golden Highlight Window Banner */}
      <div className="flex items-start gap-3 rounded-2xl bg-surface-container-high/60 p-3.5 border border-outline-variant/20">
        <Sun className="w-6 h-6 text-tertiary mt-0.5 flex-shrink-0" />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-on-surface">
            Safest window: {safeWindow.start_time} – {safeWindow.end_time}
          </span>
          <span className="text-xs text-on-surface-variant leading-relaxed">
            {safeWindow.reason}
          </span>
        </div>
      </div>

      {/* 24-hr visual spark bar */}
      <div className="flex flex-col gap-1.5 mt-2">
        <div className="flex justify-between text-on-surface-variant text-[11px] font-semibold px-1">
          <span>8 AM</span>
          <span>11 AM</span>
          <span className="text-secondary font-bold">3 PM (Best)</span>
          <span>7 PM</span>
          <span>11 PM</span>
        </div>

        {/* Segmented Bar Visualization */}
        <div
          className="h-4 w-full flex gap-1 rounded-full overflow-hidden p-0.5 bg-surface-container"
          aria-label="Hourly air quality segments"
        >
          {/* Morning severe */}
          <div className="h-full flex-1 rounded-full bg-error" title="8 AM: 410 AQI (Severe)" />
          <div className="h-full flex-1 rounded-full bg-error" title="10 AM: 390 AQI (Very Poor)" />
          {/* Midday improving */}
          <div className="h-full flex-1 rounded-full bg-amber-500" title="12 PM: 320 AQI (Poor)" />
          {/* 2-4 PM best window */}
          <div
            className="h-full flex-[1.6] rounded-full bg-secondary shadow-sm ring-2 ring-surface-container-lowest"
            title={`Safest Window: ~${safeWindow.average_aqi} AQI`}
          />
          {/* Evening inversion rising */}
          <div className="h-full flex-1 rounded-full bg-amber-500" title="6 PM: 310 AQI (Poor)" />
          <div className="h-full flex-1 rounded-full bg-error" title="9 PM: 380 AQI (Very Poor)" />
        </div>
      </div>

      {/* Cautionary note */}
      {cautionNote && (
        <div className="flex items-center gap-2 mt-1 px-1 text-on-surface-variant text-xs">
          <AlertTriangle className="w-4 h-4 text-error flex-shrink-0" />
          <span>{cautionNote}</span>
        </div>
      )}
    </div>
  );
};
