import { CreateProductInput } from "../../schemas/product.schema.js";
import { IProductRepository } from "../../types/IProductRepository.js";

class ProductService {
  constructor(private product: IProductRepository) {}

  async createProduct(data: CreateProductInput) {
    const product = await this.product.createProduct(data);
    return product;
  }

  async editProduct(data: CreateProductInput, productId: number) {
    const product = await this.product.editProduct(data, productId);
    return product;
  }
  async deleteProduct(productId: number) {
    const product = await this.product.deleteProduct(productId);
    return product;
  }
  async listProducts(limit = 10, offset = 0) {
    return this.product.getProducts(limit, offset);
  }
}

export default ProductService;
