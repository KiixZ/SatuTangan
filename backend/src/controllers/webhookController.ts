import { Request, Response } from "express";
import midtransService from "../services/midtransService";
import donationService from "../services/donationService";
import { DatabaseService } from "../services/databaseService";

class WebhookController {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  async handleMidtransNotification(req: Request, res: Response): Promise<void> {
    try {
      const notification = req.body;

      console.log("=== MIDTRANS WEBHOOK RECEIVED ===");
      console.log("Notification:", JSON.stringify(notification, null, 2));

      // Log webhook for audit trail
      try {
        await this.db.execute(
          "INSERT INTO webhook_logs (id, order_id, payload, signature, created_at) VALUES (UUID(), ?, ?, ?, CURRENT_TIMESTAMP)",
          [
            notification.order_id || "UNKNOWN",
            JSON.stringify(notification),
            notification.signature_key || "",
          ],
        );
        console.log("Webhook logged to database");
      } catch (logError) {
        console.error("Failed to log webhook to database:", logError);
        // Continue processing even if logging fails
      }

      // Verify signature
      const isValid = midtransService.verifySignature(
        notification.order_id,
        notification.status_code,
        notification.gross_amount,
        notification.signature_key,
      );

      if (!isValid) {
        console.error("Invalid signature for order:", notification.order_id);
        res.status(403).json({
          success: false,
          error: {
            code: "WEBHOOK_001",
            message: "Invalid signature",
          },
        });
        return;
      }

      // Map Midtrans transaction status to our donation status
      let donationStatus = "PENDING";
      const transactionStatus = notification.transaction_status;
      const fraudStatus = notification.fraud_status;

      if (transactionStatus === "capture") {
        if (fraudStatus === "accept") {
          donationStatus = "SUCCESS";
        }
      } else if (transactionStatus === "settlement") {
        donationStatus = "SUCCESS";
      } else if (
        transactionStatus === "cancel" ||
        transactionStatus === "deny" ||
        transactionStatus === "expire"
      ) {
        donationStatus = "FAILED";
      } else if (transactionStatus === "pending") {
        donationStatus = "PENDING";
      }

      // Update donation status
      console.log(`Updating donation status to: ${donationStatus}`);
      await donationService.updateDonationStatus(
        notification.order_id,
        donationStatus,
      );

      console.log(
        `✅ Donation ${notification.order_id} status updated to ${donationStatus}`,
      );
      console.log("=== WEBHOOK PROCESSING COMPLETED ===");

      res.status(200).json({
        success: true,
        message: "Notification processed successfully",
      });
    } catch (error: any) {
      console.error("Webhook processing error:", error);
      res.status(500).json({
        success: false,
        error: {
          code: "WEBHOOK_002",
          message: "Failed to process webhook",
        },
      });
    }
  }

  async handleFinishRedirect(req: Request, res: Response): Promise<void> {
    try {
      const { order_id } = req.query;

      if (!order_id) {
        res.redirect(`${process.env.FRONTEND_URL}/donation/error`);
        return;
      }

      // Get latest status from Midtrans to verify
      const midtransStatus = await midtransService.checkTransactionStatus(
        order_id as string,
      );

      // Map status
      let donationStatus = "PENDING";
      const txStatus = midtransStatus.transaction_status;
      const fraudStatus = midtransStatus.fraud_status;

      if (txStatus === "capture") {
        if (fraudStatus === "accept") {
          donationStatus = "SUCCESS";
        }
      } else if (txStatus === "settlement") {
        donationStatus = "SUCCESS";
      } else if (
        txStatus === "cancel" ||
        txStatus === "deny" ||
        txStatus === "expire"
      ) {
        donationStatus = "FAILED";
      } else if (txStatus === "pending") {
        donationStatus = "PENDING";
      }

      // Update status in database
      await donationService.updateDonationStatus(
        order_id as string,
        donationStatus,
      );

      // Redirect to frontend based on status
      if (donationStatus === "SUCCESS") {
        res.redirect(
          `${process.env.FRONTEND_URL}/donation/success?order_id=${order_id}`,
        );
      } else if (donationStatus === "PENDING") {
        res.redirect(
          `${process.env.FRONTEND_URL}/donation/pending?order_id=${order_id}`,
        );
      } else {
        res.redirect(
          `${process.env.FRONTEND_URL}/donation/error?order_id=${order_id}`,
        );
      }
    } catch (error: any) {
      console.error("Finish redirect error:", error);
      res.redirect(`${process.env.FRONTEND_URL}/donation/error`);
    }
  }

  async handleUnfinishRedirect(req: Request, res: Response): Promise<void> {
    const { order_id } = req.query;
    res.redirect(
      `${process.env.FRONTEND_URL}/donation/pending?order_id=${order_id || ""}`,
    );
  }

  async handleErrorRedirect(req: Request, res: Response): Promise<void> {
    const { order_id } = req.query;
    res.redirect(
      `${process.env.FRONTEND_URL}/donation/error?order_id=${order_id || ""}`,
    );
  }
}

export default new WebhookController();
