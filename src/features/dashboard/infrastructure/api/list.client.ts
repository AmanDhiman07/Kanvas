import { httpClient } from '../../../../lib/http';
import { API_ENDPOINTS } from '../../../../constants/api';
import type { CreateListRequest, CreateListResponse, GetListsResponse, List } from './list.types';

export const listClient = {
  async createList(request: CreateListRequest): Promise<CreateListResponse> {
    try {
      const response = await httpClient.post<CreateListResponse>(API_ENDPOINTS.LIST.CREATE, request);

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

  async fetchLists(): Promise<List[]> {
    try {
      const response = await httpClient.get<GetListsResponse>(API_ENDPOINTS.LIST.GET_ALL);

      // The API response structure is: { status, message, statusCode, data: List[] }
      // The httpClient wraps it, so response.data contains the data array directly

      if (response.data && Array.isArray(response.data)) {
        return response.data as List[];
      }

      throw new Error('Failed to fetch lists: Invalid response format');
    } catch (error) {
      console.error('Fetch lists error:', error);
      throw error;
    }
  },
};

