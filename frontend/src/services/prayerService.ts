import api from "./api";

export interface Prayer {
  id: string;
  campaign_id: string;
  user_name: string;
  user_photo?: string;
  message: string;
  amount: number;
  is_anonymous: boolean;
  created_at: string;
  campaign_title?: string;
}

export interface PrayerResponse {
  data: Prayer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const prayerService = {
  /**
   * Get prayers with pagination (from donations)
   */
  async getPrayers(params?: {
    page?: number;
    limit?: number;
    campaign_id?: string;
  }): Promise<PrayerResponse> {
    const response = await api.get("/prayers", { params });
    return response.data;
  },

  /**
   * Get prayer count for a campaign
   */
  async getPrayerCount(campaignId: string): Promise<number> {
    const response = await api.get(`/prayers/campaign/${campaignId}/count`);
    return response.data.data.count;
  },

  /**
   * Get recent prayers for homepage
   */
  async getRecentPrayers(limit: number = 10): Promise<Prayer[]> {
    const response = await api.get("/prayers/recent", {
      params: { limit },
    });
    return response.data.data;
  },
};
