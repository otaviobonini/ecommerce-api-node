import { Request, Response } from "express";
import { CategoriesController } from "../CategoriesController.js";
import { categoriesServiceMock } from "../__mocks__/categories.service.mock.js";
import {
  newCategoryData,
  productDataList,
} from "./factories/categories.factory.js";

describe("CategoriesController", () => {
  let controller: CategoriesController;

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    controller = new CategoriesController(categoriesServiceMock as any);
    jest.clearAllMocks();
  });

  test("Should create a category", async () => {
    const req = {
      body: {
        name: newCategoryData.name,
      },
    } as Request;

    const res = mockResponse();

    categoriesServiceMock.createCategory.mockResolvedValue(newCategoryData);

    await controller.createCategory(req, res);

    expect(categoriesServiceMock.createCategory).toHaveBeenCalledWith(
      newCategoryData.name,
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newCategoryData);
  });

  test("Should delete a category", async () => {
    const req = {
      params: {
        categoryId: "1",
      },
    } as unknown as Request;

    const res = mockResponse();

    categoriesServiceMock.deleteCategory.mockResolvedValue(undefined);

    await controller.deleteCategory(req, res);

    expect(categoriesServiceMock.deleteCategory).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  test("Should find all categories", async () => {
    const req = {} as Request;
    const res = mockResponse();

    const categories = [newCategoryData];

    categoriesServiceMock.findAll.mockResolvedValue(categories);

    await controller.findAll(req, res);

    expect(categoriesServiceMock.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(categories);
  });

  test("Should get products by category", async () => {
    const req = {
      params: {
        categoryId: "1",
      },
      query: {
        offset: "0",
        limit: "10",
      },
    } as unknown as Request;

    const res = mockResponse();

    categoriesServiceMock.getProductsByCategory.mockResolvedValue(
      productDataList,
    );

    await controller.getProductsByCategory(req, res);

    expect(categoriesServiceMock.getProductsByCategory).toHaveBeenCalledWith(
      1,
      0,
      10,
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(productDataList);
  });

  test("Should get products by category with default pagination", async () => {
    const req = {
      params: {
        categoryId: "1",
      },
      query: {},
    } as unknown as Request;

    const res = mockResponse();

    categoriesServiceMock.getProductsByCategory.mockResolvedValue(
      productDataList,
    );

    await controller.getProductsByCategory(req, res);

    expect(categoriesServiceMock.getProductsByCategory).toHaveBeenCalledWith(
      1,
      0,
      20,
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(productDataList);
  });

  test("Should get featured products", async () => {
    const req = {
      query: {
        offset: "0",
        limit: "10",
      },
    } as unknown as Request;

    const res = mockResponse();

    categoriesServiceMock.getFeaturedProducts.mockResolvedValue(
      productDataList,
    );

    await controller.getFeaturedProducts(req, res);

    expect(categoriesServiceMock.getFeaturedProducts).toHaveBeenCalledWith(
      0,
      10,
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(productDataList);
  });

  test("Should get featured products with default pagination", async () => {
    const req = {
      query: {},
    } as unknown as Request;

    const res = mockResponse();

    categoriesServiceMock.getFeaturedProducts.mockResolvedValue(
      productDataList,
    );

    await controller.getFeaturedProducts(req, res);

    expect(categoriesServiceMock.getFeaturedProducts).toHaveBeenCalledWith(
      0,
      20,
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(productDataList);
  });
});
