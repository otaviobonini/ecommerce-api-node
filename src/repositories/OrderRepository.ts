import { Status } from "@prisma/client";
import { prisma } from "../database/prisma.js";
import { IOrderRepository, OrderWithItems } from "../types/IOrderRepository.js";
import { AppError } from "../common/AppError.js";

export class OrderRepository implements IOrderRepository {
  async createOrder(params: {
    userId: number;
    addressId: number;
    total: number;
    items: { productId: number; quantity: number; priceAtTime: number }[];
  }): Promise<OrderWithItems> {
    const { userId, addressId, total, items } = params;

    return prisma.$transaction(async (trx) => {
      for (const item of items) {
        const updated = await trx.product.updateMany({
          where: {
            productId: item.productId,
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (updated.count === 0) {
          throw new AppError(400, "Insufficient stock for product");
        }
      }
      return trx.order.create({
        data: {
          userId,
          addressId,
          total,
          orderItems: { create: items },
        },
        include: { orderItems: true },
      });
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

  async restoreStock(orderId: number): Promise<void> {
    const items = await prisma.orderItem.findMany({ where: { orderId } });
    await prisma.$transaction(async (trx) => {
      for (const item of items) {
        await trx.product.update({
          where: { productId: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
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
  async cancelOrder(orderId: number): Promise<void> {
    await prisma.$transaction(async (trx) => {
      const items = await trx.orderItem.findMany({ where: { orderId } });

      // Restore the stock
      for (const item of items) {
        await trx.product.update({
          where: { productId: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      // Delete the order (cascade deletes the order items)
      await trx.order.delete({ where: { orderId } });
    });
  }
}
