import { httpClient } from '../../../../lib/http';
import type { CreateListRequest, CreateListResponse } from './list.types';

export const listClient = {
  async createList(request: CreateListRequest): Promise<CreateListResponse> {
    try {
      const response = await httpClient.post<CreateListResponse>('/list/title', request);
      
      // The API response structure is: { status, message, statusCode, data: { title } }
      // The httpClient wraps it, so response.data contains the data object directly
      // For responses with status field, httpClient returns: { success, message, data: data.data || data }
      // So response.data will be { title: "..." } directly
      
      if (response.data && typeof response.data === 'object' && 'title' in response.data) {
        // If response.data is the data object directly (wrapped by httpClient)
        const title = (response.data as { title: string }).title;
        return {
          status: true,
          message: response.message || 'Title saved successfully',
          statusCode: 201,
          data: { title },
        };
      }
      
      throw new Error('List creation failed: Invalid response format');
    } catch (error) {
      console.error('Create list error:', error);
      throw error;
    }
  },
};

