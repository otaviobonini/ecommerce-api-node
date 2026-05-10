import { prisma } from "../database/prisma.js";
import {
  CreateAddressInput,
  EditAddressInput,
} from "../schemas/address.schema.js";

export class AddressRepository {
  async createAddress(data: CreateAddressInput, userId: number) {
    const address = await prisma.address.create({
      data: { ...data, userId },
    });
    return address;
  }
  async getUserAddresses(userId: number) {
    const addresses = await prisma.address.findMany({
      where: { userId },
    });
    return addresses;
  }
  async getAddressById(addressId: number) {
    const address = await prisma.address.findUnique({
      where: { addressId },
    });
    return address;
  }
  async deleteAddress(addressId: number) {
    await prisma.address.delete({
      where: { addressId },
    });
  }
  async setDefaultAddress(userId: number, addressId: number) {
    await prisma.$transaction(async (trx) => {
      await trx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
      await trx.address.update({
        where: { addressId },
        data: { isDefault: true },
      });
    });
  }
  async editAddress(addressId: number, data: EditAddressInput) {
    const address = await prisma.address.update({
      where: { addressId },
      data: data,
    });
    return address;
  }
}
