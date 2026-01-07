import { axiosInstance } from "@admin/lib/axios";
import { Banner, CreateBannerInput, UpdateBannerInput } from "./schema";

export const bannersApi = {
  // Get all banners (admin)
  getAllBanners: async (): Promise<Banner[]> => {
    const response = await axiosInstance.get("/banners/all/list");
    return response.data.data;
  },

  // Get banner by ID
  getBannerById: async (id: string): Promise<Banner> => {
    const response = await axiosInstance.get(`/api/banners/${id}`);
    return response.data.data;
  },

  // Create banner
  createBanner: async (
    data: CreateBannerInput,
    image: File,
  ): Promise<Banner> => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.link_url) {
      formData.append("link_url", data.link_url);
    }
    if (data.description) {
      formData.append("description", data.description);
    }
    formData.append("is_active", String(data.is_active));
    formData.append("image", image);

    const response = await axiosInstance.post("/banners", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  // Update banner
  updateBanner: async (
    id: string,
    data: UpdateBannerInput,
    image?: File,
  ): Promise<Banner> => {
    const formData = new FormData();

    if (data.title) {
      formData.append("title", data.title);
    }
    if (data.link_url !== undefined) {
      formData.append("link_url", data.link_url);
    }
    if (data.description !== undefined) {
      formData.append("description", data.description || "");
    }
    if (data.is_active !== undefined) {
      formData.append("is_active", String(data.is_active));
    }
    if (image) {
      formData.append("image", image);
    }

    const response = await axiosInstance.put(`/api/banners/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  // Delete banner
  deleteBanner: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/banners/${id}`);
  },

  // Toggle banner status
  toggleBannerStatus: async (id: string): Promise<Banner> => {
    const response = await axiosInstance.patch(`/api/banners/${id}/toggle`);
    return response.data.data;
  },
};
