import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`rounded-24 bg-rose-50 border border-rose-200 p-6 flex flex-col items-center text-center gap-3 text-rose-950 ${className}`}
    >
      <AlertCircle className="w-8 h-8 text-rose-600" />
      <span className="text-sm font-semibold">{message}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition active:scale-95 shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
