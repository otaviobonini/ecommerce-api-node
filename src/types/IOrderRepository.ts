import { Prisma, Status } from "@prisma/client";

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    orderItems: true;
  };
}>;

export interface IOrderRepository {
  createOrder(params: {
    userId: number;
    addressId: number;
    total: number;
    items: { productId: number; quantity: number; priceAtTime: number }[];
  }): Promise<OrderWithItems>;
  restoreStock(orderId: number): Promise<void>;
  cancelOrder(orderId: number): Promise<void>;
  updateOrderPaymentLink(
    orderId: number,
    paymentLink: string,
  ): Promise<OrderWithItems>;
  decrementStock(orderId: number): Promise<void>;
  getOrdersByUserId(
    userId: number,
    status?: Status,
    offset?: number,
    limit?: number,
  ): Promise<OrderWithItems[]>;
  getOrderById(orderId: number): Promise<OrderWithItems | null>;
  editOrderStatus(orderId: number, status: Status): Promise<OrderWithItems>;
  getAllOrders(offset?: number, limit?: number): Promise<OrderWithItems[]>;
}
