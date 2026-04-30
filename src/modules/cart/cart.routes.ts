import CartController from "./CartController.js";
import { Router } from "express";
import CartService from "./CartService.js";
import { CartRepository } from "../../repositories/CartRepository.js";
import { validateRequest } from "../../middlewares/validate.js";
import {
  CartIdParamSchema,
  CreateCartItemSchema,
} from "../../schemas/cart.schema.js";

const router = Router();

const controller = new CartController(new CartService(new CartRepository()));

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
  validateRequest(CartIdParamSchema, "params"),
  controller.deleteCartItem.bind(controller),
);

export default router;
