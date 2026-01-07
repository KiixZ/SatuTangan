import { axiosInstance } from "@admin/lib/axios";
import { Withdrawal, CreateWithdrawalInput } from "./schema";

export const withdrawalsApi = {
  // Get all withdrawals (admin)
  getAllWithdrawals: async (params?: {
    page?: number;
    limit?: number;
    campaign_id?: string;
    status?: string;
  }): Promise<{ data: Withdrawal[]; pagination: any }> => {
    const response = await axiosInstance.get("/withdrawals", { params });
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  // Get withdrawal by ID
  getWithdrawalById: async (id: string): Promise<Withdrawal> => {
    const response = await axiosInstance.get(`/api/withdrawals/${id}`);
    return response.data.data;
  },

  // Create withdrawal
  createWithdrawal: async (
    data: CreateWithdrawalInput,
  ): Promise<Withdrawal> => {
    const response = await axiosInstance.post("/withdrawals", data);
    return response.data.data;
  },

  // Update withdrawal status
  updateWithdrawalStatus: async (
    id: string,
    status: "PROCESSING" | "COMPLETED" | "FAILED",
  ): Promise<Withdrawal> => {
    const response = await axiosInstance.patch(
      `/api/withdrawals/${id}/status`,
      { status },
    );
    return response.data.data;
  },

  // Get campaign withdrawals
  getCampaignWithdrawals: async (
    campaignId: string,
  ): Promise<{
    withdrawals: Withdrawal[];
    total_withdrawn: number;
    available_amount: number;
  }> => {
    const response = await axiosInstance.get(
      `/api/withdrawals/campaign/${campaignId}`,
    );
    return response.data.data;
  },
};
