import { httpClient } from '../../../../lib/http';
import type { LoginRequest, LoginResponse } from './auth.types';

export const authClient = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>('/auth/login', credentials);
    
    if (response.data) {
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    }
    
    throw new Error('Login failed: No data received');
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): { id: string; username: string } | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};

