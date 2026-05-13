import { Router } from "express";
import express from "express";
import OrderController from "./OrderController.js";
import OrderService from "./OrderService.js";
import { OrderRepository } from "../../repositories/OrderRepository.js";
import { CartRepository } from "../../repositories/CartRepository.js";
import { StripeGateway } from "../../providers/StripeGateway.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { adminMiddleware } from "../../middlewares/adminMiddleware.js";
import { validateRequest } from "../../middlewares/validate.js";
import {
  CreateOrderSchema,
  GetAllOrdersSchema,
  GetUserOrdersSchema,
  OrderIdParamSchema,
} from "../../schemas/order.schema.js";
import { AddressRepository } from "../../repositories/AddressRepository.js";

const router = Router();

const controller = new OrderController(
  new OrderService(
    new StripeGateway(),
    new OrderRepository(),
    new CartRepository(),
    new AddressRepository(),
  ),
);

// Web hook route (no auth and raw)
export const webhookRouter = Router();
webhookRouter.post(
  "/orders/webhook",
  express.raw({ type: "application/json" }),
  controller.handleWebhook.bind(controller),
);

// Authenticated routes
router.post(
  "/orders",
  validateRequest(CreateOrderSchema, "body"),
  authMiddleware,
  controller.createOrder.bind(controller),
);
router.get(
  "/orders/me",
  validateRequest(GetUserOrdersSchema, "query"),
  authMiddleware,
  controller.getUserOrders.bind(controller),
);
router.get(
  "/orders/:orderId",
  validateRequest(OrderIdParamSchema, "params"),
  authMiddleware,
  controller.getOrderById.bind(controller),
);

// Admin
router.get(
  "/orders",
  validateRequest(GetAllOrdersSchema, "query"),
  authMiddleware,
  adminMiddleware,
  controller.getAllOrders.bind(controller),
);

export default router;
