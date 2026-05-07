import { CreateProductInput } from "../../schemas/product.schema.js";
import { IProductRepository } from "../../types/IRepository.js";

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
  async listProducts(limit?: number, offset?: number) {
    if (limit === undefined) limit = 10;
    if (offset === undefined) offset = 0;
    const products = await this.product.getProducts(limit, offset);
    return products;
  }
}

export default ProductService;
