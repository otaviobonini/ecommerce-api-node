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

    const product = await this.product.createProduct(data);
    return product;
  }

  async editProduct(data: CreateProductDTO, userId: number, productId: number) {
    const user = await this.auth.findUserById(userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    const product = await this.product.editProduct(data, productId);
    return product;
  }
  async deleteProduct(productId: number) {
    const product = await this.product.deleteProduct(productId);
    if (product.count === 0) {
      throw new AppError(404, "Product not found");
    }
    return;
  }
  async listProducts() {
    const products = await this.product.getProducts();
    return products;
  }
}

export default ProductService;
