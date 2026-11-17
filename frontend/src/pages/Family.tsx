import React from 'react';
import { UserProfile } from '../types';
import { useAdvice } from '../hooks/useAdvice';
import { FamilyCard } from '../components/FamilyCard';
import { DemoDataTag } from '../components/DemoDataTag';
import { Shield, Sparkles, CheckCircle, Trash2 } from 'lucide-react';

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

      {/* Room Air Microclimate Estimates (Tagged "Demo data" for honesty) */}
      <section className="bg-surface-container-lowest rounded-24 p-5 sm:p-6 shadow-sm border border-outline-variant/20 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-on-surface">Indoor Sanctuary Air (Estimated)</h3>
          <DemoDataTag label="Demo benchmark" />
        </div>
        <p className="text-xs text-on-surface-variant">
          Simulated room filtration estimates based on standard residential air exchange rates.
        </p>

        <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
          <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/15">
            <span className="text-xs text-on-surface-variant font-medium block">Living Room</span>
            <span className="text-base font-bold text-secondary mt-0.5 block">32 µg/m³</span>
            <span className="text-[10px] text-on-surface-variant">Clean buffer</span>
          </div>
          <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/15">
            <span className="text-xs text-on-surface-variant font-medium block">Kids Bedroom</span>
            <span className="text-base font-bold text-secondary mt-0.5 block">24 µg/m³</span>
            <span className="text-[10px] text-on-surface-variant">HEPA filter</span>
          </div>
          <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/15">
            <span className="text-xs text-on-surface-variant font-medium block">Kitchen</span>
            <span className="text-base font-bold text-amber-600 mt-0.5 block">42 µg/m³</span>
            <span className="text-[10px] text-on-surface-variant">Exhaust active</span>
          </div>
        </div>
      </section>

      {/* Delete / Clear Data Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Delete all local data and reset Zephyre to default?')) {
              onResetData();
            }
          }}
          className="w-full py-3 px-4 rounded-24 bg-surface-container-low hover:bg-rose-50 text-error text-xs font-bold border border-outline-variant/30 flex items-center justify-center gap-2 transition active:scale-98"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete My Data (Clear Local Storage)</span>
        </button>
      </div>
    </div>
  );
};
