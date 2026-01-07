import { axiosInstance } from "@admin/lib/axios";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "./schema";

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await axiosInstance.get("/categories");
    // Handle different possible response structures
    if (response.data?.data?.categories) {
      return response.data.data.categories;
    }
    if (response.data?.categories) {
      return response.data.categories;
    }
    if (Array.isArray(response.data?.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    console.error("Unexpected categories response structure:", response.data);
    return [];
  },

  getById: async (id: string): Promise<Category> => {
    const response = await axiosInstance.get(`/api/categories/${id}`);
    return response.data.data.category;
  },

  create: async (data: CreateCategoryInput): Promise<Category> => {
    const response = await axiosInstance.post("/categories", data);
    return response.data.data.category;
  },

  update: async (id: string, data: UpdateCategoryInput): Promise<Category> => {
    const response = await axiosInstance.put(`/api/categories/${id}`, data);
    return response.data.data.category;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/categories/${id}`);
  },
};
