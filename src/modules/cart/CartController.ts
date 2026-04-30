import { AppError } from "../../common/AppError.js";
import CartService from "./CartService.js";
import { Request, Response } from "express";

class CartController {
  constructor(private service: CartService) {}
  async CreateCart(req: Request, res: Response) {
    const userId = req.userId;
    if (!userId) {
      throw new AppError(403, "Unauthorized");
    }
    const cart = this.service.CreateCart(userId);
    return res.status(201).json(cart);
  }
  async GetCart(req: Request, res: Response) {
    const userId = req.userId;
    if (!userId) {
      throw new AppError(403, "Unauthorized");
    }
    const cart = this.service.GetCart(userId);
    return res.status(200).json(cart);
  }
  async ClearCart(req: Request, res: Response) {
    const cartId = Number(req.params.cartId);
    if (!cartId) {
      return res.status(200);
    }
    const cart = this.service.CleanCart(cartId);
    return res.status(200).json(cart);
  }
  async CreateCartItem(req: Request, res: Response) {
    const data = req.body;
    const cartItem = this.service.CreateCartItem(data);
    return res.status(201).json(cartItem);
  }
  async GetCartItem(req: Request, res: Response) {
    const cartId = Number(req.params.cartId);
    this.service.GetCartItem(cartId);
  }
  async DeleteCartItem(req: Request, res: Response) {
    const cartItemId = Number(req.params.cartId);
    this.service.DeleteCartItem(cartItemId);
  }
}

export default CartController;
