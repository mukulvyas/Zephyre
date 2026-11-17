import React from 'react';
import { ChecklistAction } from '../types';
import { Check } from 'lucide-react';

interface ChecklistItemProps {
  action: ChecklistAction;
  isCompleted: boolean;
  onToggle: () => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  action,
  isCompleted,
  onToggle,
}) => {
  return (
    <div
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onToggle();
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={isCompleted}
      className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer shadow-xs border transition-all duration-200 ${
        isCompleted
          ? 'bg-secondary-container/40 border-secondary/30 text-on-surface'
          : 'bg-surface-container-lowest border-outline-variant/20 hover:bg-surface-container-low text-on-surface'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        {/* Checkbox button */}
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            isCompleted
              ? 'bg-secondary text-on-secondary shadow-xs scale-105'
              : 'bg-surface-container-high text-transparent group-hover:border-primary'
          }`}
          aria-hidden="true"
        >
          <Check className="w-4 h-4 stroke-[3]" />
        </div>

        <div className="flex flex-col min-w-0 text-left">
          <span
            className={`text-sm sm:text-base leading-snug transition-colors ${
              isCompleted
                ? 'line-through text-on-surface-variant font-normal'
                : 'font-semibold text-on-surface'
            }`}
          >
            {action.title}
          </span>
          <span className="text-[11px] text-on-surface-variant mt-0.5 line-clamp-1 opacity-80">
            {action.impact_statement}
          </span>
        </div>
      </div>

      <span className="text-2xl flex-shrink-0 ml-2" aria-hidden="true">
        {action.icon_emoji}
      </span>
    </div>
  );
};
