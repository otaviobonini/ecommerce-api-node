import { ICategoryRepository } from "../../interfaces/ICategoriesRepository.js";
import { AppError } from "../../common/AppError.js";
import { IS3Gateway } from "../../interfaces/IS3Gateway.js";

export class CategoriesService {
  constructor(
    private categoryRepository: ICategoryRepository,
    private upload: IS3Gateway,
  ) {}

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

  async uploadCategoryImage(
    categoryId: number,
    buffer: Buffer,
    mimetype: string,
  ) {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) throw new AppError(404, "Category not found");
    const imageUrl = await this.upload.uploadFile(
      buffer,
      `categories/${categoryId}/image`,
      mimetype,
    );
    return this.categoryRepository.editCategory(categoryId, {
      categoryImage: imageUrl,
    });
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
