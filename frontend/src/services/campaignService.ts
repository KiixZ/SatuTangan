import api from "./api";
import type {
  CampaignListResponse,
  Campaign,
  CampaignPhoto,
  CampaignUpdate,
} from "../types/campaign";

interface GetCampaignsParams {
  page?: number;
  limit?: number;
  category_id?: string;
  status?: string;
  search?: string;
  sort?: string;
  is_emergency?: boolean;
}

export const campaignService = {
  /**
   * Get campaigns with pagination and filters
   */
  getCampaigns: async (
    params: GetCampaignsParams = {},
  ): Promise<CampaignListResponse> => {
    const response = await api.get("/campaigns", { params });
    return response.data;
  },

  /**
   * Get campaign by ID
   */
  getCampaignById: async (
    id: string,
  ): Promise<{ success: boolean; data: Campaign }> => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },

  /**
   * Get campaign photos
   */
  getCampaignPhotos: async (
    id: string,
  ): Promise<{ success: boolean; data: CampaignPhoto[] }> => {
    const response = await api.get(`/campaigns/${id}/photos`);
    return response.data;
  },

  /**
   * Get campaign updates
   */
  getCampaignUpdates: async (
    id: string,
  ): Promise<{ success: boolean; data: CampaignUpdate[] }> => {
    const response = await api.get(`/campaigns/${id}/updates`);
    return response.data;
  },
};

export default campaignService;
