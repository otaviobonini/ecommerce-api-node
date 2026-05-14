// product.factory.ts
// This factory is responsible for creating the ProductController with all its dependencies.

import { ProductRepository } from "../../repositories/ProductRepository.js";
import ProductController from "./ProductController.js";
import ProductService from "./ProductService.js";

export function makeProductController() {
  return new ProductController(new ProductService(new ProductRepository()));
}
