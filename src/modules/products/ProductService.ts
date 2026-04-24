import { ProductRepository } from "../../repositories/ProductRepository.js";
import { AuthRepository } from "../../repositories/AuthRepository.js";
import { CreateProductDTO } from "../../types/product.types.js";
import { AppError } from "../../common/AppError.js";

class ProductService {
  constructor(
    private product: ProductRepository,
    private auth: AuthRepository,
  ) {}

  async createProduct(data: CreateProductDTO, userId: number) {
    const user = await this.auth.findUserById(userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (user.role !== "ADMIN") {
      throw new AppError(403, "User do not have permission to perform action");
    }
    const product = await this.product.createProduct(data);
    return product;
  }

  async editProduct(data: CreateProductDTO, userId: number, productId: number) {
    const user = await this.auth.findUserById(userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (user.role !== "ADMIN") {
      throw new AppError(403, "User do not have permission to perform action");
    }
  }
}
