import { axiosInstance } from "@admin/lib/axios";
import { Report, ReviewReportData } from "./schema";

export interface GetReportsParams {
  page?: number;
  limit?: number;
  status?: string;
  campaign_id?: string;
}

export interface GetReportsResponse {
  success: boolean;
  data: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetReportResponse {
  success: boolean;
  data: Report;
}

export interface ReviewReportResponse {
  success: boolean;
  message: string;
  data: Report;
}

export const reportsApi = {
  getReports: async (
    params?: GetReportsParams,
  ): Promise<GetReportsResponse> => {
    const response = await axiosInstance.get("/reports", { params });
    return response.data;
  },

  getReportById: async (id: string): Promise<GetReportResponse> => {
    const response = await axiosInstance.get(`/api/reports/${id}`);
    return response.data;
  },

  reviewReport: async (
    id: string,
    data: ReviewReportData,
  ): Promise<ReviewReportResponse> => {
    const response = await axiosInstance.patch(
      `/api/reports/${id}/review`,
      data,
    );
    return response.data;
  },
};
