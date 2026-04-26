import { Router } from "express";
import ProductController from "./ProductController.js";
import { CreateProductSchema } from "../../schemas/product.schema.js";
import { validateRequest } from "../../middlewares/validate.js";
import ProductService from "./ProductService.js";
import { ProductRepository } from "../../repositories/ProductRepository.js";
import { AuthRepository } from "../../repositories/AuthRepository.js";
import { adminMiddleware } from "../../middlewares/adminMiddleware.js";

const Controller = new ProductController(
  new ProductService(new ProductRepository(), new AuthRepository()),
);

const router = Router();

router.get("/products", Controller.listProducts.bind(Controller));
router.post(
  "/product",
  adminMiddleware,
  validateRequest(CreateProductSchema, "body"),
  Controller.createProduct.bind(Controller),
);
router.delete(
  "/product/:productId",
  adminMiddleware,
  Controller.deleteProduct.bind(Controller),
);

router.patch(
  "/product/:productId",
  adminMiddleware,
  Controller.editProduct.bind(Controller),
);

export default router;
