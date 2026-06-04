import { Category, Product } from "@prisma/client";

export interface ICategoryRepository {
  createCategory(name: string): Promise<Category>;
  deleteCategory(categoryId: number): Promise<void>;
  findAll(): Promise<Category[]>;
  findByName(name: string): Promise<Category | null>;
  findById(categoryId: number): Promise<Category | null>;
  getProductsByCategory(
    categoryId: number,
    offset: number,
    limit: number,
  ): Promise<Product[]>;
  getFeaturedProducts(offset: number, limit: number): Promise<Product[]>;

  editCategory(
    categoryId: number,
    data: { name?: string; categoryImage?: string },
  ): Promise<Category>;
}
