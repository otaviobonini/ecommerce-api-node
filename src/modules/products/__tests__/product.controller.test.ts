import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Request, Response } from "express";
import ProductController from "../ProductController.js";
import ProductService from "../ProductService.js";

const productServiceMock: jest.Mocked<ProductService> = {
  createProduct: jest.fn(),
  editProduct: jest.fn(),
  deleteProduct: jest.fn(),
  listProducts: jest.fn(),
} as any;

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
      params: {
        productId: "1",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    productServiceMock.deleteProduct.mockResolvedValue(undefined as any);

    await controller.deleteProduct(req, res);

    expect(productServiceMock.deleteProduct).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(204);
  });

  test("Should list products successfully", async () => {
    const req = {} as Request;

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
  test("Should throw error if productId is invalid", async () => {
    const req = {
      params: { productId: "abc" },
      userId: 1,
      body: {},
    } as unknown as Request;

    const res = {} as Response;

    await expect(controller.editProduct(req, res)).rejects.toThrow(
      "Product id not valid",
    );
  });
  test("Should throw error if user is not authenticated on edit", async () => {
    const req = {
      params: { productId: "1" },
      userId: undefined,
      body: {},
    } as unknown as Request;

    const res = {} as Response;

    await expect(controller.editProduct(req, res)).rejects.toThrow(
      "Not Authenticated",
    );
  });
});
