import { Product } from "@prisma/client";

import {
  CreateProductInput,
  EditProductInput,
} from "../schemas/product.schema.js";

export interface IProductRepository {
  createProduct(data: CreateProductInput): Promise<Product>;

  editProduct(data: EditProductInput, productId: number): Promise<Product>;

  deleteProduct(productId: number): Promise<Product>;

  getProducts(limit: number, offset: number): Promise<Product[]>;

  findProductById(productId: number): Promise<Product | null>;
}
