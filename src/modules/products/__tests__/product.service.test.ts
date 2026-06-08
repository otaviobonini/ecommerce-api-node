import { describe, expect, jest, beforeEach } from "@jest/globals";
import ProductService from "../ProductService.js";
import {
  CreateProductInputData,
  ProductData,
  ProductList,
  ProductListJson,
} from "./factories/makeProduct.factory.js";
import { IProductRepository } from "../../../interfaces/IProductRepository.js";

jest.mock("../../../database/redis.js", () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
  },
}));
import { redis } from "../../../database/redis.js";
import { IS3Gateway } from "../../../interfaces/IS3Gateway.js";
import { IImageRepository } from "../../../interfaces/IImageRepository.js";

const ImageRepositoryMock: jest.Mocked<IImageRepository> = {
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
  setPrimaryImage: jest.fn(),
  findImageById: jest.fn(),
};

const S3GatewayMock: jest.Mocked<IS3Gateway> = {
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
};

const productRepositoryMock: jest.Mocked<IProductRepository> = {
  createProduct: jest.fn(),
  editProduct: jest.fn(),
  deleteProduct: jest.fn(),
  getProducts: jest.fn(),
  getProduct: jest.fn(),
  findProductById: jest.fn(),
};

jest.mock("../../../database/cache.js", () => ({
  invalidateCache: jest.fn().mockResolvedValue(undefined as never),
}));

describe("Product service tests", () => {
  let service: ProductService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProductService(
      productRepositoryMock,
      ImageRepositoryMock,
      S3GatewayMock,
    );
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
    productRepositoryMock.getProducts.mockResolvedValue({
      products: ProductList,
      total: ProductList.length,
    });

    const result = await service.listProducts();

    expect(productRepositoryMock.getProducts).toHaveBeenCalledWith(10, 0);

    expect(result).toEqual({
      limit: 10,
      offset: 0,
      products: ProductList,
      total: ProductList.length,
      hasPrevious: false,
      hasNext: false,
    });
  });
  test("Should return products with cache", async () => {
    jest.mocked(redis.get).mockResolvedValue(JSON.stringify(ProductList));

    const result = await service.listProducts();

    expect(redis.get).toHaveBeenCalled();
    expect(productRepositoryMock.getProducts).not.toHaveBeenCalled();
    expect(redis.set).not.toHaveBeenCalled();
    expect(result).toEqual(ProductListJson);
  });
  test("Should upload product image", async () => {
    const buffer = Buffer.from("test image");

    productRepositoryMock.findProductById.mockResolvedValue(ProductData);
    S3GatewayMock.uploadFile.mockResolvedValue(
      "https://bucket.com/products/1/image.jpg",
    );
    ImageRepositoryMock.uploadImage.mockResolvedValue({
      imageId: 1,
      productId: 1,
      url: "https://bucket.com/products/1/image.jpg",
      isPrimary: false,
    } as any);

    const result = await service.uploadProductImage(1, buffer, "image/jpeg");

    expect(productRepositoryMock.findProductById).toHaveBeenCalledWith(1);
    expect(S3GatewayMock.uploadFile).toHaveBeenCalledWith(
      buffer,
      expect.stringContaining("products/1/"),
      "image/jpeg",
    );
    expect(ImageRepositoryMock.uploadImage).toHaveBeenCalledWith(
      1,
      "https://bucket.com/products/1/image.jpg",
    );
    expect(result).toEqual({
      imageId: 1,
      productId: 1,
      url: "https://bucket.com/products/1/image.jpg",
      isPrimary: false,
    });
  });

  test("Should throw AppError when product does not exist while uploading image", async () => {
    const buffer = Buffer.from("test image");

    productRepositoryMock.findProductById.mockResolvedValue(null as any);

    await expect(
      service.uploadProductImage(1, buffer, "image/jpeg"),
    ).rejects.toThrow("Product not found");

    expect(S3GatewayMock.uploadFile).not.toHaveBeenCalled();
    expect(ImageRepositoryMock.uploadImage).not.toHaveBeenCalled();
  });

  test("Should delete product image", async () => {
    ImageRepositoryMock.findImageById.mockResolvedValue({
      imageId: 1,
      productId: 1,
      url: "https://bucket.com/products/1/image.jpg",
      isPrimary: false,
    } as any);

    ImageRepositoryMock.deleteImage.mockResolvedValue(undefined as any);

    await service.deleteProductImage(1, 1);

    expect(ImageRepositoryMock.findImageById).toHaveBeenCalledWith(1);
    expect(S3GatewayMock.deleteFile).toHaveBeenCalledWith(
      "products/1/image.jpg",
    );
    expect(ImageRepositoryMock.deleteImage).toHaveBeenCalledWith(1);
  });

  test("Should throw AppError when deleting image that does not exist", async () => {
    ImageRepositoryMock.findImageById.mockResolvedValue(null as any);

    await expect(service.deleteProductImage(1, 1)).rejects.toThrow(
      "Image not found",
    );

    expect(S3GatewayMock.deleteFile).not.toHaveBeenCalled();
    expect(ImageRepositoryMock.deleteImage).not.toHaveBeenCalled();
  });

  test("Should throw AppError when deleting image from another product", async () => {
    ImageRepositoryMock.findImageById.mockResolvedValue({
      imageId: 1,
      productId: 999,
      url: "https://bucket.com/products/999/image.jpg",
      isPrimary: false,
    } as any);

    await expect(service.deleteProductImage(1, 1)).rejects.toThrow(
      "Image does not belong to this product",
    );

    expect(S3GatewayMock.deleteFile).not.toHaveBeenCalled();
    expect(ImageRepositoryMock.deleteImage).not.toHaveBeenCalled();
  });

  test("Should set primary image", async () => {
    ImageRepositoryMock.findImageById.mockResolvedValue({
      imageId: 1,
      productId: 1,
      url: "https://bucket.com/products/1/image.jpg",
      isPrimary: false,
    } as any);

    ImageRepositoryMock.setPrimaryImage.mockResolvedValue(undefined as any);

    await service.setPrimaryImage(1, 1);

    expect(ImageRepositoryMock.findImageById).toHaveBeenCalledWith(1);
    expect(ImageRepositoryMock.setPrimaryImage).toHaveBeenCalledWith(1, 1);
  });

  test("Should throw AppError when setting primary image that does not exist", async () => {
    ImageRepositoryMock.findImageById.mockResolvedValue(null as any);

    await expect(service.setPrimaryImage(1, 1)).rejects.toThrow(
      "Image not found",
    );

    expect(ImageRepositoryMock.setPrimaryImage).not.toHaveBeenCalled();
  });

  test("Should throw AppError when setting primary image from another product", async () => {
    ImageRepositoryMock.findImageById.mockResolvedValue({
      imageId: 1,
      productId: 999,
      url: "https://bucket.com/products/999/image.jpg",
      isPrimary: false,
    } as any);

    await expect(service.setPrimaryImage(1, 1)).rejects.toThrow(
      "Image does not belong to this product",
    );

    expect(ImageRepositoryMock.setPrimaryImage).not.toHaveBeenCalled();
  });
});
