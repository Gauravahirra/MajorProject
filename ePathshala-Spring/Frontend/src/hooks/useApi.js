import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../utils/auth';

export function useApi() {
  const { user } = useAuth();
  const [cache, setCache] = useState(new Map());

  const request = useCallback(async (url, options = {}) => {
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    
    // Check cache first
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutes cache
        return cached.data;
      }
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(user?.token && { 'Authorization': `Bearer ${user.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache successful responses
      setCache(prev => new Map(prev).set(cacheKey, {
        data,
        timestamp: Date.now()
      }));

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }, [user?.token, cache]);

  const get = useCallback((url) => request(url), [request]);
  
  const post = useCallback((url, data) => request(url, {
    method: 'POST',
    body: JSON.stringify(data)
  }), [request]);
  
  const put = useCallback((url, data) => request(url, {
    method: 'PUT',
    body: JSON.stringify(data)
  }), [request]);
  
  const del = useCallback((url) => request(url, {
    method: 'DELETE'
  }), [request]);

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  return { get, post, put, delete: del, clearCache };
}

export function useApiCall(apiCall, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    execute();
  }, dependencies);

  const refetch = useCallback(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch };
} 