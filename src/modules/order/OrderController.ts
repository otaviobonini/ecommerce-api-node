import OrderService from "./OrderService.js";
import { Request, Response } from "express";
import { AppError } from "../../common/AppError.js";
import { AuthenticatedRequest } from "../../types/express.js";

class OrderController {
  constructor(private service: OrderService) {}

  async createOrder(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;

    const { addressId } = req.body;
    const result = await this.service.createOrder(userId, addressId);
    return res.status(201).json(result);
  }
  async handleWebhook(req: Request, res: Response) {
    const signature = req.headers["stripe-signature"] as string;
    if (!signature) throw new AppError(400, "Missing stripe signature");

    await this.service.handleWebhook(req.body as Buffer, signature);
    return res.status(200).json({ received: true });
  }
  async getOrderById(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const orderId = Number(req.params.orderId);
    const order = await this.service.getOrderById(orderId, userId);
    return res.status(200).json(order);
  }
  async getUserOrders(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;

    const { status, offset, limit } = req.query;
    const orders = await this.service.getOrdersByUserId(
      userId,
      status as string | undefined,
      Number(offset) || 0,
      Number(limit) || 20,
    );
    return res.status(200).json(orders);
  }
  async getAllOrders(req: Request, res: Response) {
    const { offset, limit } = req.query;
    const orders = await this.service.getAllOrders(
      Number(offset) || 0,
      Number(limit) || 20,
    );
    return res.status(200).json(orders);
  }
}
export default OrderController;
