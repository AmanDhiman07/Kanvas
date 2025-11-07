import { useState, useCallback } from 'react';
import { listClient } from '../infrastructure/api/list.client';
import type { CreateListRequest, List } from '../infrastructure/api/list.types';
import type { ApiError } from '../../../lib/http';

interface UseListReturn {
  lists: List[];
  loading: boolean;
  error: ApiError | null;
  createList: (request: CreateListRequest) => Promise<boolean>;
}

export function useList(): UseListReturn {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createList = useCallback(async (request: CreateListRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await listClient.createList(request);
      
      if (response && response.data && response.data.title) {
        // Add the new list to the lists array
        setLists((prevLists) => [...prevLists, { title: response.data.title }]);
        return true;
      }
      
      return false;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    lists,
    loading,
    error,
    createList,
  };
}

