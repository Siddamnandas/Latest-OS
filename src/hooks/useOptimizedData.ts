'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiCache } from '@/lib/cache';

interface UseOptimizedDataOptions {
  cacheKey: string;
  cacheTtl?: number;
  refetchOnWindowFocus?: boolean;
}

export function useOptimizedData<T>(
  fetcher: () => Promise<T>,
  options: UseOptimizedDataOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check cache first
      const cached = apiCache.get<T>(options.cacheKey);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }
      
      // Fetch fresh data
      const result = await fetcher();
      apiCache.set(options.cacheKey, result, options.cacheTtl);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [fetcher, options.cacheKey, options.cacheTtl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Optimized refetch
  const refetch = useCallback(() => {
    apiCache.invalidate(options.cacheKey);
    return fetchData();
  }, [fetchData, options.cacheKey]);

  return { data, loading, error, refetch };
}