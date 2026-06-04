import { Router } from "express";
import { makeCategoriesController } from "./categories.factory.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { adminMiddleware } from "../../middlewares/adminMiddleware.js";
import { validateRequest } from "../../middlewares/validate.js";
import {
  CreateCategorySchema,
  CategoryIdParamSchema,
  GetProductsSchema,
} from "../../schemas/category.schema.js";

const router = Router();
const controller = makeCategoriesController();

// Públicas
router.get("/categories", controller.findAll.bind(controller));

router.get(
  "/categories/featured/products",
  validateRequest(GetProductsSchema, "query"),
  controller.getFeaturedProducts.bind(controller),
);

router.get(
  "/categories/:categoryId/products",
  validateRequest(CategoryIdParamSchema, "params"),
  validateRequest(GetProductsSchema, "query"),
  controller.getProductsByCategory.bind(controller),
);

// Admin
router.post(
  "/categories",
  authMiddleware,
  adminMiddleware,
  validateRequest(CreateCategorySchema, "body"),
  controller.createCategory.bind(controller),
);

router.delete(
  "/categories/:categoryId",
  authMiddleware,
  adminMiddleware,
  validateRequest(CategoryIdParamSchema, "params"),
  controller.deleteCategory.bind(controller),
);

export default router;
