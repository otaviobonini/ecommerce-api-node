import { CartRepository } from "../../repositories/CartRepository.js";
import { CreateCartDTO, CreateCartItemDTO } from "../../types/cart.types.js";

class CartService {
  constructor(private cart: CartRepository) {}
  async CreateCart(userId: number) {
    const cart = this.cart.createCart(userId);
    return cart;
  }
  async CleanCart(cartId: number) {
    const cart = this.cart.clearCart(cartId);
    return cart;
  }
  async CreateCartItem(data: CreateCartItemDTO) {
    const cartItem = this.cart.createCartItem(data);
    return cartItem;
  }
  async GetCartItem(cartId: number) {
    const cartItem = this.cart.getCartItems(cartId);
    return cartItem;
  }
  async GetCart(userId: number) {
    const cart = this.cart.findCartByUserId(userId);
    return cart;
  }
  async DeleteCartItem(cartItemId: number) {
    const cartItem = this.cart.deleteCartItem(cartItemId);
    return cartItem;
  }
  async CartQuantityItem(cartItemId: number, quantity: number) {
    const cartItem = this.cart.updateCartItemQuantity(cartItemId, quantity);
    return cartItem;
  }
}

export default CartService;
