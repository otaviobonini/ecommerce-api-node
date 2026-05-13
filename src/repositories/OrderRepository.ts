import { Status } from "@prisma/client";
import { prisma } from "../database/prisma.js";
import { IOrderRepository, OrderWithItems } from "../types/IOrderRepository.js";

export class OrderRepository implements IOrderRepository {
  async createOrder(params: {
    userId: number;
    addressId: number;
    total: number;
    items: { productId: number; quantity: number; priceAtTime: number }[];
  }): Promise<OrderWithItems> {
    const { userId, addressId, total, items } = params;

    return prisma.order.create({
      data: {
        userId,
        addressId,
        total,
        orderItems: { create: items },
      },
      include: { orderItems: true },
    });
  }

  async updateOrderPaymentLink(
    orderId: number,
    paymentLink: string,
  ): Promise<OrderWithItems> {
    return prisma.order.update({
      where: { orderId },
      data: { paymentLink },
      include: { orderItems: true },
    });
  }

  async decrementStock(orderId: number): Promise<void> {
    const items = await prisma.orderItem.findMany({ where: { orderId } });

    await prisma.$transaction(
      items.map((item) =>
        prisma.product.update({
          where: { productId: item.productId },
          data: { stock: { decrement: item.quantity } },
        }),
      ),
    );
  }

  async getOrdersByUserId(
    userId: number,
    status?: Status,
    offset = 0,
    limit = 20,
  ): Promise<OrderWithItems[]> {
    return prisma.order.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      include: { orderItems: true },
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  async getOrderById(orderId: number): Promise<OrderWithItems | null> {
    return prisma.order.findUnique({
      where: { orderId },
      include: { orderItems: true },
    });
  }

  async editOrderStatus(
    orderId: number,
    status: Status,
  ): Promise<OrderWithItems> {
    return prisma.order.update({
      where: { orderId },
      data: { status },
      include: { orderItems: true },
    });
  }

  async getAllOrders(offset = 0, limit = 20): Promise<OrderWithItems[]> {
    return prisma.order.findMany({
      include: { orderItems: true },
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }
}
