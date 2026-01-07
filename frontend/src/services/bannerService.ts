import api from './api';

export interface Banner {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const bannerService = {
  // Get all active banners
  getActiveBanners: async (): Promise<Banner[]> => {
    const response = await api.get('/banners');
    return response.data.data;
  },
};
