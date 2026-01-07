declare module 'midtrans-client' {
  export class Snap {
    constructor(config: { isProduction: boolean; serverKey: string; clientKey: string });
    createTransaction(parameter: any): Promise<{ token: string; redirect_url: string }>;
  }

  export class CoreApi {
    constructor(config: { isProduction: boolean; serverKey: string; clientKey: string });
    transaction: {
      notification(notification: any): Promise<any>;
      status(orderId: string): Promise<any>;
    };
  }
}
