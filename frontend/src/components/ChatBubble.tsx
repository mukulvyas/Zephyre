import React from 'react';
import { AskResponse } from '../types';
import { AlertCircle, Lightbulb, CheckCircle2, ShieldAlert } from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text?: string;
  response?: AskResponse;
  timestamp: string;
}

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  if (message.sender === 'user') {
    return (
      <div className="flex justify-end pl-10">
        <div className="bg-primary text-on-primary rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs max-w-sm text-left">
          <p className="text-sm sm:text-base leading-snug">{message.text}</p>
          <span className="block text-[10px] text-primary-fixed text-right mt-1.5 opacity-80">
            {message.timestamp}
          </span>
        </div>
      </div>
    );
  }

  const res = message.response;
  if (!res) return null;

  return (
    <div className="flex flex-col gap-2 pr-2 sm:pr-8 text-left">
      <div className="bg-surface-container-lowest rounded-24 p-5 sm:p-6 shadow-sm border border-outline-variant/20 flex flex-col gap-3.5">
        {/* Verdict Badge Row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold ${
              res.needs_doctor
                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                : res.verdict === 'avoid'
                ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                : res.verdict === 'be_careful'
                ? 'bg-amber-100 text-amber-900'
                : 'bg-secondary-container text-on-secondary-container'
            }`}
          >
            {res.needs_doctor ? (
              <ShieldAlert className="w-4 h-4 text-rose-700" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{res.verdict_label}</span>
          </div>

          <span className="text-[11px] text-on-surface-variant flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
            CPCB Ground-Truth Standard
          </span>
        </div>

        {/* Doctor Medical Alert if flagged */}
        {res.needs_doctor && res.doctor_advice && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-xs text-rose-950 font-medium leading-relaxed">
            {res.doctor_advice}
          </div>
        )}

        {/* Reason (max 2 concise sentences) */}
        <div className="bg-surface-container-low rounded-2xl p-3.5 flex flex-col gap-1 border border-outline-variant/15">
          <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
            {res.reason}
          </p>
        </div>

        {/* Practical Alternative */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container border border-outline-variant/15">
          <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary flex-shrink-0 shadow-xs mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface">Suggested Alternative</span>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 leading-snug">
              {res.suggestion}
            </p>
          </div>
        </div>

        {/* Impact Fact: Choice -> Effect -> Number */}
        <div className="flex items-center gap-2 bg-secondary-fixed/30 p-3 rounded-2xl text-xs text-on-surface border border-secondary/20">
          <span className="font-bold text-secondary flex-shrink-0">💡 Impact:</span>
          <span className="leading-tight">{res.impact}</span>
        </div>

        {/* Safer Time Window (if provided) */}
        {res.safer_time && (
          <span className="text-[11px] text-on-surface-variant italic px-1">
            ⏱️ Recommended safer window: {res.safer_time}
          </span>
        )}
      </div>
    </div>
  );
};
