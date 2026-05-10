import { prisma } from "../database/prisma.js";
import { CreateProductInput } from "../schemas/product.schema.js";

export class ProductRepository {
  async createProduct(data: CreateProductInput) {
    const product = await prisma.product.create({
      data: data,
    });
    return product;
  }
  async editProduct(data: CreateProductInput, productId: number) {
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
    });
    return products;
  }
  async findProductById(productId: number) {
    return await prisma.product.findUnique({ where: { productId } });
  }
}
