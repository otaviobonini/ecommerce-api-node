import {
  categoriesRepositoryMock,
  S3GatewayMock,
} from "../../../database/__mocks__/repositories.mock.js";
import { CategoriesService } from "../CategoriesService.js";
import {
  newCategoryData,
  updatedCategoryData,
  productDataList,
} from "./factories/categories.factory.js";

describe("CategoriesService", () => {
  let service: CategoriesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CategoriesService(categoriesRepositoryMock, S3GatewayMock);
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

  test("Should fail to create category if already exists", async () => {
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

  test("Should upload category image", async () => {
    const categoryId = 1;
    const fileBuffer = Buffer.from("test image content");
    const mimetype = "image/jpeg";
    const imageUrl = "https://example.com/categories/1/image";

    categoriesRepositoryMock.findById.mockResolvedValue(newCategoryData);
    S3GatewayMock.uploadFile.mockResolvedValue(imageUrl);
    categoriesRepositoryMock.editCategory.mockResolvedValue(
      updatedCategoryData,
    );

    const result = await service.uploadCategoryImage(
      categoryId,
      fileBuffer,
      mimetype,
    );

    expect(categoriesRepositoryMock.findById).toHaveBeenCalledWith(categoryId);
    expect(S3GatewayMock.uploadFile).toHaveBeenCalledWith(
      fileBuffer,
      `categories/${categoryId}/image`,
      mimetype,
    );
    expect(categoriesRepositoryMock.editCategory).toHaveBeenCalledWith(
      categoryId,
      { categoryImage: imageUrl },
    );
    expect(result).toEqual(updatedCategoryData);
  });

  test("Should fail to upload image if category does not exist", async () => {
    const categoryId = 999;
    const fileBuffer = Buffer.from("test image content");
    const mimetype = "image/jpeg";

    categoriesRepositoryMock.findById.mockResolvedValue(null);

    const result = service.uploadCategoryImage(
      categoryId,
      fileBuffer,
      mimetype,
    );

    await expect(result).rejects.toMatchObject({
      statusCode: 404,
      message: "Category not found",
    });
    expect(categoriesRepositoryMock.findById).toHaveBeenCalledWith(categoryId);
    expect(S3GatewayMock.uploadFile).not.toHaveBeenCalled();
    expect(categoriesRepositoryMock.editCategory).not.toHaveBeenCalled();
  });
});
