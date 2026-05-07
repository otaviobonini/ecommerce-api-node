import { prisma } from "../database/prisma.js";

export class CartRepository {
  async createCart(userId: number) {
    const cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
    return cart;
  }
  async upsertCartItem(cartId: number, productId: number, quantity: number) {
    return prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      create: {
        cartId,
        productId,
        quantity,
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
    });
  }
  async findCartItem(cartId: number, productId: number) {
    return prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });
  }
  async updateCartItemQuantity(cartItemId: number, quantity: number) {
    return prisma.cartItem.update({
      where: { cartItemId },
      data: { quantity },
    });
  }
  async clearCart(cartId: number) {
    return prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
  async getCartItems(cartId: number) {
    return prisma.cartItem.findMany({
      where: { cartId },
      include: {
        product: true,
      },
    });
  }
  async deleteCartItem(cartItemId: number) {
    return prisma.cartItem.delete({
      where: { cartItemId },
    });
  }
  async findCartByUserId(userId: number) {
    return prisma.cart.findUnique({
      where: { userId },
    });
  }
  async findCartById(cartId: number) {
    return prisma.cart.findUnique({ where: { cartId } });
  }

  async findCartItemById(cartItemId: number) {
    return prisma.cartItem.findUnique({ where: { cartItemId } });
  }
}
