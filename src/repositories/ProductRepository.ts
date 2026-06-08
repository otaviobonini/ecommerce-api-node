import { prisma } from "../database/prisma.js";
import {
  CreateProductInput,
  EditProductInput,
} from "../schemas/product.schema.js";
import { IProductRepository } from "../interfaces/IProductRepository.js";
import { ProductWithImages } from "../types/product.types.js";

export class ProductRepository implements IProductRepository {
  async getProduct(productId: number): Promise<ProductWithImages> {
    const product = await prisma.product.findUniqueOrThrow({
      where: { productId },
      include: { images: true },
    });
    return product;
  }
  async createProduct(data: CreateProductInput) {
    const product = await prisma.product.create({
      data: data,
    });
    return product;
  }
  async editProduct(data: EditProductInput, productId: number) {
    const product = await prisma.product.update({
      where: { productId: productId },
      data: data,
    });
    return product;
  }
  async deleteProduct(productId: number) {
    const product = await prisma.product.delete({ where: { productId } });
    return product;
  }
  async getProducts(limit = 10, offset = 0) {
    const products = await prisma.product.findMany({
      take: limit,
      skip: offset,
      include: { images: true },
    });
    return products;
  }
  async findProductById(productId: number) {
    return await prisma.product.findUnique({
      where: { productId },
      include: { images: true },
    });
  }
}
