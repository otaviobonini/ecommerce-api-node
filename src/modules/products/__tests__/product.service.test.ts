import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { AuthRepository } from "../../../repositories/AuthRepository.js";
import { ProductRepository } from "../../../repositories/ProductRepository.js";
import ProductService from "../ProductService.js";
import {
  CreateProductInputData,
  FindUserByIdData,
  ProductData,
  ProductList,
} from "./factories/makeProduct.factory.js";

const authRepositoryMock: jest.Mocked<AuthRepository> = {
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  findUserByEmailWithoutPassword: jest.fn(),
  findUserById: jest.fn(),
};

const productRepositoryMock: jest.Mocked<ProductRepository> = {
  createProduct: jest.fn(),
  editProduct: jest.fn(),
  deleteProduct: jest.fn(),
  getProducts: jest.fn(),
};

describe("Product service tests", () => {
  let service: ProductService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProductService(productRepositoryMock, authRepositoryMock);
  });
  test("Should create a new product", async () => {
    authRepositoryMock.findUserById.mockResolvedValue(FindUserByIdData);
    productRepositoryMock.createProduct.mockResolvedValue(ProductData);
    const result = await service.createProduct(CreateProductInputData, 1);
    expect(result).toBe(ProductData);
  });
  test("Should fail if user not found", async () => {
    authRepositoryMock.findUserById.mockResolvedValue(null);
    const result = service.createProduct(CreateProductInputData, 1);
    await expect(result).rejects.toThrow("User not found");
  });
  test("Should edit a product", async () => {
    authRepositoryMock.findUserById.mockResolvedValue(FindUserByIdData);
    productRepositoryMock.editProduct.mockResolvedValue(ProductData);
    const result = await service.editProduct(CreateProductInputData, 1, 1);
    expect(result).toBe(ProductData);
  });
  test("Should fail editing if user not found", async () => {
    authRepositoryMock.findUserById.mockResolvedValue(null);
    const result = service.editProduct(CreateProductInputData, 1, 1);
    await expect(result).rejects.toThrow("User not found");
  });
  test("Should delete product", async () => {
    productRepositoryMock.deleteProduct.mockResolvedValue(ProductData);
    const result = await service.deleteProduct(1);
    expect(result).toBe(ProductData);
  });
  test("Should return products", async () => {
    productRepositoryMock.getProducts.mockResolvedValue(ProductList);
    const result = await service.listProducts();
    expect(result).toBe(ProductList);
  });
});
