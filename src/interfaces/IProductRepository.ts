import { Product } from "@prisma/client";
import { ProductWithImages } from "../types/product.types.js";

import {
  CreateProductInput,
  EditProductInput,
} from "../schemas/product.schema.js";

export interface IProductRepository {
  createProduct(data: CreateProductInput): Promise<Product>;

  editProduct(data: EditProductInput, productId: number): Promise<Product>;

  deleteProduct(productId: number): Promise<Product>;
  getProduct(productId: number): Promise<ProductWithImages>;

  getProducts(
    limit: number,
    offset: number,
  ): Promise<{
    products: ProductWithImages[];
    total: number;
  }>;

  findProductById(productId: number): Promise<ProductWithImages | null>;
}
