import { ICategoryRepository } from "../../interfaces/ICategoriesRepository.js";
import { AppError } from "../../common/AppError.js";

export class CategoriesService {
  constructor(private categoryRepository: ICategoryRepository) {}

  async createCategory(name: string) {
    const exists = await this.categoryRepository.findByName(name);
    if (exists) throw new AppError(409, "Category already exists");
    return this.categoryRepository.createCategory(name);
  }

  async deleteCategory(categoryId: number) {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) throw new AppError(404, "Category not found");
    return this.categoryRepository.deleteCategory(categoryId);
  }

  async findAll() {
    return this.categoryRepository.findAll();
  }

  async getProductsByCategory(
    categoryId: number,
    offset: number,
    limit: number,
  ) {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) throw new AppError(404, "Category not found");
    return this.categoryRepository.getProductsByCategory(
      categoryId,
      offset,
      limit,
    );
  }

  async getFeaturedProducts(offset: number, limit: number) {
    return this.categoryRepository.getFeaturedProducts(offset, limit);
  }
}
