import { Prisma, Status } from "@prisma/client";

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    orderItems: true;
  };
}>;

export type AdminOrder = Prisma.OrderGetPayload<{
  select: {
    orderId: true;
    status: true;
    total: true;
    paymentLink: true;
    createdAt: true;
    updatedAt: true;

    user: {
      select: {
        userId: true;
        username: true;
        email: true;
      };
    };

    address: {
      select: {
        addressId: true;
        street: true;
        city: true;
        state: true;
        zipCode: true;
        isDefault: true;
      };
    };

    orderItems: {
      select: {
        orderItemId: true;
        orderId: true;
        productId: true;
        quantity: true;
        priceAtTime: true;

        product: {
          select: {
            productId: true;
            productName: true;
            productPrice: true;
            productDescription: true;
            stock: true;
            isFeatured: true;

            category: {
              select: {
                categoryId: true;
                name: true;
                categoryImage: true;
              };
            };

            images: {
              select: {
                imageId: true;
                url: true;
                isPrimary: true;
              };
            };
          };
        };
      };
    };
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
  getOrdersByUserId(
    userId: number,
    status?: Status,
    offset?: number,
    limit?: number,
  ): Promise<OrderWithItems[]>;
  getOrderById(orderId: number): Promise<OrderWithItems | null>;
  editOrderStatus(orderId: number, status: Status): Promise<OrderWithItems>;
  getAllOrders(offset?: number, limit?: number): Promise<AdminOrder[]>;
}
