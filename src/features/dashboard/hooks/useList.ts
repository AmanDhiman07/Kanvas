import { useState, useCallback, useEffect } from 'react';
import { listClient } from '../infrastructure/api/list.client';
import type { CreateListRequest, List } from '../infrastructure/api/list.types';
import type { ApiError } from '../../../lib/http';

interface UseListReturn {
  lists: List[];
  loading: boolean;
  creating: boolean;
  error: ApiError | null;
  createList: (request: CreateListRequest) => Promise<boolean>;
  fetchLists: () => Promise<void>;
}

export function useList(): UseListReturn {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchLists = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const fetchedLists = await listClient.fetchLists();
      setLists(fetchedLists);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
    } finally {
      setLoading(false);
    }
  }, []);

  const createList = useCallback(async (request: CreateListRequest): Promise<boolean> => {
    setCreating(true);
    setError(null);

    try {
      const response = await listClient.createList(request);
      
      if (response && response.data && response.data.title) {
        // Refetch all lists to get the updated list with id and timestamps
        await fetchLists();
        return true;
      }
      
      return false;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      return false;
    } finally {
      setCreating(false);
    }
  }, [fetchLists]);

  // Fetch lists on mount
  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  return {
    lists,
    loading,
    creating,
    error,
    createList,
    fetchLists,
  };
}

