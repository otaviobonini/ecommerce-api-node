import { Router } from "express";
import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { adminMiddleware } from "../../middlewares/adminMiddleware.js";
import { validateRequest } from "../../middlewares/validate.js";
import {
  CreateOrderSchema,
  GetAllOrdersSchema,
  GetUserOrdersSchema,
  OrderIdParamSchema,
} from "../../schemas/order.schema.js";
import { makeOrderController } from "./order.factory.js";
import { AuthenticatedRequest } from "../../types/authenticatedRequest.js";

const router = Router();

const controller = makeOrderController();

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
  authMiddleware,
  validateRequest(CreateOrderSchema, "body"),
  (req, res) => controller.createOrder(req as AuthenticatedRequest, res),
);
router.get(
  "/orders/me",
  authMiddleware,
  validateRequest(GetUserOrdersSchema, "query"),

  (req, res) => controller.getUserOrders(req as AuthenticatedRequest, res),
);
router.get(
  "/orders/:orderId",
  authMiddleware,
  validateRequest(OrderIdParamSchema, "params"),
  (req, res) => controller.getOrderById(req as AuthenticatedRequest, res),
);

// Admin
router.get(
  "/orders",
  authMiddleware,
  adminMiddleware,
  validateRequest(GetAllOrdersSchema, "query"),
  controller.getAllOrders.bind(controller),
);

export default router;
