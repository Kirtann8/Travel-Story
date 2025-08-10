import { useState, useEffect, useCallback } from 'react';
import { analyticsCache, withCache } from '../utils/cache';

// Custom hook for cached API calls
export const useCache = (key, fetchFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cachedFetch = useCallback(
    withCache(analyticsCache, key, fetchFn),
    [key, fetchFn]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await cachedFetch();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [cachedFetch, ...dependencies]);

  const refetch = useCallback(async () => {
    analyticsCache.delete(key);
    try {
      setLoading(true);
      setError(null);
      const result = await cachedFetch();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [key, cachedFetch]);

  return { data, loading, error, refetch };
};