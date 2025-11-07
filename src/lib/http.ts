// axios instance, interceptors for global error handling

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

class HttpClient {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('🌐 API Request:', {
      method: options.method || 'GET',
      url,
      body: options.body,
    });
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers as Record<string, string>),
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw {
          message: text || 'Invalid response format',
          status: response.status,
          data: text,
        } as ApiError;
      }

      // Check if response indicates failure (either HTTP status or response status field)
      const isErrorResponse = !response.ok || (data.status === false) || (data.success === false);
      
      if (isErrorResponse) {
        // Handle different error response formats
        let errorMessage = 'An error occurred';
        
        if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
        } else if (data.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.join(', ');
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
        
        throw {
          message: errorMessage,
          status: response.status || data.statusCode || 400,
          data,
        } as ApiError;
      }

      // If the response already has success/message structure, return it as-is
      // Otherwise wrap it in our standard format
      console.log('✅ API Response:', {
        status: response.status,
        data,
      });

      // Handle both 'success' and 'status' fields
      const hasSuccessField = data.success !== undefined;
      const hasStatusField = data.status !== undefined;
      
      if (hasSuccessField || hasStatusField) {
        const success = hasSuccessField ? data.success : data.status;
        const result = {
          success: success === true || success === 'true',
          message: data.message || 'Success',
          data: data.data || data,
        };
        console.log('📦 Wrapped Response:', result);
        return result;
      }

      const result = {
        success: true,
        message: data.message || 'Success',
        data: data.data || data,
      };
      console.log('📦 Wrapped Response:', result);
      return result;
    } catch (error) {
      console.error('❌ API Error:', error);
      
      // If it's already an ApiError, re-throw it
      if (error && typeof error === 'object' && 'message' in error) {
        throw error as ApiError;
      }
      
      // Handle network errors (CORS, connection refused, etc.)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw {
          message: 'Unable to connect to server. Please check if the server is running and CORS is configured.',
          data: error,
        } as ApiError;
      }
      
      throw {
        message: 'Network error or server unavailable',
        data: error,
      } as ApiError;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();

