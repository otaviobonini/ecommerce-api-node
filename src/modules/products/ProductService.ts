import {
  CreateProductInput,
  EditProductInput,
} from "../../schemas/product.schema.js";
import { IProductRepository } from "../../types/IProductRepository.js";
import { redis } from "../../database/redis.js";
import { invalidateCache } from "../../database/cache.js";
import { IImageRepository } from "../../types/IImageRepository.js";
import { IS3Gateway } from "../../types/IS3Gateway.js";
import { AppError } from "../../common/AppError.js";
import { randomUUID } from "crypto";

class ProductService {
  constructor(
    private product: IProductRepository,
    private image: IImageRepository,
    private storage: IS3Gateway,
  ) {}

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

  // This methods are going to handle images logic with s3
  async uploadProductImage(
    productId: number,
    buffer: Buffer,
    mimetype: string,
  ) {
    const product = await this.product.findProductById(productId);
    if (!product) throw new AppError(404, "Product not found");

    const key = `products/${productId}/${randomUUID()}`;
    const url = await this.storage.uploadFile(buffer, key, mimetype);
    return this.image.uploadImage(productId, url);
  }

  async deleteProductImage(productId: number, imageId: number) {
    const image = await this.image.findImageById(imageId);
    if (!image) throw new AppError(404, "Image not found");
    if (image.productId !== productId)
      throw new AppError(403, "Image does not belong to this product");

    const key = new URL(image.url).pathname.slice(1);
    await this.storage.deleteFile(key);
    return this.image.deleteImage(imageId);
  }

  async setPrimaryImage(productId: number, imageId: number) {
    const image = await this.image.findImageById(imageId);
    if (!image) throw new AppError(404, "Image not found");
    if (image.productId !== productId)
      throw new AppError(403, "Image does not belong to this product");
    return this.image.setPrimaryImage(productId, imageId);
  }
}

export default ProductService;
