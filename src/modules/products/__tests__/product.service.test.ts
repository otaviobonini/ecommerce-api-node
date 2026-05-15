import { describe, expect, jest, beforeEach } from "@jest/globals";
import ProductService from "../ProductService.js";
import {
  CreateProductInputData,
  ProductData,
  ProductList,
  ProductListJson,
} from "./factories/makeProduct.factory.js";
import { IProductRepository } from "../../../types/IProductRepository.js";

jest.mock("../../../database/redis.js", () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
  },
}));
import { redis } from "../../../database/redis.js";

const productRepositoryMock: jest.Mocked<IProductRepository> = {
  createProduct: jest.fn(),
  editProduct: jest.fn(),
  deleteProduct: jest.fn(),
  getProducts: jest.fn(),
  findProductById: jest.fn(),
};

jest.mock("../../../database/cache.js", () => ({
  invalidateCache: jest.fn().mockResolvedValue(undefined as never),
}));

describe("Product service tests", () => {
  let service: ProductService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProductService(productRepositoryMock);
  });
  test("Should create a new product", async () => {
    productRepositoryMock.createProduct.mockResolvedValue(ProductData);
    const result = await service.createProduct(CreateProductInputData);
    expect(productRepositoryMock.createProduct).toHaveBeenCalledWith(
      CreateProductInputData,
    );
    expect(result).toBe(ProductData);
  });
  test("Should edit a product", async () => {
    productRepositoryMock.editProduct.mockResolvedValue(ProductData);
    const result = await service.editProduct(CreateProductInputData, 1);
    expect(productRepositoryMock.editProduct).toHaveBeenCalledWith(
      CreateProductInputData,
      1,
    );
    expect(result).toBe(ProductData);
  });
  test("Should delete product", async () => {
    productRepositoryMock.deleteProduct.mockResolvedValue(ProductData);
    const result = await service.deleteProduct(1);
    expect(productRepositoryMock.deleteProduct).toHaveBeenCalledWith(1);
    expect(result).toBe(ProductData);
  });
  test("Should return products without cache", async () => {
    productRepositoryMock.getProducts.mockResolvedValue(ProductList);
    const result = await service.listProducts();
    expect(productRepositoryMock.getProducts).toHaveBeenCalled();
    expect(result).toBe(ProductList);
  });
  test("Should return products with cache", async () => {
    jest.mocked(redis.get).mockResolvedValue(JSON.stringify(ProductList));

    const result = await service.listProducts();

    expect(redis.get).toHaveBeenCalled();
    expect(productRepositoryMock.getProducts).not.toHaveBeenCalled();
    expect(redis.set).not.toHaveBeenCalled();
    expect(result).toEqual(ProductListJson);
  });
});
