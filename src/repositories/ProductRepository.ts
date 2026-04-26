import { prisma } from "../database/prisma.js";
import { CreateProductDTO } from "../types/product.types.js";

export class ProductRepository {
  async createProduct(data: CreateProductDTO) {
    const product = await prisma.product.create({
      data: data,
    });
    return product;
  }
  async editProduct(data: CreateProductDTO, productId: number) {
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
  async getProducts() {
    const products = await prisma.product.findMany();
    return products;
  }
}
