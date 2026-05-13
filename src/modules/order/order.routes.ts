import { Router } from "express";
import express from "express";
import OrderController from "./OrderController.js";
import OrderService from "./OrderService.js";
import { OrderRepository } from "../../repositories/OrderRepository.js";
import { CartRepository } from "../../repositories/CartRepository.js";
import { StripeGateway } from "../../providers/StripeGateway.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { adminMiddleware } from "../../middlewares/adminMiddleware.js";

const router = Router();

const controller = new OrderController(
  new OrderService(
    new StripeGateway(),
    new OrderRepository(),
    new CartRepository(),
  ),
);

// Web hook route (no auth and raw)
router.post(
  "/orders/webhook",
  express.raw({ type: "application/json" }),
  controller.handleWebhook.bind(controller),
);

// Authenticated routes
router.post("/orders", authMiddleware, controller.createOrder.bind(controller));
router.get(
  "/orders/me",
  authMiddleware,
  controller.getUserOrders.bind(controller),
);
router.get(
  "/orders/:orderId",
  authMiddleware,
  controller.getOrderById.bind(controller),
);

// Admin
router.get(
  "/orders",
  authMiddleware,
  adminMiddleware,
  controller.getAllOrders.bind(controller),
);

export default router;
