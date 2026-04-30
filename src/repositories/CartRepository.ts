import { prisma } from "../database/prisma.js";
import { CreateCartDTO, CreateCartItemDTO } from "../types/cart.types.js";

export class CartRepository {
  async createCart(userId: number) {
    const cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
    return cart;
  }
  async createCartItem(data: CreateCartItemDTO) {
    const cartItem = await prisma.cartItem.create({ data: data });
    return cartItem;
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
}
