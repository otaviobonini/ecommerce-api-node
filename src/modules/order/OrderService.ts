import { IOrderRepository } from "../../types/IOrderRepository.js";
import { ICartRepository } from "../../types/ICartRepository.js";
import { IPaymentGateway } from "../../types/IPaymentGateway.js";
import { AppError } from "../../common/AppError.js";
import { Status } from "@prisma/client";
import { IAddressRepository } from "../../types/IAddressRepository.js";

class OrderService {
  constructor(
    private payment: IPaymentGateway,
    private order: IOrderRepository,
    private cart: ICartRepository,
    private address: IAddressRepository,
  ) {}
  async createOrder(userId: number, addressId: number) {
    const address = await this.address.getAddressById(addressId);
    if (!address) throw new AppError(404, "Address not found");
    if (address.userId !== userId) throw new AppError(403, "Forbidden");
    const cart = await this.cart.findCartByUserId(userId);
    if (!cart) throw new AppError(404, "Cart not found");
    const cartItems = await this.cart.getCartItems(cart.cartId);
    if (cartItems.length === 0) throw new AppError(400, "Cart is empty");
    const total = cartItems.reduce(
      (sum, item) => sum + item.quantity * Number(item.product.productPrice),
      0,
    );
    // We need to create the order before generating the payment link

    const order = await this.order.createOrder({
      userId,
      addressId,

      total,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtTime: Number(item.product.productPrice),
      })),
    });
    // Now we can generate the payment link but if it doesn´t work for any reason we rollback.
    try {
      const { paymentLink } = await this.payment.createCheckoutSession({
        orderId: order.orderId,
        total: total * 100,
        items: cartItems.map((item) => ({
          name: item.product.productName,
          quantity: item.quantity,
          unitPrice: Number(item.product.productPrice) * 100,
        })),
      });

      await this.order.updateOrderPaymentLink(order.orderId, paymentLink);
      await this.cart.clearCart(cart.cartId);

      return { orderId: order.orderId, paymentLink };
    } catch (error) {
      // If payment provider fails, we cancel the order and restore stock
      await this.order.cancelOrder(order.orderId);
      throw new AppError(502, "Payment provider unavailable, please try again");
    }
  }

  async handleWebhook(payload: Buffer, signature: string) {
    const event = this.payment.constructWebhookEvent(payload, signature);
    if (event.type === "checkout.session.completed") {
      const order = await this.order.getOrderById(event.orderId);
      if (!order || order.status === "PAID") return;
      await this.order.editOrderStatus(event.orderId, "PAID");
    } else if (event.type === "payment_intent.payment_failed") {
      await this.order.editOrderStatus(event.orderId, "CANCELLED");
      await this.order.restoreStock(event.orderId);
    }
  }
  async getOrdersByUserId(
    userId: number,
    status?: string,
    offset = 0,
    limit = 20,
  ) {
    return this.order.getOrdersByUserId(
      userId,
      status as Status,
      offset,
      limit,
    );
  }
  async getOrderById(orderId: number, userId: number) {
    const order = await this.order.getOrderById(orderId);
    if (!order) throw new AppError(404, "Order not found");
    if (order.userId !== userId) throw new AppError(403, "Forbidden");
    return order;
  }

  async getAllOrders(offset = 0, limit = 20) {
    return this.order.getAllOrders(offset, limit);
  }
}

export default OrderService;
