import { httpClient } from '../../../../lib/http';
import type { LoginRequest, LoginResponse } from './auth.types';

export const authClient = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await httpClient.post<LoginResponse>('/auth/login', credentials);
      
      // The API response structure is: { success, message, user, token }
      // The httpClient wraps it, so response.data contains the original response
      const loginData = response.data as LoginResponse;
      
      if (loginData && loginData.token && loginData.user) {
        // Store token in localStorage
        localStorage.setItem('token', loginData.token);
        localStorage.setItem('user', JSON.stringify(loginData.user));
        
        return loginData;
      }
      
      throw new Error('Login failed: Invalid response format');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
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

