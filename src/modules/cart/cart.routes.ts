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

const router = Router();

const controller = new CartController(
  new CartService(new CartRepository(), new ProductRepository()),
);

router.get("/cart", controller.getCart.bind(controller));
router.post("/cart", controller.createCart.bind(controller));
router.delete(
  "/cart/:cartId",
  validateRequest(CartIdParamSchema, "params"),
  controller.clearCart.bind(controller),
);
router.get(
  "/cartItem/:cartId",
  validateRequest(CartIdParamSchema, "params"),
  controller.getCartItem.bind(controller),
);
router.post(
  "/cartItem",
  validateRequest(CreateCartItemSchema, "body"),
  controller.createCartItem.bind(controller),
);
router.delete(
  "/cartItem/:cartItemId",
  validateRequest(CartItemIdParamSchema, "params"),
  controller.deleteCartItem.bind(controller),
);

router.patch(
  "/cartItem/:cartItemId",
  validateRequest(CartItemIdParamSchema, "params"),
  validateRequest(UpdateCartItemQuantitySchema, "body"),
  controller.cartQuantityItem.bind(controller),
);

export default router;
