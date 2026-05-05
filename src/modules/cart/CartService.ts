import { CartRepository } from "../../repositories/CartRepository.js";
import { CreateCartItemDTO } from "../../types/cart.types.js";
import { AppError } from "../../common/AppError.js";
import { ProductRepository } from "../../repositories/ProductRepository.js";

class CartService {
  constructor(
    private cart: CartRepository,
    private product: ProductRepository,
  ) {}
  async createCart(userId: number) {
    const cart = await this.cart.createCart(userId);
    return cart;
  }
  async cleanCart(cartId: number, userId: number) {
    const cart = await this.cart.findCartById(cartId);
    if (!cart) {
      throw new AppError(404, "Cart not found");
    }
    if (cart.userId !== userId) {
      throw new AppError(403, "Forbidden");
    }
    return this.cart.clearCart(cartId);
  }
  async createCartItem(data: CreateCartItemDTO, userId: number) {
    const product = await this.product.findProductById(data.productId);
    if (!product) {
      throw new AppError(404, "Product not found");
    }
    const cart = await this.cart.findCartByUserId(userId);
    if (data.cartId !== cart?.cartId) {
      throw new AppError(403, "Forbidden");
    }

    const existingItem = await this.cart.findCartItem(
      cart.cartId,
      data.productId,
    );
    const finalQuantity = (existingItem?.quantity ?? 0) + data.quantity;

    if (finalQuantity > product.stock) {
      throw new AppError(400, "Insufficient stock");
    }

    const cartItem = await this.cart.upsertCartItem(
      cart.cartId,
      data.productId,
      data.quantity,
    );
    return cartItem;
  }
  async getCartItem(cartId: number, userId: number) {
    const cart = await this.cart.findCartById(cartId);
    if (!cart) throw new AppError(404, "Cart not found");
    if (cart.userId !== userId) throw new AppError(403, "Forbidden");
    return this.cart.getCartItems(cartId);
  }

  async getCart(userId: number) {
    const cart = await this.cart.findCartByUserId(userId);
    return cart;
  }
  async deleteCartItem(cartItemId: number, userId: number) {
    // Busca o item e verifica se o cart pertence ao usuário
    const item = await this.cart.findCartItemById(cartItemId);
    if (!item) throw new AppError(404, "Cart item not found");

    const cart = await this.cart.findCartById(item.cartId);
    if (!cart || cart.userId !== userId) throw new AppError(403, "Forbidden");

    return this.cart.deleteCartItem(cartItemId);
  }
  async cartQuantityItem(cartItemId: number, quantity: number, userId: number) {
    const item = await this.cart.findCartItemById(cartItemId);
    if (!item) throw new AppError(404, "Cart item not found");
    const product = await this.product.findProductById(item.productId);

    if (!product) {
      throw new AppError(404, "Product not found");
    }

    if (quantity > product.stock) {
      throw new AppError(400, "Insufficient stock");
    }
    const cart = await this.cart.findCartById(item.cartId);
    if (!cart || cart.userId !== userId) throw new AppError(403, "Forbidden");
    const cartItem = await this.cart.updateCartItemQuantity(
      cartItemId,
      quantity,
    );
    return cartItem;
  }
}

export default CartService;
