import { DatabaseService } from "./databaseService";
import { RowDataPacket } from "mysql2";

interface StatisticsData extends RowDataPacket {
  total_campaigns: number;
  total_donors: number;
  total_funds: number;
}

class StatisticsService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  async getPlatformStatistics() {
    try {
      console.log("=== FETCHING PLATFORM STATISTICS ===");

      // Get total active campaigns
      const campaignResult = await this.db.query<RowDataPacket>(
        `SELECT COUNT(*) as total FROM campaigns WHERE status = 'ACTIVE'`,
      );
      const totalCampaigns = (campaignResult[0] as any).total || 0;
      console.log("Total active campaigns:", totalCampaigns);

      // Get campaign breakdown by status
      const campaignStatusResult = await this.db.query<RowDataPacket>(
        `SELECT status, COUNT(*) as count FROM campaigns GROUP BY status`,
      );
      console.log("Campaign status breakdown:", campaignStatusResult);

      // Get sum of collected_amount from all campaigns for debugging
      const collectedDebug = await this.db.query<RowDataPacket>(
        `SELECT id, title, collected_amount FROM campaigns WHERE collected_amount > 0`,
      );
      console.log("Campaigns with collected amount:", collectedDebug);

      // Get total unique donors (based on successful donations)
      const donorResult = await this.db.query<RowDataPacket>(
        `SELECT COUNT(DISTINCT donor_email) as total
         FROM donations
         WHERE status = 'SUCCESS'`,
      );
      const totalDonors = (donorResult[0] as any).total || 0;
      console.log("Total donors:", totalDonors);

      // Check total donations by status
      const donationStatusResult = await this.db.query<RowDataPacket>(
        `SELECT status, COUNT(*) as count, SUM(amount) as total_amount FROM donations GROUP BY status`,
      );
      console.log("Donation status breakdown:", donationStatusResult);

      // Get total successful donation transactions count
      const transactionCountResult = await this.db.query<RowDataPacket>(
        `SELECT COUNT(*) as total FROM donations WHERE status = 'SUCCESS'`,
      );
      const totalTransactions = (transactionCountResult[0] as any).total || 0;
      console.log("Total successful transactions:", totalTransactions);

      // Get total successful donations amount from campaigns collected_amount
      // This is more reliable than summing from donations table
      const successfulDonationsResult = await this.db.query<RowDataPacket>(
        `SELECT COALESCE(SUM(collected_amount), 0) as total FROM campaigns`,
      );
      const totalSuccessfulDonations =
        parseFloat((successfulDonationsResult[0] as any).total) || 0;
      console.log(
        "Total successful donations amount (from campaigns):",
        totalSuccessfulDonations,
      );

      // Get total funds disbursed (completed withdrawals)
      const fundsResult = await this.db.query<RowDataPacket>(
        `SELECT COALESCE(SUM(amount), 0) as total
         FROM withdrawals
         WHERE status = 'COMPLETED'`,
      );
      const totalFunds = parseFloat((fundsResult[0] as any).total) || 0;
      console.log("Total disbursed funds:", totalFunds);

      // Check withdrawal breakdown by status
      const withdrawalStatusResult = await this.db.query<RowDataPacket>(
        `SELECT status, COUNT(*) as count, SUM(amount) as total_amount FROM withdrawals GROUP BY status`,
      );
      console.log("Withdrawal status breakdown:", withdrawalStatusResult);

      console.log("=== STATISTICS RESULT ===");
      const result = {
        totalCampaigns,
        totalDonors,
        totalFunds,
        totalTransactions,
        totalSuccessfulDonations,
      };
      console.log("Final statistics:", result);
      console.log(
        "Dana Terkumpul (totalSuccessfulDonations):",
        totalSuccessfulDonations,
      );
      console.log("Kali Donasi (totalTransactions):", totalTransactions);

      return result;
    } catch (error: any) {
      console.error("Get platform statistics error:", error);
      throw error;
    }
  }

  async getAdminDashboardStats() {
    try {
      console.log("=== FETCHING ADMIN DASHBOARD STATISTICS ===");

      // Get total successful donations amount
      const donationsResult = await this.db.query<RowDataPacket>(
        `SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE status = 'SUCCESS'`,
      );
      const totalDonations = parseFloat((donationsResult[0] as any).total) || 0;

      // Get total unique donors
      const donorsResult = await this.db.query<RowDataPacket>(
        `SELECT COUNT(DISTINCT donor_email) as total FROM donations WHERE status = 'SUCCESS'`,
      );
      const totalDonors = (donorsResult[0] as any).total || 0;

      // Get total campaigns
      const campaignsResult = await this.db.query<RowDataPacket>(
        `SELECT COUNT(*) as total FROM campaigns`,
      );
      const totalCampaigns = (campaignsResult[0] as any).total || 0;

      // Get total users
      const usersResult = await this.db.query<RowDataPacket>(
        `SELECT COUNT(*) as total FROM users`,
      );
      const totalUsers = (usersResult[0] as any).total || 0;

      // Get total creators (users with creator role)
      const creatorsResult = await this.db.query<RowDataPacket>(
        `SELECT COUNT(*) as total FROM users WHERE role = 'creator'`,
      );
      const totalCreators = (creatorsResult[0] as any).total || 0;

      // Get pending verifications (campaigns pending approval)
      const pendingVerificationsResult = await this.db.query<RowDataPacket>(
        `SELECT COUNT(*) as total FROM campaigns WHERE status = 'PENDING'`,
      );
      const pendingVerifications =
        (pendingVerificationsResult[0] as any).total || 0;

      // Get active campaigns
      const activeCampaignsResult = await this.db.query<RowDataPacket>(
        `SELECT COUNT(*) as total FROM campaigns WHERE status = 'ACTIVE'`,
      );
      const activeCampaigns = (activeCampaignsResult[0] as any).total || 0;

      // Get completed campaigns
      const completedCampaignsResult = await this.db.query<RowDataPacket>(
        `SELECT COUNT(*) as total FROM campaigns WHERE status = 'COMPLETED'`,
      );
      const completedCampaigns =
        (completedCampaignsResult[0] as any).total || 0;

      // Get total withdrawals amount
      const withdrawalsResult = await this.db.query<RowDataPacket>(
        `SELECT COALESCE(SUM(amount), 0) as total FROM withdrawals WHERE status = 'COMPLETED'`,
      );
      const totalWithdrawals =
        parseFloat((withdrawalsResult[0] as any).total) || 0;

      // Get pending reports
      const pendingReportsResult = await this.db.query<RowDataPacket>(
        `SELECT COUNT(*) as total FROM reports WHERE status = 'PENDING'`,
      );
      const pendingReports = (pendingReportsResult[0] as any).total || 0;

      console.log("=== ADMIN DASHBOARD STATISTICS RESULT ===");
      const stats = {
        totalDonations,
        totalDonors,
        totalCampaigns,
        totalUsers,
        totalCreators,
        pendingVerifications,
        activeCampaigns,
        completedCampaigns,
        totalWithdrawals,
        pendingReports,
      };
      console.log(stats);

      return stats;
    } catch (error: any) {
      console.error("Get admin dashboard statistics error:", error);
      throw error;
    }
  }

  async getDonationTrends(days: number = 30) {
    try {
      console.log(`=== FETCHING DONATION TRENDS FOR ${days} DAYS ===`);

      const trendsResult = await this.db.query<RowDataPacket>(
        `SELECT
          DATE(created_at) as date,
          COALESCE(SUM(amount), 0) as total_amount,
          COUNT(*) as donation_count
         FROM donations
         WHERE status = 'SUCCESS'
           AND created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
         GROUP BY DATE(created_at)
         ORDER BY date ASC`,
        [days],
      );

      console.log("Donation trends result:", trendsResult);
      return trendsResult;
    } catch (error: any) {
      console.error("Get donation trends error:", error);
      throw error;
    }
  }

  async getRecentActivities(limit: number = 10) {
    try {
      console.log(`=== FETCHING RECENT ACTIVITIES (LIMIT: ${limit}) ===`);

      // Get recent donations
      const recentDonations = await this.db.query<RowDataPacket>(
        `SELECT
          d.id,
          'donation' as type,
          CONCAT(d.donor_name, ' donated Rp', FORMAT(d.amount, 0), ' to ', c.title) as description,
          d.created_at
         FROM donations d
         JOIN campaigns c ON d.campaign_id = c.id
         WHERE d.status = 'SUCCESS'
         ORDER BY d.created_at DESC
         LIMIT ?`,
        [limit],
      );

      console.log("Recent activities result:", recentDonations);
      return recentDonations;
    } catch (error: any) {
      console.error("Get recent activities error:", error);
      throw error;
    }
  }

  async getAnalyticsData() {
    try {
      console.log("=== FETCHING ANALYTICS DATA ===");

      // Get weekly donation data (last 7 days)
      const weeklyDonationsResult = await this.db.query<RowDataPacket>(
        `SELECT
          DAYNAME(created_at) as day_name,
          DAYOFWEEK(created_at) as day_of_week,
          COALESCE(SUM(amount), 0) as total_amount,
          COUNT(*) as donation_count
         FROM donations
         WHERE status = 'SUCCESS'
           AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
         GROUP BY DAYNAME(created_at), DAYOFWEEK(created_at)
         ORDER BY day_of_week ASC`,
      );

      // Get this week's totals
      const thisWeekResult = await this.db.query<RowDataPacket>(
        `SELECT
          COALESCE(SUM(amount), 0) as total_donations,
          COUNT(*) as total_transactions,
          COUNT(DISTINCT donor_email) as unique_donors
         FROM donations
         WHERE status = 'SUCCESS'
           AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`,
      );

      // Get last week's totals for comparison
      const lastWeekResult = await this.db.query<RowDataPacket>(
        `SELECT
          COALESCE(SUM(amount), 0) as total_donations,
          COUNT(*) as total_transactions,
          COUNT(DISTINCT donor_email) as unique_donors
         FROM donations
         WHERE status = 'SUCCESS'
           AND created_at >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
           AND created_at < DATE_SUB(CURDATE(), INTERVAL 7 DAY)`,
      );

      // Get new campaigns this week
      const newCampaignsThisWeek = await this.db.query<RowDataPacket>(
        `SELECT COUNT(*) as total FROM campaigns
         WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`,
      );

      // Get new campaigns last week
      const newCampaignsLastWeek = await this.db.query<RowDataPacket>(
        `SELECT COUNT(*) as total FROM campaigns
         WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
           AND created_at < DATE_SUB(CURDATE(), INTERVAL 7 DAY)`,
      );

      // Get new users this week
      const newUsersThisWeek = await this.db.query<RowDataPacket>(
        `SELECT COUNT(*) as total FROM users
         WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`,
      );

      // Get new users last week
      const newUsersLastWeek = await this.db.query<RowDataPacket>(
        `SELECT COUNT(*) as total FROM users
         WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
           AND created_at < DATE_SUB(CURDATE(), INTERVAL 7 DAY)`,
      );

      // Get top campaigns by donations this week
      const topCampaigns = await this.db.query<RowDataPacket>(
        `SELECT
          c.id,
          c.title,
          COALESCE(SUM(d.amount), 0) as total_received,
          COUNT(d.id) as donation_count
         FROM campaigns c
         LEFT JOIN donations d ON c.id = d.campaign_id
           AND d.status = 'SUCCESS'
           AND d.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
         WHERE c.status = 'ACTIVE'
         GROUP BY c.id, c.title
         HAVING total_received > 0
         ORDER BY total_received DESC
         LIMIT 5`,
      );

      // Get donation by category
      const donationsByCategory = await this.db.query<RowDataPacket>(
        `SELECT
          cat.name as category_name,
          COALESCE(SUM(d.amount), 0) as total_amount,
          COUNT(d.id) as donation_count
         FROM categories cat
         LEFT JOIN campaigns c ON cat.id = c.category_id
         LEFT JOIN donations d ON c.id = d.campaign_id
           AND d.status = 'SUCCESS'
           AND d.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
         GROUP BY cat.id, cat.name
         HAVING total_amount > 0
         ORDER BY total_amount DESC`,
      );

      // Calculate percentage changes
      const thisWeek = thisWeekResult[0] as any;
      const lastWeek = lastWeekResult[0] as any;

      const calculateChange = (current: number, previous: number): number => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100 * 10) / 10;
      };

      const donationsChange = calculateChange(
        parseFloat(thisWeek.total_donations) || 0,
        parseFloat(lastWeek.total_donations) || 0,
      );

      const transactionsChange = calculateChange(
        thisWeek.total_transactions || 0,
        lastWeek.total_transactions || 0,
      );

      const donorsChange = calculateChange(
        thisWeek.unique_donors || 0,
        lastWeek.unique_donors || 0,
      );

      const campaignsChange = calculateChange(
        (newCampaignsThisWeek[0] as any).total || 0,
        (newCampaignsLastWeek[0] as any).total || 0,
      );

      const usersChange = calculateChange(
        (newUsersThisWeek[0] as any).total || 0,
        (newUsersLastWeek[0] as any).total || 0,
      );

      // Format weekly data with all days
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const weeklyData = daysOfWeek.map((day, index) => {
        const dayData = (weeklyDonationsResult as any[]).find(
          (d) => d.day_of_week === index + 1,
        );
        return {
          name: day,
          donations: dayData ? parseFloat(dayData.total_amount) : 0,
          transactions: dayData ? dayData.donation_count : 0,
        };
      });

      const analytics = {
        weeklyData,
        summary: {
          totalDonations: parseFloat(thisWeek.total_donations) || 0,
          donationsChange,
          totalTransactions: thisWeek.total_transactions || 0,
          transactionsChange,
          uniqueDonors: thisWeek.unique_donors || 0,
          donorsChange,
          newCampaigns: (newCampaignsThisWeek[0] as any).total || 0,
          campaignsChange,
          newUsers: (newUsersThisWeek[0] as any).total || 0,
          usersChange,
        },
        topCampaigns,
        donationsByCategory,
      };

      console.log("Analytics data result:", analytics);
      return analytics;
    } catch (error: any) {
      console.error("Get analytics data error:", error);
      throw error;
    }
  }
}

export default new StatisticsService();
