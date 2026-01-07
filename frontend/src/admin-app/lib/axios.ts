import axios from "axios";
import { useAuthStore } from "@admin/stores/auth-store";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Axios request config:", {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
    });
    const { auth } = useAuthStore.getState();
    if (auth.accessToken) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      const { auth } = useAuthStore.getState();
      auth.reset();
      window.location.href = "/admin/sign-in";
    }
    return Promise.reject(error);
  },
);
