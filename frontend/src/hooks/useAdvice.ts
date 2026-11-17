import { useState, useEffect, useCallback } from 'react';
import { DailyAdviceResponse, UserProfile } from '../types';
import { getDailyAdvice } from '../api/client';
import { loadTodayChecklist, saveTodayChecklist } from '../lib/storage';

export function useAdvice(profile: UserProfile) {
  const [advice, setAdvice] = useState<DailyAdviceResponse | null>(null);
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(loadTodayChecklist);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAdvice = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDailyAdvice(profile);
      setAdvice(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch daily advice');
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    refreshAdvice();
  }, [refreshAdvice]);

  const toggleTask = useCallback((taskId: string) => {
    setCheckedTasks((prev) => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      saveTodayChecklist(next);
      return next;
    });
  }, []);

  return {
    advice,
    checkedTasks,
    toggleTask,
    loading,
    error,
    refreshAdvice,
  };
}
