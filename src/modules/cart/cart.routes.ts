import CartController from "./CartController.js";
import { Router } from "express";
import CartService from "./CartService.js";
import { CartRepository } from "../../repositories/CartRepository.js";

const router = Router();

const controller = new CartController(new CartService(new CartRepository()));

router.get("/cart", controller.GetCart.bind(controller));
router.post("/cart", controller.CreateCart.bind(controller));
router.put("/cart/:cartId", controller.ClearCart.bind(controller));
router.get("/cartItem/:cartId", controller.GetCartItem.bind(controller));
router.post("/cartItem", controller.CreateCartItem.bind(controller));
router.delete(
  "/cartItem/:cartItemId",
  controller.DeleteCartItem.bind(controller),
);

export default router;
