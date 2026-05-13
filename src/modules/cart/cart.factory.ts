// cart.factory.ts
// This factory is responsible for creating the CartController with all its dependencies.

import CartService from "./CartService.js";
import CartController from "./CartController.js";
import { CartRepository } from "../../repositories/CartRepository.js";
import { ProductRepository } from "../../repositories/ProductRepository.js";

export function makeCartController() {
  const cartRepository = new CartRepository();
  const productRepository = new ProductRepository();
  const cartService = new CartService(cartRepository, productRepository);

  return new CartController(cartService);
}
