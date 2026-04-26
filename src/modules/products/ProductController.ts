import { Request, Response } from "express";
import ProductService from "./ProductService.js";
import { CreateProductInput } from "../../schemas/product.schema.js";
import { AppError } from "../../common/AppError.js";

class ProductController {
  constructor(private service: ProductService) {}

  async createProduct(req: Request, res: Response) {
    const userId = req.userId;
    if (!userId) {
      throw new AppError(401, "Not Authenticated");
    }
    const data: CreateProductInput = req.body;
    const product = await this.service.createProduct(data, userId);
    return res.status(201).json(product);
  }
  async editProduct(req: Request, res: Response) {
    const userId = req.userId;
    let productId = Number(req.params.productId);
    if (!productId) {
      throw new AppError(401, "Product id not valid");
    }
    if (!userId) {
      throw new AppError(401, "Not Authenticated");
    }
    const data: CreateProductInput = req.body;
    const product = await this.service.editProduct(data, userId, productId);
    return res.status(200).json(product);
  }
  async deleteProduct(req: Request, res: Response) {
    let productId = Number(req.params.productId);
    const product = await this.service.deleteProduct(productId);
    return res.status(204).json(product);
  }
  async listProducts(req: Request, res: Response) {
    const products = await this.service.listProducts();
    return res.status(200).json(products);
  }
}

export default ProductController;
