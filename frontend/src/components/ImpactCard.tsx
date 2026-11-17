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

      {/* Visual Lifestyle Story Card matching Stitch */}
      <section className="bg-surface-container-lowest rounded-24 overflow-hidden shadow-sm flex flex-col border border-outline-variant/20">
        <div className="relative w-full h-44">
          <img
            className="w-full h-full object-cover"
            alt="Joyful multi-generational Indian family walking happily in an urban botanical park in the early morning sunlight"
            src="https://images.unsplash.com/photo-1609234656388-0ff363383899?w=800&auto=format&fit=crop&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/20 to-transparent flex items-end p-5">
            <span className="text-surface-container-lowest text-sm sm:text-base font-bold">
              Safe family outings start with quiet awareness
            </span>
          </div>
        </div>
      </section>

      {/* Clean Rounded Weekly Bar Chart matching Stitch */}
      <section className="bg-surface-container-lowest rounded-24 p-5 sm:p-6 shadow-sm border border-outline-variant/20 flex flex-col gap-4 text-left">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-on-surface">Family Clean Hours</h3>
            <p className="text-xs text-on-surface-variant">Hours spent in purified or protected air</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>Peak: 19 hrs</span>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="w-full pt-4 pb-1">
          <div className="flex items-end justify-between gap-2 h-40 px-1">
            {/* Mon */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[11px] text-on-surface-variant font-medium">14h</span>
              <div className="w-full bg-primary-fixed rounded-t-full" style={{ height: '60%' }} />
              <span className="text-[11px] text-on-surface-variant font-medium">Mon</span>
            </div>
            {/* Tue */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[11px] text-on-surface-variant font-medium">16h</span>
              <div className="w-full bg-primary-fixed rounded-t-full" style={{ height: '72%' }} />
              <span className="text-[11px] text-on-surface-variant font-medium">Tue</span>
            </div>
            {/* Wed */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[11px] text-on-surface-variant font-medium">15h</span>
              <div className="w-full bg-primary-fixed rounded-t-full" style={{ height: '66%' }} />
              <span className="text-[11px] text-on-surface-variant font-medium">Wed</span>
            </div>
            {/* Thu (Peak) */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end relative">
              <span className="absolute -top-6 text-[10px] text-secondary font-bold bg-secondary-fixed/70 px-1.5 py-0.5 rounded-full">
                Top
              </span>
              <span className="text-[11px] text-secondary font-bold">19h</span>
              <div className="w-full bg-secondary rounded-t-full shadow-sm scale-105" style={{ height: '92%' }} />
              <span className="text-[11px] text-secondary font-bold">Thu</span>
            </div>
            {/* Fri */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[11px] text-on-surface-variant font-medium">17h</span>
              <div className="w-full bg-secondary-fixed-dim rounded-t-full" style={{ height: '78%' }} />
              <span className="text-[11px] text-on-surface-variant font-medium">Fri</span>
            </div>
            {/* Sat */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[11px] text-outline">--</span>
              <div className="w-full bg-surface-container-high rounded-t-full" style={{ height: '15%' }} />
              <span className="text-[11px] text-outline font-medium">Sat</span>
            </div>
            {/* Sun */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[11px] text-outline">--</span>
              <div className="w-full bg-surface-container-high rounded-t-full" style={{ height: '15%' }} />
              <span className="text-[11px] text-outline font-medium">Sun</span>
            </div>
          </div>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/15 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary-fixed" />
            <span>Standard Day</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span className="w-3 h-3 rounded-full bg-secondary" />
            <span>Peak Protection (Thu)</span>
          </div>
        </div>
      </section>

      {/* Encouraging Footer Note matching Stitch */}
      <footer className="p-5 rounded-24 bg-surface-container flex items-center gap-3.5 text-on-surface border border-outline-variant/15 text-left">
        <div className="w-10 h-10 min-w-[40px] rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs">
          <span className="material-symbols-outlined text-[22px] text-primary">favorite</span>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-bold text-on-surface leading-snug">
            Every small switch adds up to healthy lungs for your family.
          </p>
          <span className="text-xs text-on-surface-variant mt-0.5">
            From closed windows at dusk to warm steam inhalations, you are keeping them thriving.
          </span>
        </div>
      </footer>
    </div>
  );
};
