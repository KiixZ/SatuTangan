import { axiosInstance } from "@admin/lib/axios";
import { Campaign, CreateCampaignInput, UpdateCampaignInput } from "./schema";

export const campaignsApi = {
  // Get all campaigns (admin)
  getAllCampaigns: async (params?: {
    page?: number;
    limit?: number;
    category_id?: string;
    status?: string;
    search?: string;
  }): Promise<{ data: Campaign[]; pagination: any }> => {
    const response = await axiosInstance.get("/campaigns", { params });
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  // Get campaign by ID
  getCampaignById: async (id: string): Promise<Campaign> => {
    const response = await axiosInstance.get(`/campaigns/${id}`);
    return response.data.data;
  },

  // Create campaign
  createCampaign: async (
    data: CreateCampaignInput,
    thumbnail: File,
  ): Promise<Campaign> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category_id", data.category_id);
    formData.append("target_amount", String(data.target_amount));
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
    formData.append("status", data.status || "DRAFT");
    formData.append("thumbnail", thumbnail);

    const response = await axiosInstance.post("/campaigns", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  // Update campaign
  updateCampaign: async (
    id: string,
    data: UpdateCampaignInput,
    thumbnail?: File,
  ): Promise<Campaign> => {
    const formData = new FormData();

    if (data.title) formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.category_id) formData.append("category_id", data.category_id);
    if (data.target_amount)
      formData.append("target_amount", String(data.target_amount));
    if (data.start_date) formData.append("start", data.start_date);
    if (data.end_date) formData.append("end_date", data.end_date);
    if (data.status) formData.append("status", data.status);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    const response = await axiosInstance.put(`/campaigns/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  // Delete campaign
  deleteCampaign: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/campaigns/${id}`);
  },

  // Update campaign status
  updateCampaignStatus: async (
    id: string,
    status: "DRAFT" | "ACTIVE" | "COMPLETED" | "SUSPENDED",
  ): Promise<Campaign> => {
    const response = await axiosInstance.patch(`/campaigns/${id}/status`, {
      status,
    });
    return response.data.data;
  },

  // Toggle emergency status
  toggleEmergency: async (
    id: string,
    is_emergency: boolean,
  ): Promise<Campaign> => {
    const response = await axiosInstance.patch(
      `/campaigns/${id}/emergency`,
      { is_emergency },
    );
    return response.data.data;
  },
};
