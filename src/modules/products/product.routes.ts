import { Router } from "express";
import ProductController from "./ProductController.js";
import {
  CreateProductSchema,
  EditProductSchema,
  GetProductsQuerySchema,
  ProductIdParamSchema,
} from "../../schemas/product.schema.js";
import { validateRequest } from "../../middlewares/validate.js";
import ProductService from "./ProductService.js";
import { ProductRepository } from "../../repositories/ProductRepository.js";
import { adminMiddleware } from "../../middlewares/adminMiddleware.js";

const Controller = new ProductController(
  new ProductService(new ProductRepository()),
);

const router = Router();

router.get(
  "/products",
  validateRequest(GetProductsQuerySchema, "query"),
  Controller.listProducts.bind(Controller),
);
router.post(
  "/product",
  adminMiddleware,
  validateRequest(CreateProductSchema, "body"),
  Controller.createProduct.bind(Controller),
);
router.delete(
  "/product/:productId",
  adminMiddleware,
  validateRequest(ProductIdParamSchema, "params"),
  Controller.deleteProduct.bind(Controller),
);

router.patch(
  "/product/:productId",
  adminMiddleware,
  validateRequest(ProductIdParamSchema, "params"),
  validateRequest(EditProductSchema, "body"),
  Controller.editProduct.bind(Controller),
);

export default router;
