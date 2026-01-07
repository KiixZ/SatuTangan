import { DatabaseService } from "./databaseService";
import midtransService from "./midtransService";
import { v4 as uuidv4 } from "uuid";
import { RowDataPacket } from "mysql2";

interface CreateDonationParams {
  campaignId: string;
  userId?: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  prayer?: string;
  isAnonymous: boolean;
}

interface Donation extends RowDataPacket {
  id: string;
  campaign_id: string;
  user_id: string | null;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  amount: number;
  prayer: string | null;
  is_anonymous: boolean;
  status: string;
  midtrans_order_id: string;
  midtrans_token: string | null;
  created_at: Date;
  updated_at: Date;
}

interface Campaign extends RowDataPacket {
  id: string;
  title: string;
  collected_amount: number;
}

class DonationService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  async createDonation(params: CreateDonationParams) {
    try {
      // Verify campaign exists and is active
      const campaigns = await this.db.query<Campaign>(
        "SELECT id, title, collected_amount FROM campaigns WHERE id = ? AND status = ?",
        [params.campaignId, "ACTIVE"],
      );

      if (campaigns.length === 0) {
        throw new Error("Campaign not found or not active");
      }

      const campaign = campaigns[0];
      const donationId = uuidv4();
      const orderId = `DONATION-${Date.now()}-${donationId.substring(0, 8)}`;

      // Create Midtrans transaction
      const midtransResponse = await midtransService.createTransaction({
        orderId: orderId,
        amount: params.amount,
        customerDetails: {
          first_name: params.donorName,
          email: params.donorEmail,
          phone: params.donorPhone,
        },
        itemDetails: [
          {
            id: params.campaignId,
            name: `Donation for ${campaign.title}`,
            price: params.amount,
            quantity: 1,
          },
        ],
      });

      // Save donation to database
      await this.db.execute(
        `INSERT INTO donations (
          id, campaign_id, user_id, donor_name, donor_email, donor_phone,
          amount, prayer, is_anonymous, status, midtrans_order_id, midtrans_token
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          donationId,
          params.campaignId,
          params.userId || null,
          params.donorName,
          params.donorEmail,
          params.donorPhone,
          params.amount,
          params.prayer || null,
          params.isAnonymous,
          "PENDING",
          orderId,
          midtransResponse.token,
        ],
      );

      return {
        id: donationId,
        orderId: orderId,
        token: midtransResponse.token,
        redirectUrl: midtransResponse.redirect_url,
      };
    } catch (error: any) {
      console.error("Create donation error:", error);
      throw error;
    }
  }

  async updateDonationStatus(orderId: string, status: string) {
    try {
      await this.db.execute(
        "UPDATE donations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE midtrans_order_id = ?",
        [status, orderId],
      );

      // If payment successful, update campaign collected_amount
      if (status === "SUCCESS") {
        const donations = await this.db.query<Donation>(
          "SELECT campaign_id, amount FROM donations WHERE midtrans_order_id = ?",
          [orderId],
        );

        if (donations.length > 0) {
          const donation = donations[0];
          await this.db.execute(
            "UPDATE campaigns SET collected_amount = collected_amount + ? WHERE id = ?",
            [donation.amount, donation.campaign_id],
          );
        }
      }
    } catch (error: any) {
      console.error("Update donation status error:", error);
      throw error;
    }
  }

  async getDonationById(id: string) {
    try {
      const donations = await this.db.query<Donation>(
        `SELECT d.*, c.title as campaign_title
         FROM donations d
         JOIN campaigns c ON d.campaign_id = c.id
         WHERE d.id = ?`,
        [id],
      );

      if (donations.length === 0) {
        return null;
      }

      return donations[0];
    } catch (error: any) {
      console.error("Get donation by ID error:", error);
      throw error;
    }
  }

  async getDonationByOrderId(orderId: string) {
    try {
      const donations = await this.db.query<Donation>(
        `SELECT d.*, c.title as campaign_title
         FROM donations d
         JOIN campaigns c ON d.campaign_id = c.id
         WHERE d.midtrans_order_id = ?`,
        [orderId],
      );

      if (donations.length === 0) {
        return null;
      }

      return donations[0];
    } catch (error: any) {
      console.error("Get donation by order ID error:", error);
      throw error;
    }
  }

  async getUserDonationHistory(userId: string, email: string) {
    try {
      // Get donations by user_id OR email (to include donations before registration)
      const donations = await this.db.query<Donation>(
        `SELECT d.*, c.title as campaign_title, c.thumbnail_url as campaign_thumbnail
         FROM donations d
         JOIN campaigns c ON d.campaign_id = c.id
         WHERE (d.user_id = ? OR d.donor_email = ?) AND d.status = ?
         ORDER BY d.created_at DESC`,
        [userId, email, "SUCCESS"],
      );

      return donations;
    } catch (error: any) {
      console.error("Get user donation history error:", error);
      throw error;
    }
  }

  async getCampaignDonations(campaignId: string, limit: number = 10) {
    try {
      const donations = await this.db.query<Donation>(
        `SELECT
          id, donor_name, amount, is_anonymous, created_at
         FROM donations
         WHERE campaign_id = ? AND status = ?
         ORDER BY created_at DESC
         LIMIT ?`,
        [campaignId, "SUCCESS", limit],
      );

      // Hide donor name if anonymous
      return donations.map((donation) => ({
        ...donation,
        donor_name: donation.is_anonymous ? "Hamba Allah" : donation.donor_name,
      }));
    } catch (error: any) {
      console.error("Get campaign donations error:", error);
      throw error;
    }
  }

  async getCampaignPrayers(campaignId: string, limit: number = 20) {
    try {
      const donations = await this.db.query<Donation>(
        `SELECT
          id, donor_name, prayer, is_anonymous, created_at
         FROM donations
         WHERE campaign_id = ? AND status = ? AND prayer IS NOT NULL AND prayer != ''
         ORDER BY created_at DESC
         LIMIT ?`,
        [campaignId, "SUCCESS", limit],
      );

      // Hide donor name if anonymous
      return donations.map((donation) => ({
        ...donation,
        donor_name: donation.is_anonymous ? "Hamba Allah" : donation.donor_name,
      }));
    } catch (error: any) {
      console.error("Get campaign prayers error:", error);
      throw error;
    }
  }

  async recalculateCollectedAmounts() {
    try {
      console.log("=== RECALCULATING COLLECTED AMOUNTS ===");

      // Update all campaigns collected_amount based on successful donations
      const result = await this.db.execute(
        `UPDATE campaigns c
         SET collected_amount = (
           SELECT COALESCE(SUM(d.amount), 0)
           FROM donations d
           WHERE d.campaign_id = c.id AND d.status = 'SUCCESS'
         )`,
      );

      console.log("Recalculate result:", result);

      // Get updated statistics
      const stats = await this.db.query<RowDataPacket>(
        `SELECT
           COUNT(*) as total_campaigns,
           SUM(collected_amount) as total_collected
         FROM campaigns`,
      );

      console.log("Updated statistics:", stats[0]);
      console.log("=== RECALCULATION COMPLETED ===");

      return {
        success: true,
        message: "Collected amounts recalculated successfully",
        stats: stats[0],
      };
    } catch (error: any) {
      console.error("Recalculate collected amounts error:", error);
      throw error;
    }
  }

  async recalculateSingleCampaign(campaignId: string) {
    try {
      console.log(
        `=== RECALCULATING COLLECTED AMOUNT FOR CAMPAIGN ${campaignId} ===`,
      );

      // Update specific campaign collected_amount based on successful donations
      await this.db.execute(
        `UPDATE campaigns
         SET collected_amount = (
           SELECT COALESCE(SUM(amount), 0)
           FROM donations
           WHERE campaign_id = ? AND status = 'SUCCESS'
         )
         WHERE id = ?`,
        [campaignId, campaignId],
      );

      // Get updated campaign data
      const campaigns = await this.db.query<Campaign>(
        "SELECT id, title, collected_amount FROM campaigns WHERE id = ?",
        [campaignId],
      );

      if (campaigns.length === 0) {
        throw new Error("Campaign not found");
      }

      console.log("Updated campaign:", campaigns[0]);
      console.log("=== RECALCULATION COMPLETED ===");

      return {
        success: true,
        message: "Campaign collected amount recalculated successfully",
        campaign: campaigns[0],
      };
    } catch (error: any) {
      console.error("Recalculate single campaign error:", error);
      throw error;
    }
  }
}

export default new DonationService();
