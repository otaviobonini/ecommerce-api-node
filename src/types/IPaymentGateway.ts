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
  type: "checkout.session.completed" | "payment_intent.payment_failed";
  orderId: number;
};
