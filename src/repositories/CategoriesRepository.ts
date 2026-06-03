import { Product, Category } from "@prisma/client";
import { ICategoryRepository } from "../interfaces/ICategoriesRepository.js";
import { prisma } from "../database/prisma.js";

export class CategoriesRepository implements ICategoryRepository {
  async createCategory(name: string): Promise<Category> {
    return prisma.category.create({
      data: { name },
    });
  }

  async deleteCategory(categoryId: number): Promise<void> {
    await prisma.category.delete({
      where: { categoryId },
    });
  }

  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findById(categoryId: number): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { categoryId },
    });
  }
  async findByName(name: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { name },
    });
  }

  async getProductsByCategory(
    categoryId: number,
    offset: number,
    limit: number,
  ): Promise<Product[]> {
    return prisma.product.findMany({
      where: { categoryId },
      skip: offset,
      take: limit,
      include: { images: true },
    });
  }

  async getFeaturedProducts(offset: number, limit: number): Promise<Product[]> {
    return prisma.product.findMany({
      where: { isFeatured: true },
      skip: offset,
      take: limit,
      include: { images: true },
    });
  }
}
