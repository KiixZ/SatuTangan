import api from "./api";

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
  captcha: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: "DONOR" | "CREATOR" | "ADMIN";
  is_email_verified: boolean;
  profile_photo_url?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<{ userId: string }> {
    console.log("authService.register called with:", data); // Debug log
    console.log("API Base URL:", import.meta.env.VITE_API_URL); // Debug log
    const response = await api.post("/auth/register", data);
    console.log("API Response:", response); // Debug log
    return response.data.data;
  },

  /**
   * Login user
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post("/auth/login", data);
    const authData = response.data.data;

    // Store tokens
    localStorage.setItem("accessToken", authData.accessToken);
    localStorage.setItem("refreshToken", authData.refreshToken);

    return authData;
  },

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<void> {
    await api.post(`/auth/verify-email/${token}`);
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    await api.post("/auth/forgot-password", { email });
  },

  /**
   * Reset password
   */
  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string,
  ): Promise<void> {
    await api.post(`/auth/reset-password/${token}`, {
      password,
      confirmPassword,
    });
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get("/auth/me");
    return response.data.data.user;
  },

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken");
  },
};
