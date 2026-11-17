import React, { useState } from 'react';
import { ActionImpactBreakdown } from '../types';
import { TreePine, ChevronDown, ChevronUp, Sparkles, Check } from 'lucide-react';

interface ImpactCardProps {
  totalCo2Kg: number;
  streakDays: number;
  natureEquivalent: string;
  actionBreakdowns: ActionImpactBreakdown[];
  className?: string;
}

export const ImpactCard: React.FC<ImpactCardProps> = ({
  totalCo2Kg,
  streakDays,
  natureEquivalent,
  actionBreakdowns,
  className = '',
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [celebrated, setCelebrated] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCelebrate = () => {
    setCelebrated(true);
    setTimeout(() => setCelebrated(false), 3000);
  };

  const weekDays = [
    { day: 'Mon', short: 'M', done: true },
    { day: 'Tue', short: 'T', done: true },
    { day: 'Wed', short: 'W', done: true },
    { day: 'Thu', short: 'T', done: true, today: true },
    { day: 'Fri', short: 'F', done: true },
    { day: 'Sat', short: 'S', done: false },
    { day: 'Sun', short: 'S', done: false },
  ];

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* Hero Impact Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-fixed via-surface-container-low to-surface-container-lowest rounded-24 p-6 sm:p-8 shadow-sm border border-outline-variant/20">
        <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-secondary-fixed/40 blur-2xl pointer-events-none" />
        <div className="absolute -left-8 bottom-0 w-36 h-36 rounded-full bg-primary-fixed-dim/30 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/90 text-on-surface-variant text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Your choices today
            </span>
            <button
              type="button"
              onClick={handleCelebrate}
              className="inline-flex items-center gap-1.5 text-primary font-bold text-xs py-1.5 px-3 rounded-full bg-primary-fixed/80 hover:bg-primary-fixed transition active:scale-95 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{celebrated ? 'Awesome! 🌿' : 'Celebrate'}</span>
            </button>
          </div>

          <div className="pt-2 flex flex-col text-left">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-extrabold text-primary tracking-tight">
                {totalCo2Kg}
              </span>
              <span className="text-2xl font-bold text-primary">kg</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-on-surface mt-1">
              CO₂ prevented & particulate exposure reduced (estimate)
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Calculated against average city transit and unfiltered indoor exposure.
            </p>
          </div>

          {/* Fun Relatable Neem Tree Comparison Card */}
          <div className="mt-2 relative overflow-hidden rounded-2xl bg-gradient-to-r from-tertiary-fixed via-tertiary-fixed-dim/40 to-primary-fixed p-4 text-on-tertiary-fixed shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest/90 flex items-center justify-center flex-shrink-0 shadow-xs">
                <TreePine className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">
                  Nature Equivalent
                </span>
                <p className="text-xs sm:text-sm font-bold text-on-tertiary-fixed leading-snug">
                  {natureEquivalent}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Streak Card */}
      <section className="bg-surface-container-lowest rounded-24 p-6 shadow-sm border border-outline-variant/20 flex flex-col gap-4 text-left">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-on-surface">
              🔥 {streakDays} Clean-Air Days in a Row
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              You checked routines, took public transit, and kept the kids safe all week.
            </p>
          </div>
        </div>

        {/* 7-day pill indicator */}
        <div className="grid grid-cols-7 gap-2 pt-1">
          {weekDays.map((w, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border ${
                w.today
                  ? 'bg-secondary-fixed/30 border-secondary/50 font-bold'
                  : 'bg-surface-container-low border-transparent'
              }`}
            >
              <span className="text-xs text-on-surface-variant font-medium">{w.short}</span>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-xs ${
                  w.done
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {w.done ? <Check className="w-4 h-4 stroke-[3]" /> : '•'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Breakdown Cards with Choice -> Effect -> Number */}
      <section className="flex flex-col gap-3.5 text-left">
        <h3 className="text-base font-bold text-on-surface px-1">Action Breakdown</h3>

        {actionBreakdowns.map((action) => {
          const isExpanded = expandedId === action.action_id;
          return (
            <div
              key={action.action_id}
              className="bg-surface-container-lowest rounded-24 p-5 shadow-xs border border-outline-variant/20 flex flex-col gap-2.5 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs uppercase font-bold text-secondary tracking-wider">
                    {action.choice_made}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-on-surface mt-0.5">
                    {action.action_title}
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    {action.effect_description}
                  </p>
                </div>
                <div className="inline-flex px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-extrabold flex-shrink-0">
                  {action.number_highlight}
                </div>
              </div>

              {/* Expandable "How we calculated this" */}
              <div className="pt-2 border-t border-outline-variant/15">
                <button
                  type="button"
                  onClick={() => toggleExpand(action.action_id)}
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline focus:outline-none"
                >
                  <span>How we calculated this</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-2 p-3 rounded-xl bg-surface-container-low text-xs text-on-surface-variant space-y-1.5 border border-outline-variant/15">
                    <div>
                      <span className="font-semibold text-on-surface">Formula: </span>
                      <code className="text-xs bg-surface-container px-1 py-0.5 rounded font-mono">
                        {action.calculation.formula}
                      </code>
                    </div>
                    <div>
                      <span className="font-semibold text-on-surface">Assumption: </span>
                      <span>{action.calculation.assumption}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-on-surface">Verified Source: </span>
                      <span className="italic">{action.calculation.source_note}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
