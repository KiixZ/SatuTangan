import midtransClient from "midtrans-client";
import crypto from "crypto";

interface CreateTransactionParams {
  orderId: string;
  amount: number;
  customerDetails: {
    first_name: string;
    email: string;
    phone: string;
  };
  itemDetails: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

interface TransactionResponse {
  token: string;
  redirect_url: string;
}

class MidtransService {
  private snap: any;
  private serverKey: string;

  constructor() {
    this.serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

    this.snap = new midtransClient.Snap({
      isProduction: isProduction,
      serverKey: this.serverKey,
      clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
    });
  }

  async createTransaction(
    params: CreateTransactionParams,
  ): Promise<TransactionResponse> {
    try {
      const parameter = {
        transaction_details: {
          order_id: params.orderId,
          gross_amount: params.amount,
        },
        customer_details: params.customerDetails,
        item_details: params.itemDetails,
        callbacks: {
          finish: `${process.env.FRONTEND_URL}/donation/success`,
          error: `${process.env.FRONTEND_URL}/donation/error`,
          pending: `${process.env.FRONTEND_URL}/donation/pending`,
        },
      };

      const transaction = await this.snap.createTransaction(parameter);

      return {
        token: transaction.token,
        redirect_url: transaction.redirect_url,
      };
    } catch (error: any) {
      console.error("Midtrans create transaction error:", error);
      throw new Error(
        `Failed to create Midtrans transaction: ${error.message}`,
      );
    }
  }

  verifySignature(
    orderId: string,
    statusCode: string,
    grossAmount: string,
    signatureKey: string,
  ): boolean {
    try {
      const hash = crypto
        .createHash("sha512")
        .update(`${orderId}${statusCode}${grossAmount}${this.serverKey}`)
        .digest("hex");

      return hash === signatureKey;
    } catch (error) {
      console.error("Signature verification error:", error);
      return false;
    }
  }

  async getTransactionStatus(orderId: string): Promise<any> {
    try {
      const statusResponse = await this.snap.transaction.status(orderId);
      return statusResponse;
    } catch (error: any) {
      console.error("Get transaction status error:", error);
      throw new Error(`Failed to get transaction status: ${error.message}`);
    }
  }

  async checkTransactionStatus(orderId: string): Promise<any> {
    return this.getTransactionStatus(orderId);
  }
}

export default new MidtransService();
