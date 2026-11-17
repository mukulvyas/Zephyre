import React from 'react';
import { UserProfile } from '../types';
import { useAdvice } from '../hooks/useAdvice';
import { FamilyCard } from '../components/FamilyCard';
import { Shield, Sparkles, CheckCircle } from 'lucide-react';

interface FamilyProps {
  profile: UserProfile;
  onResetData: () => void;
}

export const Family: React.FC<FamilyProps> = ({ profile, onResetData }) => {
  const { advice } = useAdvice(profile);

  const cleanScore = advice?.household_clean_score || 88;
  const circumference = 251.2;
  const scoreOffset = circumference - (cleanScore / 100) * circumference;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full pb-24 text-left">
      {/* Header Section */}
      <div className="flex flex-col gap-1.5 px-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container w-fit text-on-secondary-container">
          <Shield className="w-3.5 h-3.5 fill-current" />
          <span className="text-xs font-bold">Safe Haven Active</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-0.5">
          My Family
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant">
          Personalized air protection for your loved ones
        </p>
      </div>

      {/* Household Clean-Air Score Card */}
      <div className="relative overflow-hidden bg-surface-container-lowest rounded-24 p-6 sm:p-7 shadow-md border border-outline-variant/20 flex flex-col gap-4">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-secondary-fixed/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary-fixed/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Great Protection Today</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-on-surface tracking-tight mt-1">
              Household Clean Score
            </h2>
            <p className="text-xs text-on-surface-variant">
              Overall sanctuary health index based on today's active habits
            </p>
          </div>

          {/* Circular Progress Ring */}
          <div
            className="relative flex-shrink-0 flex items-center justify-center w-24 h-24"
            role="progressbar"
            aria-valuenow={cleanScore}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Household Clean Score is ${cleanScore} out of 100`}
          >
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-surface-container"
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                stroke="currentColor"
                strokeWidth="9"
              />
              <circle
                className="text-secondary transition-all duration-1000 ease-out"
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                stroke="currentColor"
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={scoreOffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-on-surface leading-none">{cleanScore}</span>
              <span className="text-[10px] text-on-surface-variant font-bold leading-none mt-1">
                / 100
              </span>
            </div>
          </div>
        </div>

        {/* Reassuring Summary Banner */}
        <div className="relative z-10 flex items-start gap-3 p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/15 text-xs text-on-surface leading-relaxed">
          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <span>
            HEPA air purifiers active in sleeping rooms, N95 masks ready in bags, and kitchen exhaust verified.
          </span>
        </div>
      </div>

      {/* Family Members Section */}
      <section className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-on-surface">Family Members</h2>
          <span className="text-xs text-primary font-bold">
            {profile.members.length} Active Profiles
          </span>
        </div>

        <div className="flex flex-col gap-3.5">
          {advice?.family_guidance.map((guidance) => (
            <FamilyCard key={guidance.member_id} guidance={guidance} />
          ))}
        </div>
      </section>

      {/* Room Air Estimates Section matching Stitch exactly */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">sensors</span>
            <h2 className="text-base font-bold text-on-surface">Room Air Estimates</h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium flex-shrink-0">
              Demo data
            </span>
          </div>
          <span className="text-xs text-on-surface-variant">Live updates • Just now</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {/* Living Room */}
          <div className="bg-surface-container-lowest rounded-24 p-4 shadow-xs border border-outline-variant/15 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 text-on-surface-variant">
                <span className="material-symbols-outlined text-[22px]">weekend</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-on-surface truncate">Living Room</span>
                <span className="text-xs text-on-surface-variant truncate">Purifier on</span>
              </div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-secondary">52</span>
                <span className="text-xs text-on-surface-variant">AQI</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">
                Satisfactory / Good
              </span>
            </div>
          </div>

          {/* Kids Room */}
          <div className="bg-surface-container-lowest rounded-24 p-4 shadow-xs border border-outline-variant/15 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center flex-shrink-0 text-on-secondary-fixed">
                <span className="material-symbols-outlined text-[22px]">toys</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-on-surface truncate">Kids' Room</span>
                <span className="text-xs text-on-surface-variant truncate">Purifier on</span>
              </div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-secondary">34</span>
                <span className="text-xs text-on-surface-variant">AQI</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
                Good
              </span>
            </div>
          </div>

          {/* Balcony */}
          <div className="bg-surface-container-lowest rounded-24 p-4 shadow-xs border border-outline-variant/15 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center flex-shrink-0 text-on-error-container">
                <span className="material-symbols-outlined text-[22px]">balcony</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-on-surface truncate">Balcony</span>
                <span className="text-xs text-error truncate font-medium">Outdoor</span>
              </div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-error">384</span>
                <span className="text-xs text-on-surface-variant">AQI</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-error-container text-error font-semibold">
                Very Poor
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Add Family Member Action Button matching Stitch */}
      <div className="pt-1 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => alert('Add Family Member: Enter details in your profile settings.')}
          className="w-full h-12 bg-primary text-on-primary rounded-full text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] hover:bg-primary-container"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Add Family Member</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (window.confirm('Delete all local data and reset Zephyre to default?')) {
              onResetData();
            }
          }}
          className="w-full py-2.5 text-xs text-error hover:underline opacity-80"
        >
          Delete My Data (Clear Storage)
        </button>
      </div>
    </div>
  );
};
