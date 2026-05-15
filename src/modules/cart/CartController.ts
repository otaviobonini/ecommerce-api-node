import { AppError } from "../../common/AppError.js";
import { CreateCartItemInput } from "../../schemas/cart.schema.js";
import { AuthenticatedRequest } from "../../types/authenticatedRequest.js";
import CartService from "./CartService.js";
import { Request, Response } from "express";

class CartController {
  constructor(private service: CartService) {}
  async createCart(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    const userId = req.userId;

    const cart = await this.service.createCart(userId);
    return res.status(201).json(cart);
  }
  async getCart(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = req.userId;
    const cart = await this.service.getCart(userId);
    return res.status(200).json(cart);
  }
  async clearCart(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const cartId = Number(req.params.cartId);
    const userId = req.userId;
    await this.service.cleanCart(cartId, userId);
    return res.status(204).send();
  }
  async createCartItem(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    const data = req.body as CreateCartItemInput;
    const userId = req.userId;
    const cartItem = await this.service.createCartItem(data, userId);
    return res.status(201).json(cartItem);
  }
  async getCartItem(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    const cartId = Number(req.params.cartId);
    const userId = req.userId;
    const cartItem = await this.service.getCartItem(cartId, userId);
    return res.status(200).json(cartItem);
  }
  async deleteCartItem(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    const cartItemId = Number(req.params.cartItemId);
    const userId = req.userId;
    await this.service.deleteCartItem(cartItemId, userId);
    return res.status(204).send();
  }
  async cartQuantityItem(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    const cartItemId = Number(req.params.cartItemId);
    const userId = req.userId;
    const quantity = req.body.quantity;
    const product = await this.service.cartQuantityItem(
      cartItemId,
      quantity,
      userId,
    );
    return res.status(200).json(product);
  }
}

export default CartController;
