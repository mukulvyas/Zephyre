import React from 'react';
import { MemberRiskGuidance } from '../types';
import { Shield, CheckCircle2 } from 'lucide-react';

interface FamilyCardProps {
  guidance: MemberRiskGuidance;
  compact?: boolean;
  className?: string;
}

export const FamilyCard: React.FC<FamilyCardProps> = ({
  guidance,
  compact = false,
  className = '',
}) => {
  // Emoji avatar by relationship/age
  const getAvatar = () => {
    if (guidance.age <= 10) return '👦🏽';
    if (guidance.age >= 60) return '👵🏽';
    return '👨🏽';
  };

  if (compact) {
    return (
      <div
        className={`flex-shrink-0 w-44 rounded-2xl bg-surface-container-lowest p-3.5 flex flex-col gap-2.5 shadow-sm border border-outline-variant/20 ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-lg flex-shrink-0">
            {getAvatar()}
          </div>
          <div className="flex flex-col min-w-0 text-left">
            <span className="text-sm font-bold text-on-surface truncate">
              {guidance.member_name}
            </span>
            <span className="text-[11px] text-on-surface-variant truncate">
              {guidance.age}y • {guidance.relationship}
            </span>
          </div>
        </div>

        <div
          className={`rounded-full px-2.5 py-1 text-center text-xs font-semibold flex items-center justify-center gap-1.5 truncate ${
            guidance.verdict === 'avoid'
              ? 'bg-error-container text-on-error-container'
              : guidance.verdict === 'be_careful'
              ? 'bg-tertiary-fixed text-on-tertiary-fixed'
              : 'bg-secondary-container text-on-secondary-container'
          }`}
        >
          <Shield className="w-3.5 h-3.5 fill-current flex-shrink-0" />
          <span className="truncate">{guidance.verdict_label}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-surface-container-lowest rounded-24 p-5 sm:p-6 shadow-sm flex flex-col gap-3.5 border border-outline-variant/20 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-2xl shadow-xs flex-shrink-0">
            {getAvatar()}
          </div>
          <div className="flex flex-col min-w-0 text-left">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-on-surface truncate">
                {guidance.member_name}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed">
                {guidance.relationship}, {guidance.age}y
              </span>
            </div>
            <span className="text-xs text-on-surface-variant truncate mt-0.5">
              Risk score: {guidance.risk_score}/100
            </span>
          </div>
        </div>

        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
            guidance.verdict === 'avoid'
              ? 'bg-error-container text-on-error-container'
              : guidance.verdict === 'be_careful'
              ? 'bg-tertiary-fixed text-on-tertiary-fixed'
              : 'bg-secondary-container text-on-secondary-container'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-current" />
          <span>{guidance.verdict_label}</span>
        </div>
      </div>

      {/* Advisory Body */}
      <div className="bg-surface-container-low rounded-2xl p-3.5 flex flex-col gap-1 text-left border border-outline-variant/15">
        <span className="text-xs font-bold text-primary">Guidance Directive</span>
        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          {guidance.action_directive}
        </p>
      </div>

      {/* Reason bullet points */}
      {guidance.reasons.length > 0 && (
        <ul className="text-xs text-on-surface-variant list-disc pl-4 space-y-1 text-left opacity-90">
          {guidance.reasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-outline-variant/15 text-xs text-on-surface-variant">
        <span>Sanctuary shield active</span>
        <CheckCircle2 className="w-4 h-4 text-secondary" />
      </div>
    </div>
  );
};
