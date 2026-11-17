import React from 'react';

export const SkeletonCard: React.FC<{ height?: string; className?: string }> = ({
  height = 'h-48',
  className = '',
}) => {
  return (
    <div
      className={`w-full rounded-24 bg-surface-container-low animate-pulse p-6 ${height} ${className}`}
      aria-busy="true"
      aria-label="Loading content"
    >
      <div className="h-4 bg-surface-container-high rounded-full w-1/3 mb-4" />
      <div className="h-6 bg-surface-container-high rounded-full w-2/3 mb-3" />
      <div className="h-4 bg-surface-container-high rounded-full w-1/2" />
    </div>
  );
};
