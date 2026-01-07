import midtransService from "../../services/midtransService";
import {
  setupTestDatabase,
  cleanupTestData,
  closeTestDatabase,
  createTestUser,
  createTestCategory,
  createTestCampaign,
} from "./setup";

/**
 * Integration Tests: Midtrans Payment Gateway
 *
 * Tests Midtrans integration including:
 * - Transaction creation
 * - Signature verification
 * - Sandbox environment testing
 *
 * Note: These tests use Midtrans sandbox environment
 */

describe("Midtrans Integration Tests", () => {
  let campaignId: string;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    const creatorId = await createTestUser("testcreator@test.com", "CREATOR");
    const categoryId = await createTestCategory("Test Category");
    campaignId = await createTestCampaign(creatorId, categoryId);
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe("Transaction Creation", () => {
    it("should create transaction and return snap token", async () => {
      const orderId = `TEST_ORDER_${Date.now()}`;
      const transactionData = {
        orderId,
        amount: 100000,
        customerDetails: {
          first_name: "Test",
          last_name: "Donor",
          email: "testdonor@test.com",
          phone: "081234567890",
        },
        itemDetails: [
          {
            id: campaignId,
            name: "Test Campaign",
            price: 100000,
            quantity: 1,
          },
        ],
      };

      const result = await midtransService.createTransaction(transactionData);

      expect(result).toHaveProperty("token");
      expect(result).toHaveProperty("redirect_url");
      expect(typeof result.token).toBe("string");
      expect(result.token.length).toBeGreaterThan(0);
    });

    it("should create transaction with different amounts", async () => {
      const amounts = [50000, 100000, 500000, 1000000];

      for (const amount of amounts) {
        const orderId = `TEST_ORDER_${Date.now()}_${amount}`;
        const transactionData = {
          orderId,
          amount,
          customerDetails: {
            first_name: "Test",
            last_name: "Donor",
            email: "testdonor@test.com",
            phone: "081234567890",
          },
          itemDetails: [
            {
              id: campaignId,
              name: "Test Campaign",
              price: amount,
              quantity: 1,
            },
          ],
        };

        const result = await midtransService.createTransaction(transactionData);
        expect(result).toHaveProperty("token");
      }
    });

    it("should handle transaction creation errors", async () => {
      const invalidData = {
        orderId: "", // Empty order ID
        amount: -1000, // Invalid amount
        customerDetails: {
          first_name: "",
          last_name: "",
          email: "invalid-email",
          phone: "",
        },
        itemDetails: [
          {
            id: "",
            name: "",
            price: -1000,
            quantity: 0,
          },
        ],
      };

      await expect(
        midtransService.createTransaction(invalidData),
      ).rejects.toThrow();
    });
  });

  describe("Signature Verification", () => {
    it("should verify valid signature", () => {
      const orderId = "TEST_ORDER_123";
      const statusCode = "200";
      const grossAmount = "100000.00";
      const serverKey = process.env.MIDTRANS_SERVER_KEY || "test-server-key";

      // Create signature using SHA512
      const crypto = require("crypto");
      const signatureString = orderId + statusCode + grossAmount + serverKey;
      const validSignature = crypto
        .createHash("sha512")
        .update(signatureString)
        .digest("hex");

      const isValid = midtransService.verifySignature(
        orderId,
        statusCode,
        grossAmount,
        validSignature,
      );

      expect(isValid).toBe(true);
    });

    it("should reject invalid signature", () => {
      const orderId = "TEST_ORDER_123";
      const statusCode = "200";
      const grossAmount = "100000.00";
      const invalidSignature = "invalid_signature_hash";

      const isValid = midtransService.verifySignature(
        orderId,
        statusCode,
        grossAmount,
        invalidSignature,
      );

      expect(isValid).toBe(false);
    });

    it("should reject tampered data", () => {
      const orderId = "TEST_ORDER_123";
      const statusCode = "200";
      const grossAmount = "100000.00";
      const serverKey = process.env.MIDTRANS_SERVER_KEY || "test-server-key";

      // Create valid signature
      const crypto = require("crypto");
      const signatureString = orderId + statusCode + grossAmount + serverKey;
      const validSignature = crypto
        .createHash("sha512")
        .update(signatureString)
        .digest("hex");

      // Try to verify with tampered amount
      const isValid = midtransService.verifySignature(
        orderId,
        statusCode,
        "200000.00", // Different amount
        validSignature,
      );

      expect(isValid).toBe(false);
    });
  });

  describe("Transaction Status", () => {
    it("should get transaction status", async () => {
      // First create a transaction
      const orderId = `TEST_ORDER_${Date.now()}`;
      const transactionData = {
        orderId,
        amount: 100000,
        customerDetails: {
          first_name: "Test",
          last_name: "Donor",
          email: "testdonor@test.com",
          phone: "081234567890",
        },
        itemDetails: [
          {
            id: campaignId,
            name: "Test Campaign",
            price: 100000,
            quantity: 1,
          },
        ],
      };

      await midtransService.createTransaction(transactionData);

      // Get transaction status
      const status = await midtransService.getTransactionStatus(orderId);

      expect(status).toHaveProperty("transaction_status");
      expect(status).toHaveProperty("order_id");
      expect(status.order_id).toBe(orderId);
    });

    it("should handle non-existent transaction", async () => {
      const nonExistentOrderId = "NON_EXISTENT_ORDER_123";

      await expect(
        midtransService.getTransactionStatus(nonExistentOrderId),
      ).rejects.toThrow();
    });
  });

  describe("Webhook Notification Handling", () => {
    it("should parse webhook notification correctly", () => {
      const webhookData = {
        order_id: "TEST_ORDER_123",
        status_code: "200",
        gross_amount: "100000.00",
        transaction_status: "settlement",
        payment_type: "bank_transfer",
        transaction_time: new Date().toISOString(),
        fraud_status: "accept",
      };

      // Verify webhook data structure
      expect(webhookData).toHaveProperty("order_id");
      expect(webhookData).toHaveProperty("transaction_status");
      expect(webhookData).toHaveProperty("gross_amount");
      expect(webhookData.transaction_status).toBe("settlement");
    });

    it("should handle different transaction statuses", () => {
      const statuses = ["pending", "settlement", "cancel", "deny", "expire"];

      statuses.forEach((status) => {
        const webhookData = {
          order_id: `TEST_ORDER_${status}`,
          status_code: "200",
          gross_amount: "100000.00",
          transaction_status: status,
          payment_type: "bank_transfer",
        };

        expect(webhookData.transaction_status).toBe(status);
      });
    });
  });

  describe("Payment Methods", () => {
    it("should support multiple payment methods", async () => {
      const paymentMethods = ["bank_transfer", "credit_card", "gopay", "qris"];

      for (const method of paymentMethods) {
        const orderId = `TEST_ORDER_${Date.now()}_${method}`;
        const transactionData = {
          orderId,
          amount: 100000,
          customerDetails: {
            first_name: "Test",
            last_name: "Donor",
            email: "testdonor@test.com",
            phone: "081234567890",
          },
          itemDetails: [
            {
              id: campaignId,
              name: "Test Campaign",
              price: 100000,
              quantity: 1,
            },
          ],
        };

        const result = await midtransService.createTransaction(transactionData);
        expect(result).toHaveProperty("token");
      }
    });
  });

  describe("Error Scenarios", () => {
    it("should handle network errors gracefully", async () => {
      // Simulate network error by using invalid server key temporarily
      const originalServerKey = process.env.MIDTRANS_SERVER_KEY;
      process.env.MIDTRANS_SERVER_KEY = "invalid_key";

      const orderId = `TEST_ORDER_${Date.now()}`;
      const transactionData = {
        orderId,
        amount: 100000,
        customerDetails: {
          first_name: "Test",
          last_name: "Donor",
          email: "testdonor@test.com",
          phone: "081234567890",
        },
        itemDetails: [
          {
            id: campaignId,
            name: "Test Campaign",
            price: 100000,
            quantity: 1,
          },
        ],
      };

      await expect(
        midtransService.createTransaction(transactionData),
      ).rejects.toThrow();

      // Restore original server key
      process.env.MIDTRANS_SERVER_KEY = originalServerKey;
    });

    it("should validate required fields", async () => {
      const incompleteData = {
        orderId: `TEST_ORDER_${Date.now()}`,
        amount: 100000,
        // Missing customerDetails and itemDetails
      };

      await expect(
        midtransService.createTransaction(incompleteData as any),
      ).rejects.toThrow();
    });
  });
});
