import React, { useEffect, useState } from 'react';
import { UserProfile, ImpactReportResponse } from '../types';
import { getImpactReport } from '../api/client';
import { loadTodayChecklist } from '../lib/storage';
import { ImpactCard } from '../components/ImpactCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { ErrorState } from '../components/ErrorState';

interface ImpactProps {
  profile: UserProfile;
}

export const Impact: React.FC<ImpactProps> = () => {
  const [report, setReport] = useState<ImpactReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImpact = async () => {
    setLoading(true);
    setError(null);
    try {
      const checked = loadTodayChecklist();
      const activeIds = Object.keys(checked).filter((k) => checked[k]);
      const data = await getImpactReport(activeIds);
      setReport(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load impact report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImpact();
  }, []);

  if (loading && !report) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full pb-20 pt-4">
        <SkeletonCard height="h-64" />
        <SkeletonCard height="h-32" />
        <SkeletonCard height="h-48" />
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="max-w-2xl mx-auto w-full pt-8">
        <ErrorState message={error} onRetry={fetchImpact} />
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="max-w-2xl mx-auto w-full pb-24 text-left">
      <ImpactCard
        totalCo2Kg={report.total_co2_avoided_kg}
        streakDays={report.streak_clean_days}
        natureEquivalent={report.nature_equivalent}
        actionBreakdowns={report.action_breakdowns}
      />
    </div>
  );
};
