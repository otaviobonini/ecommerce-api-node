import { categoriesRepositoryMock } from "../../../database/__mocks__/repositories.mock.js";
import { CategoriesService } from "../CategoriesService.js";
import {
  newCategoryData,
  productDataList,
} from "./factories/categories.factory.js";

describe("CategoriesService", () => {
  let service: CategoriesService;
  beforeEach(() => {
    service = new CategoriesService(categoriesRepositoryMock);
    jest.clearAllMocks();
  });
  test("Should create a new category", async () => {
    categoriesRepositoryMock.findByName.mockResolvedValue(null);
    categoriesRepositoryMock.createCategory.mockResolvedValue(newCategoryData);
    const result = await service.createCategory(newCategoryData.name);
    expect(categoriesRepositoryMock.findByName).toHaveBeenCalledWith(
      newCategoryData.name,
    );
    expect(categoriesRepositoryMock.createCategory).toHaveBeenCalledWith(
      newCategoryData.name,
    );
    expect(result).toEqual(newCategoryData);
  });
  test("Should should fail to create category if already exists", async () => {
    categoriesRepositoryMock.findByName.mockResolvedValue(newCategoryData);
    const result = service.createCategory(newCategoryData.name);
    await expect(result).rejects.toMatchObject({
      statusCode: 409,
      message: "Category already exists",
    });
    expect(categoriesRepositoryMock.findByName).toHaveBeenCalledWith(
      newCategoryData.name,
    );
    expect(categoriesRepositoryMock.createCategory).not.toHaveBeenCalled();
  });
  test("Should delete a category", async () => {
    const categoryId = 1;
    categoriesRepositoryMock.findById.mockResolvedValue(newCategoryData);
    await service.deleteCategory(categoryId);
    expect(categoriesRepositoryMock.findById).toHaveBeenCalledWith(categoryId);
    expect(categoriesRepositoryMock.deleteCategory).toHaveBeenCalledWith(
      categoryId,
    );
  });
  test("Should fail to delete a non existing category", async () => {
    const categoryId = 1;
    categoriesRepositoryMock.findById.mockResolvedValue(null);
    const result = service.deleteCategory(categoryId);
    await expect(result).rejects.toMatchObject({
      statusCode: 404,
      message: "Category not found",
    });
    expect(categoriesRepositoryMock.findById).toHaveBeenCalledWith(categoryId);
    expect(categoriesRepositoryMock.deleteCategory).not.toHaveBeenCalled();
  });
  test("Should find all categories", async () => {
    const categories = [newCategoryData];
    categoriesRepositoryMock.findAll.mockResolvedValue(categories);
    const result = await service.findAll();
    expect(categoriesRepositoryMock.findAll).toHaveBeenCalled();
    expect(result).toEqual(categories);
  });
  test("Should get products by category", async () => {
    const categoryId = 1;

    categoriesRepositoryMock.findById.mockResolvedValue(newCategoryData);
    categoriesRepositoryMock.getProductsByCategory.mockResolvedValue(
      productDataList,
    );

    const result = await service.getProductsByCategory(categoryId, 0, 10);

    expect(categoriesRepositoryMock.findById).toHaveBeenCalledWith(categoryId);
    expect(categoriesRepositoryMock.getProductsByCategory).toHaveBeenCalledWith(
      categoryId,
      0,
      10,
    );
    expect(result).toEqual(productDataList);
  });
  test("Should fail to get products by category if category does not exist", async () => {
    const categoryId = 1;

    categoriesRepositoryMock.findById.mockResolvedValue(null);

    const result = service.getProductsByCategory(categoryId, 0, 10);

    await expect(result).rejects.toMatchObject({
      statusCode: 404,
      message: "Category not found",
    });

    expect(categoriesRepositoryMock.findById).toHaveBeenCalledWith(categoryId);
    expect(
      categoriesRepositoryMock.getProductsByCategory,
    ).not.toHaveBeenCalled();
  });
});
