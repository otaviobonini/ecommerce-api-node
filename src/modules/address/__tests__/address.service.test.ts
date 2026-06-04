import { AddressService } from "../AddressService.js";
import { CreateAddressInputFakeData } from "./factories/makeAddress.factory.js";
import { addressRepositoryMock } from "../../../database/__mocks__/repositories.mock.js";

describe("AddressService", () => {
  let service: AddressService;

  beforeEach(() => {
    service = new AddressService(addressRepositoryMock);
    jest.clearAllMocks();
  });

  test("Should create a new address", async () => {
    const userId = 1;
    const createdAddress = {
      ...CreateAddressInputFakeData,
      addressId: 1,
      userId,
    };
    addressRepositoryMock.createAddress.mockResolvedValue(createdAddress);
    const result = await service.createAddress(
      CreateAddressInputFakeData,
      userId,
    );
    expect(addressRepositoryMock.createAddress).toHaveBeenCalledWith(
      CreateAddressInputFakeData,
      userId,
    );
    expect(result).toEqual(createdAddress);
  });
  test("Should get user addresses", async () => {
    const userId = 1;
    const addresses = [
      { ...CreateAddressInputFakeData, addressId: 1, userId },
      { ...CreateAddressInputFakeData, addressId: 2, userId },
    ];
    addressRepositoryMock.getUserAddresses.mockResolvedValue(addresses);
    const result = await service.getUserAddresses(userId);
    expect(addressRepositoryMock.getUserAddresses).toHaveBeenCalledWith(userId);
    expect(result).toEqual(addresses);
  });
  test("Should delete an address", async () => {
    const userId = 1;
    const addressId = 1;
    addressRepositoryMock.getAddressById.mockResolvedValue({
      ...CreateAddressInputFakeData,
      addressId,
      userId,
    });
    await service.deleteAddress(addressId, userId);
    expect(addressRepositoryMock.getAddressById).toHaveBeenCalledWith(
      addressId,
    );
    expect(addressRepositoryMock.deleteAddress).toHaveBeenCalledWith(addressId);
  });
  test("Should fail if address not found on delete", async () => {
    const userId = 1;
    const addressId = 1;
    addressRepositoryMock.getAddressById.mockResolvedValue(null);
    const result = service.deleteAddress(addressId, userId);
    await expect(result).rejects.toBeInstanceOf(Error);
    await expect(result).rejects.toHaveProperty("statusCode", 404);
  });
  test("Should fail if user is unauthorized on delete", async () => {
    const userId = 1;
    const addressId = 1;
    addressRepositoryMock.getAddressById.mockResolvedValue({
      ...CreateAddressInputFakeData,
      addressId,
      userId: userId + 1, // Different user ID
    });
    const result = service.deleteAddress(addressId, userId);
    await expect(result).rejects.toBeInstanceOf(Error);
    await expect(result).rejects.toHaveProperty("statusCode", 403);
  });
  test("Should set default address", async () => {
    const userId = 1;
    const addressId = 1;
    addressRepositoryMock.getAddressById.mockResolvedValue({
      ...CreateAddressInputFakeData,
      addressId,
      userId,
    });
    await service.setDefaultAddress(addressId, userId);
    expect(addressRepositoryMock.getAddressById).toHaveBeenCalledWith(
      addressId,
    );
    expect(addressRepositoryMock.setDefaultAddress).toHaveBeenCalledWith(
      addressId,
      userId,
    );
  });
  test("Should fail if address not found on set default", async () => {
    const userId = 1;
    const addressId = 1;
    addressRepositoryMock.getAddressById.mockResolvedValue(null);
    const result = service.setDefaultAddress(addressId, userId);
    await expect(result).rejects.toBeInstanceOf(Error);
    await expect(result).rejects.toHaveProperty("statusCode", 404);
  });
  test("Should fail if user is unauthorized on set default", async () => {
    const userId = 1;
    const addressId = 1;
    addressRepositoryMock.getAddressById.mockResolvedValue({
      ...CreateAddressInputFakeData,
      addressId,
      userId: userId + 1, // Different user ID
    });
    const result = service.setDefaultAddress(addressId, userId);
    await expect(result).rejects.toBeInstanceOf(Error);
    await expect(result).rejects.toHaveProperty("statusCode", 403);
  });
  test("Should edit an address", async () => {
    const userId = 1;
    const addressId = 1;
    const data = { ...CreateAddressInputFakeData, street: "456 Elm St" };
    addressRepositoryMock.getAddressById.mockResolvedValue({
      ...CreateAddressInputFakeData,
      addressId,
      userId,
    });
    addressRepositoryMock.editAddress.mockResolvedValue({
      ...CreateAddressInputFakeData,
      ...data,
      addressId,
      userId,
    });
    await service.editAddress(addressId, userId, data);
    expect(addressRepositoryMock.getAddressById).toHaveBeenCalledWith(
      addressId,
    );
    expect(addressRepositoryMock.editAddress).toHaveBeenCalledWith(
      addressId,
      data,
    );
  });
  test("Should fail if address not found on edit", async () => {
    const userId = 1;
    const addressId = 1;
    const data = { ...CreateAddressInputFakeData, street: "456 Elm St" };
    addressRepositoryMock.getAddressById.mockResolvedValue(null);
    const result = service.editAddress(addressId, userId, data);
    await expect(result).rejects.toBeInstanceOf(Error);
    await expect(result).rejects.toHaveProperty("statusCode", 404);
  });
  test("Should fail if unauthorized on edit", async () => {
    const userId = 1;
    const addressId = 1;
    const data = { ...CreateAddressInputFakeData, street: "456 Elm St" };
    addressRepositoryMock.getAddressById.mockResolvedValue({
      ...CreateAddressInputFakeData,
      addressId,
      userId: userId + 1, // Different user ID
    });
    const result = service.editAddress(addressId, userId, data);
    await expect(result).rejects.toBeInstanceOf(Error);
    await expect(result).rejects.toHaveProperty("statusCode", 403);
  });
});
