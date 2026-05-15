import { Router } from "express";

import { validateRequest } from "../../middlewares/validate.js";
import {
  CartIdParamSchema,
  CartItemIdParamSchema,
  CreateCartItemSchema,
  UpdateCartItemQuantitySchema,
} from "../../schemas/cart.schema.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { makeCartController } from "./cart.factory.js";
import { AuthenticatedRequest } from "../../types/authenticatedRequest.js";

const router = Router();

const controller = makeCartController();

// Cart
router.get("/carts", authMiddleware, (req, res) =>
  controller.getCart(req as AuthenticatedRequest, res),
);
router.post("/carts", authMiddleware, (req, res) =>
  controller.createCart(req as AuthenticatedRequest, res),
);
router.delete(
  "/carts/:cartId",
  authMiddleware,
  validateRequest(CartIdParamSchema, "params"),
  (req, res) => controller.clearCart(req as AuthenticatedRequest, res),
);

// Cart Items
router.get(
  "/carts/:cartId/items",
  authMiddleware,
  validateRequest(CartIdParamSchema, "params"),
  (req, res) => controller.getCartItem(req as AuthenticatedRequest, res),
);

router.post(
  "/carts/items",
  authMiddleware,
  validateRequest(CreateCartItemSchema, "body"),
  (req, res) => controller.createCartItem(req as AuthenticatedRequest, res),
);

router.delete(
  "/carts/items/:cartItemId",
  authMiddleware,
  validateRequest(CartItemIdParamSchema, "params"),
  (req, res) => controller.deleteCartItem(req as AuthenticatedRequest, res),
);

router.patch(
  "/carts/items/:cartItemId",
  authMiddleware,
  validateRequest(CartItemIdParamSchema, "params"),
  validateRequest(UpdateCartItemQuantitySchema, "body"),
  (req, res) => controller.cartQuantityItem(req as AuthenticatedRequest, res),
);

export default router;
