import { Request, Response } from "express";
import ProductService from "./ProductService.js";
import {
  CreateProductInput,
  GetProductsQueryInput,
} from "../../schemas/product.schema.js";
import { AppError } from "../../common/AppError.js";

class ProductController {
  constructor(private service: ProductService) {}

  async createProduct(req: Request, res: Response): Promise<Response> {
    const data: CreateProductInput = req.body;
    const product = await this.service.createProduct(data);
    return res.status(201).json(product);
  }
  async editProduct(req: Request, res: Response): Promise<Response> {
    const data: CreateProductInput = req.body;
    const productId = Number(req.params.productId);
    const product = await this.service.editProduct(data, productId);
    return res.status(200).json(product);
  }
  async deleteProduct(req: Request, res: Response): Promise<Response> {
    let productId = Number(req.params.productId);
    await this.service.deleteProduct(productId);
    return res.status(204).send();
  }
  async listProducts(req: Request, res: Response): Promise<Response> {
    const { limit, offset } = req.query as unknown as GetProductsQueryInput;
    const products = await this.service.listProducts(limit, offset);
    return res.status(200).json(products);
  }
}

export default ProductController;
