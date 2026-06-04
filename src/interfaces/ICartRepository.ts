import { Cart, CartItem, Product } from "@prisma/client";

export interface ICartRepository {
  createCart(userId: number): Promise<Cart>;

  upsertCartItem(
    cartId: number,
    productId: number,
    quantity: number,
  ): Promise<CartItem>;

  findCartItem(cartId: number, productId: number): Promise<CartItem | null>;

  updateCartItemQuantity(
    cartItemId: number,
    quantity: number,
  ): Promise<CartItem>;

  clearCart(cartId: number): Promise<{ count: number }>;

  getCartItems(cartId: number): Promise<
    (CartItem & {
      product: Product;
    })[]
  >;

  deleteCartItem(cartItemId: number): Promise<CartItem>;

  findCartByUserId(userId: number): Promise<Cart | null>;

  findCartById(cartId: number): Promise<Cart | null>;

  findCartItemById(cartItemId: number): Promise<CartItem | null>;
}
