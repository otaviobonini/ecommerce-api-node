import { Router } from "express";
import {
  CreateProductSchema,
  EditProductSchema,
  GetProductsQuerySchema,
  ProductIdParamSchema,
} from "../../schemas/product.schema.js";
import { validateRequest } from "../../middlewares/validate.js";
import { adminMiddleware } from "../../middlewares/adminMiddleware.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { makeProductController } from "./product.factory.js";

const Controller = makeProductController();

const router = Router();

router.get(
  "/product",
  validateRequest(GetProductsQuerySchema, "query"),
  Controller.listProducts.bind(Controller),
);
router.post(
  "/product",
  authMiddleware,
  adminMiddleware,
  validateRequest(CreateProductSchema, "body"),
  Controller.createProduct.bind(Controller),
);
router.delete(
  "/product/:productId",
  authMiddleware,
  adminMiddleware,
  validateRequest(ProductIdParamSchema, "params"),
  Controller.deleteProduct.bind(Controller),
);

router.patch(
  "/product/:productId",
  authMiddleware,
  adminMiddleware,
  validateRequest(ProductIdParamSchema, "params"),
  validateRequest(EditProductSchema, "body"),
  Controller.editProduct.bind(Controller),
);

export default router;
