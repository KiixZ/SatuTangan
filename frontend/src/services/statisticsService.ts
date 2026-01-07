import api from "./api";

export interface PlatformStatistics {
  totalCampaigns: number;
  totalDonors: number;
  totalFunds: number;
  totalTransactions: number;
  totalSuccessfulDonations: number;
}

// Alias for backward compatibility
export interface PublicStats {
  totalDonations: number;
  totalDonors: number;
  totalCampaigns: number;
  totalTransactions: number;
  totalSuccessfulDonations: number;
}

export const statisticsService = {
  /**
   * Get platform statistics
   */
  async getPlatformStatistics(): Promise<PlatformStatistics> {
    const response = await api.get("/statistics/platform");
    return response.data.data;
  },

  /**
   * Get public statistics (alias for backward compatibility)
   */
  async getPublicStats(): Promise<PublicStats> {
    const response = await api.get("/statistics/platform");
    const data = response.data.data;
    return {
      totalDonations: data.totalFunds,
      totalDonors: data.totalDonors,
      totalCampaigns: data.totalCampaigns,
      totalTransactions: data.totalTransactions || 0,
      totalSuccessfulDonations: data.totalSuccessfulDonations || 0,
    };
  },
};

export default statisticsService;
