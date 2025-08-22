import { useState, useEffect } from 'react';

interface LiveData {
  couple: {
    id: string;
    partner_a: string;
    partner_b: string;
    anniversary: string;
    city: string;
    region: string;
    language: string;
  };
  stats: {
    streak: number;
    coins: number;
    relationshipLevel: string;
    relationshipEmoji: string;
    totalSyncs: number;
    completedTasks: number;
    totalRituals: number;
    totalMemories: number;
  };
  recentActivity: {
    syncs: Array<{
      id: string;
      partner: string;
      mood: number;
      energy: number;
      tags: string[];
      date: string;
    }>;
    tasks: Array<{
      id: string;
      title: string;
      status: string;
      assignedTo: string;
      category: string;
      dueAt: string | null;
      completedAt: string | null;
    }>;
    memories: Array<{
      id: string;
      title: string;
      type: string;
      date: string;
      sentiment: string;
    }>;
  };
  rasaBalance: {
    play: number;
    duty: number;
    balance: number;
  };
  children: Array<{
    id: string;
    name: string;
    age: number;
  }>;
}

export function useLiveData() {
  const [data, setData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/couple/live-data');
      
      if (!response.ok) {
        throw new Error('Failed to fetch live data');
      }
      
      const liveData = await response.json();
      setData(liveData);
      setError(null);
    } catch (err) {
      console.error('Error fetching live data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Fallback to demo data if API fails
      setData({
        couple: {
          id: 'demo',
          partner_a: 'Arjun',
          partner_b: 'Priya',
          anniversary: '2022-02-14',
          city: 'Mumbai',
          region: 'north-india',
          language: 'hindi'
        },
        stats: {
          streak: 7,
          coins: 250,
          relationshipLevel: 'Good Partners',
          relationshipEmoji: '💗',
          totalSyncs: 15,
          completedTasks: 8,
          totalRituals: 5,
          totalMemories: 12
        },
        recentActivity: {
          syncs: [],
          tasks: [],
          memories: []
        },
        rasaBalance: {
          play: 35,
          duty: 45,
          balance: 20
        },
        children: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchLiveData
  };
}