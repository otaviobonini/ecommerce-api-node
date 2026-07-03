import { Request, Response } from "express";
import { prisma } from "../../database/prisma.js";
import { AppError } from "../../common/AppError.js";

export async function getUserDetails(req: Request, res: Response) {
  const userId = req.userId;
  const user = await prisma.user.findUnique({
    where: { userId },
    select: {
      userId: true,
      email: true,
      role: true,
      username: true,
      address: true,
      order: {
        select: {
          orderId: true,
          status: true,
          total: true,
          createdAt: true,
          address: {
            select: {
              addressId: true,
              street: true,
              city: true,
              state: true,
              zipCode: true,
            },
          },
          orderItems: {
            select: {
              orderItemId: true,
              quantity: true,
              priceAtTime: true,
              product: {
                select: {
                  productId: true,
                  productName: true,
                  productPrice: true,
                  images: {
                    where: {
                      isPrimary: true,
                    },
                    select: {
                      url: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  return res.status(200).json(user);
}
