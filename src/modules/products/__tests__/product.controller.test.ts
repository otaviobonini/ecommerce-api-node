import { describe, expect, jest, beforeEach } from "@jest/globals";
import { Request, Response } from "express";
import ProductController from "../ProductController.js";
import { productServiceMock } from "../__mocks__/product.service.mock.js";

describe("Product Controller test", () => {
  let controller: ProductController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ProductController(productServiceMock);
  });

  test("Should create product successfully", async () => {
    const req = {
      body: {
        productName: "Product Test",
        productPrice: 99.9,
        stock: 10,
      },
      userId: 1,
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    productServiceMock.createProduct.mockResolvedValue(req.body as any);

    await controller.createProduct(req, res);

    expect(productServiceMock.createProduct).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  test("Should edit product successfully", async () => {
    const req = {
      body: {
        productName: "Product edit test",
        productPrice: 150,
        stock: 5,
      },
      params: {
        productId: "1",
      },
      userId: 1,
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    productServiceMock.editProduct.mockResolvedValue(req.body as any);

    await controller.editProduct(req, res);

    expect(productServiceMock.editProduct).toHaveBeenCalledWith(req.body, 1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("Should delete product successfully", async () => {
    const req = {
      userId: 1,
      params: {
        productId: "1",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;

    productServiceMock.deleteProduct.mockResolvedValue(undefined as any);

    await controller.deleteProduct(req, res);

    expect(productServiceMock.deleteProduct).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(204);
  });

  test("Should list products successfully", async () => {
    const req = {
      query: {
        limit: 10,
        offset: 0,
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    productServiceMock.listProducts.mockResolvedValue([]);

    await controller.listProducts(req, res);

    expect(productServiceMock.listProducts).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  // Product image tests
  test("Should upload product image successfully", async () => {
    const fileBuffer = Buffer.from("test image");

    const req = {
      params: {
        productId: "1",
      },
      file: {
        buffer: fileBuffer,
        mimetype: "image/jpeg",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    productServiceMock.uploadProductImage.mockResolvedValue({
      imageId: 1,
      productId: 1,
      url: "image-url",
      isPrimary: false,
    } as any);

    await controller.uploadImage(req, res);

    expect(productServiceMock.uploadProductImage).toHaveBeenCalledWith(
      1,
      fileBuffer,
      "image/jpeg",
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  test("Should throw AppError when uploading image without file", async () => {
    const req = {
      params: {
        productId: "1",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.uploadImage(req, res)).rejects.toThrow(
      "No file provided",
    );

    expect(productServiceMock.uploadProductImage).not.toHaveBeenCalled();
  });

  test("Should delete product image successfully", async () => {
    const req = {
      params: {
        productId: "1",
        imageId: "2",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    productServiceMock.deleteProductImage.mockResolvedValue(undefined as any);

    await controller.deleteImage(req, res);

    expect(productServiceMock.deleteProductImage).toHaveBeenCalledWith(1, 2);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  test("Should set primary image successfully", async () => {
    const req = {
      params: {
        productId: "1",
        imageId: "2",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    productServiceMock.setPrimaryImage.mockResolvedValue(undefined as any);

    await controller.setPrimaryImage(req, res);

    expect(productServiceMock.setPrimaryImage).toHaveBeenCalledWith(1, 2);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
