import ProductService from "../ProductService.js";

export const productServiceMock: jest.Mocked<ProductService> = {
  createProduct: jest.fn(),
  editProduct: jest.fn(),
  deleteProduct: jest.fn(),
  listProducts: jest.fn(),
  uploadProductImage: jest.fn(),
  deleteProductImage: jest.fn(),
  setPrimaryImage: jest.fn(),
} as any;
