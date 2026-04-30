import { CartRepository } from "../../repositories/CartRepository.js";
import { CreateCartDTO, CreateCartItemDTO } from "../../types/cart.types.js";

class CartService {
  constructor(private cart: CartRepository) {}
  async createCart(userId: number) {
    const cart = await this.cart.createCart(userId);
    return cart;
  }
  async cleanCart(cartId: number) {
    const cart = await this.cart.clearCart(cartId);
    return cart;
  }
  async createCartItem(data: CreateCartItemDTO) {
    const cartItem = await this.cart.createCartItem(data);
    return cartItem;
  }
  async getCartItem(cartId: number) {
    const cartItem = await this.cart.getCartItems(cartId);
    return cartItem;
  }
  async getCart(userId: number) {
    const cart = await this.cart.findCartByUserId(userId);
    return cart;
  }
  async deleteCartItem(cartItemId: number) {
    const cartItem = await this.cart.deleteCartItem(cartItemId);
    return cartItem;
  }
  async cartQuantityItem(cartItemId: number, quantity: number) {
    const cartItem = await this.cart.updateCartItemQuantity(
      cartItemId,
      quantity,
    );
    return cartItem;
  }
}

export default CartService;
