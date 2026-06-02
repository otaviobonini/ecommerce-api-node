import {
  CreateProductInput,
  EditProductInput,
} from "../../schemas/product.schema.js";
import { IProductRepository } from "../../types/IProductRepository.js";
import { redis } from "../../database/redis.js";
import { invalidateCache } from "../../database/cache.js";

class ProductService {
  constructor(private product: IProductRepository) {}

  async createProduct(data: CreateProductInput) {
    const product = await this.product.createProduct(data);
    await invalidateCache("products:*");
    return product;
  }

  async editProduct(data: EditProductInput, productId: number) {
    const product = await this.product.editProduct(data, productId);
    await invalidateCache("products:*");
    return product;
  }
  async deleteProduct(productId: number) {
    const product = await this.product.deleteProduct(productId);
    await invalidateCache("products:*");
    return product;
  }
  async listProducts(limit = 10, offset = 0) {
    const productsFromCache = await redis.get(`products:${limit}:${offset}`);
    if (productsFromCache) {
      return JSON.parse(productsFromCache);
    }
    const products = await this.product.getProducts(limit, offset);
    await redis.set(
      `products:${limit}:${offset}`,
      JSON.stringify(products),
      "EX",
      60 * 1, // Cache for 1 minute
    );
    return products;
  }
}

export default ProductService;
