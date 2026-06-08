import {
  CreateProductInput,
  EditProductInput,
} from "../../schemas/product.schema.js";
import { IProductRepository } from "../../interfaces/IProductRepository.js";
import { redis } from "../../database/redis.js";
import { invalidateCache } from "../../database/cache.js";
import { IImageRepository } from "../../interfaces/IImageRepository.js";
import { IS3Gateway } from "../../interfaces/IS3Gateway.js";
import { AppError } from "../../common/AppError.js";
import { randomUUID } from "crypto";

class ProductService {
  constructor(
    private product: IProductRepository,
    private image: IImageRepository,
    private storage: IS3Gateway,
  ) {}

  async getProduct(productId: number) {
    const productFromCache = await redis.get(`products:${productId}`);
    if (productFromCache) {
      return JSON.parse(productFromCache);
    }
    const product = await this.product.getProduct(productId);
    if (!product) throw new AppError(404, "Product not found");
    await redis.set(
      `products:${productId}`,
      JSON.stringify(product),
      "EX",
      60 * 10,
    );
    return product;
  }
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
    const { products, total } = await this.product.getProducts(limit, offset);
    const hasNext = limit + offset < total;
    const hasPrevious = offset > 0;
    const result = { products, limit, offset, total, hasPrevious, hasNext };
    await redis.set(
      `products:${limit}:${offset}`,
      JSON.stringify(result),
      "EX",
      60 * 1, // Cache for 1 minute
    );
    return result;
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
    await invalidateCache("products:*");
    return this.image.uploadImage(productId, url);
  }

  async deleteProductImage(productId: number, imageId: number) {
    const image = await this.image.findImageById(imageId);
    if (!image) throw new AppError(404, "Image not found");
    if (image.productId !== productId)
      throw new AppError(403, "Image does not belong to this product");

    const key = new URL(image.url).pathname.slice(1);
    await this.storage.deleteFile(key);
    await invalidateCache("products:*");
    return this.image.deleteImage(imageId);
  }

  async setPrimaryImage(productId: number, imageId: number) {
    const image = await this.image.findImageById(imageId);
    if (!image) throw new AppError(404, "Image not found");
    if (image.productId !== productId)
      throw new AppError(403, "Image does not belong to this product");
    await invalidateCache("products:*");
    return this.image.setPrimaryImage(productId, imageId);
  }
}

export default ProductService;
