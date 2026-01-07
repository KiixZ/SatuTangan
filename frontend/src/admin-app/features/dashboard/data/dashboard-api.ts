import { axiosInstance } from "@admin/lib/axios";

export interface AdminStats {
  totalDonations: number;
  totalDonors: number;
  totalCampaigns: number;
  totalUsers: number;
  totalCreators: number;
  pendingVerifications: number;
  activeCampaigns: number;
  completedCampaigns: number;
  totalWithdrawals: number;
  pendingReports: number;
}

export interface DonationTrend {
  date: string;
  total_amount: number;
  donation_count: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  created_at: string;
}

export interface WeeklyDataPoint {
  name: string;
  donations: number;
  transactions: number;
}

export interface AnalyticsSummary {
  totalDonations: number;
  donationsChange: number;
  totalTransactions: number;
  transactionsChange: number;
  uniqueDonors: number;
  donorsChange: number;
  newCampaigns: number;
  campaignsChange: number;
  newUsers: number;
  usersChange: number;
}

export interface TopCampaign {
  id: string;
  title: string;
  total_received: number;
  donation_count: number;
}

export interface CategoryDonation {
  category_name: string;
  total_amount: number;
  donation_count: number;
}

export interface AnalyticsData {
  weeklyData: WeeklyDataPoint[];
  summary: AnalyticsSummary;
  topCampaigns: TopCampaign[];
  donationsByCategory: CategoryDonation[];
}

export async function getAdminStats(): Promise<AdminStats> {
  const response = await axiosInstance.get("/statistics/admin/dashboard");
  return response.data.data;
}

export async function getDonationTrends(
  days: number = 30,
): Promise<DonationTrend[]> {
  const response = await axiosInstance.get(
    `/statistics/admin/dashboard/trends?days=${days}`,
  );
  return response.data.data;
}

export async function getRecentActivities(
  limit: number = 10,
): Promise<RecentActivity[]> {
  const response = await axiosInstance.get(
    `/statistics/admin/dashboard/activities?limit=${limit}`,
  );
  return response.data.data;
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const response = await axiosInstance.get(
    "/statistics/admin/dashboard/analytics",
  );
  return response.data.data;
}
