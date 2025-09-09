import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface LiveData {
  couple: {
    id: string;
    partner_a: string;
    partner_b: string;
    anniversary_date?: string;
    city?: string;
    st_coins?: number;
  };
  stats: {
    streak: number;
    coins: number;
    relationshipLevel: string;
    relationshipScore: number;
    totalSyncs: number;
    completedTasks: number;
    totalTasks: number;
    totalMemories: number;
    taskCompletionRate: number;
    lastSync?: string;
  };
  activity: {
    recentSyncs: Array<{
      id: string;
      partner: string;
      mood_score: number;
      energy_level: number;
      created_at: string;
    }>;
    activeTasks: Array<{
      id: string;
      title: string;
      assigned_to: string;
      priority: string;
      due_at?: string;
    }>;
    recentMemories: Array<{
      id: string;
      title: string;
      type: string;
      created_at: string;
    }>;
  };
  insights: Array<{
    type: 'strength' | 'opportunity' | 'milestone' | 'warning';
    title: string;
    description: string;
    confidence: number;
    actionable: boolean;
  }>;
  lastUpdated: string;
}

interface UseLiveDataReturn {
  data: LiveData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  isStale: boolean | null;
}

export function useLiveData(refreshInterval = 60000): UseLiveDataReturn {
  const { data: session } = useSession();
  const [data, setData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  // Consider data stale if older than 5 minutes
  const isStale = lastFetch && (Date.now() - lastFetch.getTime()) > 300000;

  const fetchLiveData = useCallback(async () => {
    if (!session?.user?.id) {
      setData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/couple/live-data');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const liveData: LiveData = await response.json();
      setData(liveData);
      setLastFetch(new Date());

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch live data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  const refresh = useCallback(async () => {
    await fetchLiveData();
  }, [fetchLiveData]);

  // Initial fetch on session change
  useEffect(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  // Set up periodic refresh
  useEffect(() => {
    if (!refreshInterval || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      if (session?.user?.id) {
        fetchLiveData();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, session?.user?.id, fetchLiveData]);

  return {
    data,
    loading,
    error,
    refresh,
    isStale,
  };
}
