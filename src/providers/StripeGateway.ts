import Stripe from "stripe";
import { env } from "../schemas/env.schema.js";
import { IPaymentGateway, WebhookEvent } from "../types/IPaymentGateway.js";

export class StripeGateway implements IPaymentGateway {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(env.STRIPE_SECRET_KEY);
  }

  async createCheckoutSession({ orderId, total, items }: any) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card", "pix", "boleto"],
      mode: "payment",
      line_items: items.map((item: any) => ({
        quantity: item.quantity,
        price_data: {
          currency: "brl",
          unit_amount: item.unitPrice, // Stripe uses cents
          product_data: { name: item.name },
        },
      })),
      metadata: { orderId: String(orderId) },
      success_url: `${env.APP_URL}/orders/${orderId}?status=success`,
      cancel_url: `${env.APP_URL}/orders/${orderId}?status=cancelled`,
    });

    return {
      paymentLink: session.url!,
      sessionId: session.id,
    };
  }

  constructWebhookEvent(payload: Buffer, signature: string): WebhookEvent {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );

    // Stripe sends checkout.session.completed when the payment is successful
    const orderId = Number(
      (event.data.object as Stripe.Checkout.Session).metadata?.orderId,
    );

    return { type: event.type, orderId };
  }
}
