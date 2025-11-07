import { useState, useCallback } from 'react';
import { httpClient, type ApiResponse, type ApiError } from '../lib/http';

interface UseApiOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: ApiError) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: (endpoint: string, options?: RequestInit) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = unknown>(options?: UseApiOptions): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(
    async (endpoint: string, requestOptions?: RequestInit): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const method = requestOptions?.method || 'GET';
        let response: ApiResponse<T>;

        if (method === 'GET' || method === 'DELETE') {
          response = await httpClient[method.toLowerCase() as 'get' | 'delete']<T>(
            endpoint,
            requestOptions
          );
        } else {
          const body = requestOptions?.body ? JSON.parse(requestOptions.body as string) : undefined;
          response = await httpClient[method.toLowerCase() as 'post' | 'put']<T>(
            endpoint,
            body,
            requestOptions
          );
        }

        const result = response.data as T;
        setData(result);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        options?.onError?.(apiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

