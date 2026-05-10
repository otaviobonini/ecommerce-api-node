import { AppError } from "../../common/AppError.js";

import { IAddressRepository } from "../../types/IRepository.js";
import {
  CreateAddressInput,
  EditAddressInput,
} from "../../schemas/address.schema.js";

export class AddressService {
  constructor(private address: IAddressRepository) {}
  async createAddress(data: CreateAddressInput, userId: number) {
    const newAddress = await this.address.createAddress(data, userId);
    return newAddress;
  }
  async getUserAddresses(userId: number) {
    const addresses = await this.address.getUserAddresses(userId);
    return addresses;
  }

  async deleteAddress(addressId: number, userId: number) {
    const existingAddress = await this.address.getAddressById(addressId);
    if (!existingAddress) {
      throw new AppError(404, "Address not found");
    }
    if (existingAddress.userId !== userId) {
      throw new AppError(403, "Unauthorized");
    }
    await this.address.deleteAddress(addressId);
  }
  async setDefaultAddress(userId: number, addressId: number) {
    const existingAddress = await this.address.getAddressById(addressId);
    if (!existingAddress) {
      throw new AppError(404, "Address not found");
    }
    if (existingAddress.userId !== userId) {
      throw new AppError(403, "Unauthorized");
    }
    await this.address.setDefaultAddress(userId, addressId);
  }
  async editAddress(addressId: number, userId: number, data: EditAddressInput) {
    const existingAddress = await this.address.getAddressById(addressId);
    if (!existingAddress) throw new AppError(404, "Address not found");
    if (existingAddress.userId !== userId)
      throw new AppError(403, "Unauthorized");
    return this.address.editAddress(addressId, data);
  }
}
