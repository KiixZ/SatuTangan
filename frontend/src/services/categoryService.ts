import api from './api';
import type { CategoryListResponse } from '../types/campaign';

export const categoryService = {
  /**
   * Get all categories
   */
  getCategories: async (): Promise<CategoryListResponse> => {
    const response = await api.get('/categories');
    return response.data;
  },
};

export default categoryService;
