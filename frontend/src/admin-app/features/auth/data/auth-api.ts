import { axiosInstance } from "@admin/lib/axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      full_name: string;
      phone_number: string;
      role: "DONOR" | "CREATOR" | "ADMIN";
      is_email_verified: boolean;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log("authApi.login called with:", credentials);
    const response = await axiosInstance.post("/auth/login", credentials);
    console.log("authApi.login response:", response.data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post("/auth/logout");
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  },
};
