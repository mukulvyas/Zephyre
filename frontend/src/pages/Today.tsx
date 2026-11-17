import React, { useState } from 'react';
import { UserProfile } from '../types';
import { useAdvice } from '../hooks/useAdvice';
import { AqiGauge } from '../components/AqiGauge';
import { SafeWindowTimeline } from '../components/SafeWindowTimeline';
import { FamilyCard } from '../components/FamilyCard';
import { ChecklistItem } from '../components/ChecklistItem';
import { SkeletonCard } from '../components/SkeletonCard';
import { ErrorState } from '../components/ErrorState';
import { MapPin, Clock, Share2, Sparkles, CheckCheck } from 'lucide-react';

interface TodayProps {
  profile: UserProfile;
}

export const Today: React.FC<TodayProps> = ({ profile }) => {
  const { advice, checkedTasks, toggleTask, loading, error, refreshAdvice } = useAdvice(profile);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (!advice) return;
    const text = `🌿 Zephyre Air Quality Plan for ${profile.location.name}:\n` +
      `Live AQI: ${advice.aqi_reading.aqi} (${advice.aqi_reading.category})\n` +
      `Safest Window: ${advice.safe_window.start_time} – ${advice.safe_window.end_time}\n` +
      `Top Advice: ${advice.one_line_instruction}\n` +
      `Household Sanctuary Clean Score: ${advice.household_clean_score}/100`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading && !advice) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full pb-20 pt-4">
        <SkeletonCard height="h-24" />
        <SkeletonCard height="h-80" />
        <SkeletonCard height="h-44" />
      </div>
    );
  }

  if (error && !advice) {
    return (
      <div className="max-w-2xl mx-auto w-full pt-8">
        <ErrorState message={error} onRetry={refreshAdvice} />
      </div>
    );
  }

  if (!advice) return null;

  const totalTasks = advice.checklist.length;
  const completedCount = advice.checklist.filter((act) => checkedTasks[act.id]).length;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full pb-24 text-left">
      {/* Greeting Header */}
      <div className="flex flex-col gap-1 px-1">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container shadow-xs">
            <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase">
              {advice.aqi_reading.category.toUpperCase()} AIR
            </span>
          </div>
          <span className="text-xs text-on-surface-variant flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {advice.aqi_reading.data_freshness_text || '12m ago'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
          {advice.greeting}
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          <span>{profile.location.name}</span>
        </p>
      </div>

      {/* Hero AQI Radial Gauge Card */}
      <AqiGauge
        reading={advice.aqi_reading}
        directiveText={advice.one_line_instruction}
      />

      {/* Best Time to Go Out Forecast Card */}
      <SafeWindowTimeline
        safeWindow={advice.safe_window}
      />

      {/* Family Safety Overview Row */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-on-surface">Family Care Guidance</h2>
          <span className="text-xs text-primary font-bold">
            {advice.family_guidance.length} active shields
          </span>
        </div>

        {/* Horizontally scrollable row on mobile */}
        <div className="flex gap-3 overflow-x-auto pb-1.5 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          {advice.family_guidance.map((guidance) => (
            <FamilyCard
              key={guidance.member_id}
              guidance={guidance}
              compact={true}
            />
          ))}
        </div>
      </section>

      {/* Do Today Checklist */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-on-surface">Do Today</h2>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold transition-colors ${
                completedCount === totalTasks
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-secondary-container text-on-secondary-container'
              }`}
            >
              {completedCount === totalTasks
                ? 'All done! Pure calm 🌿'
                : `${completedCount} of ${totalTasks} done`}
            </span>
          </div>
          <span className="text-xs text-on-surface-variant">Tap to check</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {advice.checklist.map((action) => (
            <ChecklistItem
              key={action.id}
              action={action}
              isCompleted={Boolean(checkedTasks[action.id])}
              onToggle={() => toggleTask(action.id)}
            />
          ))}
        </div>
      </section>

      {/* Reassuring Lifestyle Banner */}
      <div className="rounded-24 bg-surface-container-low p-4 sm:p-5 flex items-center gap-3.5 border border-outline-variant/20 shadow-xs">
        <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs flex-shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-on-surface">You've got this handled</span>
          <span className="text-xs text-on-surface-variant leading-snug">
            {advice.lifestyle_banner}
          </span>
        </div>
      </div>

      {/* Share Today's Plan Button */}
      <button
        type="button"
        onClick={handleShare}
        className="w-full py-3.5 px-4 rounded-24 bg-surface-container-lowest border border-outline-variant/30 text-on-surface hover:bg-surface-container text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition active:scale-98 shadow-xs"
      >
        {copied ? (
          <>
            <CheckCheck className="w-4 h-4 text-secondary" />
            <span className="text-secondary">Summary copied to clipboard (ready for WhatsApp)!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 text-primary" />
            <span>Share today's clean-air plan</span>
          </>
        )}
      </button>
    </div>
  );
};
