import { axiosInstance } from "@admin/lib/axios";
import { User } from "./schema";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

export interface GetUsersResponse {
  success: boolean;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetUserResponse {
  success: boolean;
  data: User;
}

export const usersApi = {
  // Get all users
  getUsers: async (params?: GetUsersParams): Promise<GetUsersResponse> => {
    const response = await axiosInstance.get("/users", { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<GetUserResponse> => {
    const response = await axiosInstance.get(`/api/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (
    id: string,
    data: Partial<User>,
  ): Promise<GetUserResponse> => {
    const response = await axiosInstance.put(`/api/users/${id}`, data);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/users/${id}`);
  },

  // Update user status
  updateUserStatus: async (
    id: string,
    status: string,
  ): Promise<GetUserResponse> => {
    const response = await axiosInstance.patch(`/api/users/${id}/status`, {
      status,
    });
    return response.data;
  },
};
