export interface IPaymentGateway {
  createCheckoutSession(params: {
    orderId: number;
    total: number; // cents
    items: Array<{
      name: string;
      quantity: number;
      unitPrice: number; // cents
    }>;
  }): Promise<{ paymentLink: string; sessionId: string }>;

  constructWebhookEvent(payload: Buffer, signature: string): WebhookEvent;
}

export type WebhookEvent = {
  type: "payment_intent.succeeded" | "payment_intent.failed" | string;
  orderId: number;
};
