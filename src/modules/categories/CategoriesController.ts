import { AppError } from "../../common/AppError.js";
import { CategoriesService } from "./CategoriesService.js";
import { Request, Response } from "express";

export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  async createCategory(req: Request, res: Response) {
    const { name } = req.body;
    const category = await this.categoryService.createCategory(name);
    return res.status(201).json(category);
  }

  async deleteCategory(req: Request, res: Response) {
    const categoryId = Number(req.params.categoryId);
    await this.categoryService.deleteCategory(categoryId);
    return res.status(204).send();
  }

  async findAll(req: Request, res: Response) {
    const categories = await this.categoryService.findAll();
    return res.status(200).json(categories);
  }

  async getProductsByCategory(req: Request, res: Response) {
    const categoryId = Number(req.params.categoryId);
    const { offset, limit } = req.query;
    const products = await this.categoryService.getProductsByCategory(
      categoryId,
      Number(offset) || 0,
      Number(limit) || 20,
    );
    return res.status(200).json(products);
  }

  async getFeaturedProducts(req: Request, res: Response) {
    const { offset, limit } = req.query;
    const products = await this.categoryService.getFeaturedProducts(
      Number(offset) || 0,
      Number(limit) || 20,
    );
    return res.status(200).json(products);
  }
  async uploadImage(req: Request, res: Response): Promise<Response> {
    const productId = Number(req.params.productId);
    if (!req.file) throw new AppError(400, "No file provided");
    const image = await this.categoryService.uploadCategoryImage(
      productId,
      req.file.buffer,
      req.file.mimetype,
    );
    return res.status(201).json(image);
  }
}
