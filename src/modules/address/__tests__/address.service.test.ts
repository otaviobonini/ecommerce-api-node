import { AddressRepository } from "../../../repositories/AddressRepository.js";
import { AddressService } from "../AddressService.js";
import { CreateAddressInputFakeData } from "./factories/makeAddress.factory.js";

const mockAddressRepository: jest.Mocked<AddressRepository> = {
  createAddress: jest.fn(),
  getUserAddresses: jest.fn(),
  getAddressById: jest.fn(),
  deleteAddress: jest.fn(),
  setDefaultAddress: jest.fn(),
  editAddress: jest.fn(),
};

describe("AddressService", () => {
  let service: AddressService;

  beforeEach(() => {
    service = new AddressService(mockAddressRepository);
    jest.clearAllMocks();
  });

  test("Should create a new address", async () => {
    const userId = 1;
    const createdAddress = {
      ...CreateAddressInputFakeData,
      addressId: 1,
      userId,
    };
    mockAddressRepository.createAddress.mockResolvedValue(createdAddress);
    const result = await service.createAddress(
      CreateAddressInputFakeData,
      userId,
    );
    expect(mockAddressRepository.createAddress).toHaveBeenCalledWith(
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
    mockAddressRepository.getUserAddresses.mockResolvedValue(addresses);
    const result = await service.getUserAddresses(userId);
    expect(mockAddressRepository.getUserAddresses).toHaveBeenCalledWith(userId);
    expect(result).toEqual(addresses);
  });
  test("Should delete an address", async () => {
    const userId = 1;
    const addressId = 1;
    mockAddressRepository.getAddressById.mockResolvedValue({
      ...CreateAddressInputFakeData,
      addressId,
      userId,
    });
    await service.deleteAddress(addressId, userId);
    expect(mockAddressRepository.getAddressById).toHaveBeenCalledWith(
      addressId,
    );
    expect(mockAddressRepository.deleteAddress).toHaveBeenCalledWith(addressId);
  });
  test("Should fail if address not found on delete", async () => {
    const userId = 1;
    const addressId = 1;
    mockAddressRepository.getAddressById.mockResolvedValue(null);
    const result = service.deleteAddress(addressId, userId);
    await expect(result).rejects.toBeInstanceOf(Error);
    await expect(result).rejects.toHaveProperty("statusCode", 404);
  });
  test("Should fail if user is unauthorized on delete", async () => {
    const userId = 1;
    const addressId = 1;
    mockAddressRepository.getAddressById.mockResolvedValue({
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
    mockAddressRepository.getAddressById.mockResolvedValue({
      ...CreateAddressInputFakeData,
      addressId,
      userId,
    });
    await service.setDefaultAddress(addressId, userId);
    expect(mockAddressRepository.getAddressById).toHaveBeenCalledWith(
      addressId,
    );
    expect(mockAddressRepository.setDefaultAddress).toHaveBeenCalledWith(
      addressId,
      userId,
    );
  });
  test("Should fail if address not found on set default", async () => {
    const userId = 1;
    const addressId = 1;
    mockAddressRepository.getAddressById.mockResolvedValue(null);
    const result = service.setDefaultAddress(addressId, userId);
    await expect(result).rejects.toBeInstanceOf(Error);
    await expect(result).rejects.toHaveProperty("statusCode", 404);
  });
  test("Should fail if user is unauthorized on set default", async () => {
    const userId = 1;
    const addressId = 1;
    mockAddressRepository.getAddressById.mockResolvedValue({
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
    mockAddressRepository.getAddressById.mockResolvedValue({
      ...CreateAddressInputFakeData,
      addressId,
      userId,
    });
    mockAddressRepository.editAddress.mockResolvedValue({
      ...CreateAddressInputFakeData,
      ...data,
      addressId,
      userId,
    });
    const result = await service.editAddress(addressId, userId, data);
    expect(mockAddressRepository.getAddressById).toHaveBeenCalledWith(
      addressId,
    );
    expect(mockAddressRepository.editAddress).toHaveBeenCalledWith(
      addressId,
      data,
    );
  });
  test("Should fail if address not found on edit", async () => {
    const userId = 1;
    const addressId = 1;
    const data = { ...CreateAddressInputFakeData, street: "456 Elm St" };
    mockAddressRepository.getAddressById.mockResolvedValue(null);
    const result = service.editAddress(addressId, userId, data);
    await expect(result).rejects.toBeInstanceOf(Error);
    await expect(result).rejects.toHaveProperty("statusCode", 404);
  });
  test("Should fail if unauthorized on edit", async () => {
    const userId = 1;
    const addressId = 1;
    const data = { ...CreateAddressInputFakeData, street: "456 Elm St" };
    mockAddressRepository.getAddressById.mockResolvedValue({
      ...CreateAddressInputFakeData,
      addressId,
      userId: userId + 1, // Different user ID
    });
    const result = service.editAddress(addressId, userId, data);
    await expect(result).rejects.toBeInstanceOf(Error);
    await expect(result).rejects.toHaveProperty("statusCode", 403);
  });
});
