import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../infrastructure/api/auth.client';
import type { LoginRequest, LoginResponse } from '../infrastructure/api/auth.types';
import type { ApiError } from '../../../lib/http';

interface UseAuthReturn {
  user: { id: string; username: string } | null;
  loading: boolean;
  error: ApiError | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<{ id: string; username: string } | null>(
    authClient.getCurrentUser()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const navigate = useNavigate();

  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response: LoginResponse = await authClient.login(credentials);
      setUser(response.user);
      navigate('/');
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async (): Promise<void> => {
    await authClient.logout();
    setUser(null);
    navigate('/auth/login');
  }, [navigate]);

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: authClient.isAuthenticated(),
  };
}

