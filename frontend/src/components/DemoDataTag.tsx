import React from 'react';

export const DemoDataTag: React.FC<{ label?: string; className?: string }> = ({
  label = 'Demo data',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container-high text-on-surface-variant border border-outline-variant/30 ${className}`}
      title="Simulated representative benchmark for transparent demonstration"
    >
      {label}
    </span>
  );
};
