import CartController from "./CartController.js";
import { Router } from "express";
import CartService from "./CartService.js";
import { CartRepository } from "../../repositories/CartRepository.js";
import { ProductRepository } from "../../repositories/ProductRepository.js";
import { validateRequest } from "../../middlewares/validate.js";
import {
  CartIdParamSchema,
  CartItemIdParamSchema,
  CreateCartItemSchema,
  UpdateCartItemQuantitySchema,
} from "../../schemas/cart.schema.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

const router = Router();

const controller = new CartController(
  new CartService(new CartRepository(), new ProductRepository()),
);

// Cart
router.get("/carts", authMiddleware, controller.getCart.bind(controller));

router.post("/carts", authMiddleware, controller.createCart.bind(controller));

router.delete(
  "/carts/:cartId",
  authMiddleware,
  validateRequest(CartIdParamSchema, "params"),
  controller.clearCart.bind(controller),
);

// Cart Items
router.get(
  "/carts/:cartId/items",
  authMiddleware,
  validateRequest(CartIdParamSchema, "params"),
  controller.getCartItem.bind(controller),
);

router.post(
  "/carts/items",
  authMiddleware,
  validateRequest(CreateCartItemSchema, "body"),
  controller.createCartItem.bind(controller),
);

router.delete(
  "/carts/items/:cartItemId",
  authMiddleware,
  validateRequest(CartItemIdParamSchema, "params"),
  controller.deleteCartItem.bind(controller),
);

router.patch(
  "/carts/items/:cartItemId",
  authMiddleware,
  validateRequest(CartItemIdParamSchema, "params"),
  validateRequest(UpdateCartItemQuantitySchema, "body"),
  controller.cartQuantityItem.bind(controller),
);

export default router;
