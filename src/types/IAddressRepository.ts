import { Address } from "@prisma/client";

import {
  CreateAddressInput,
  EditAddressInput,
} from "../schemas/address.schema.js";

export interface IAddressRepository {
  createAddress(data: CreateAddressInput, userId: number): Promise<Address>;

  getUserAddresses(userId: number): Promise<Address[]>;

  getAddressById(addressId: number): Promise<Address | null>;

  deleteAddress(addressId: number): Promise<void>;

  setDefaultAddress(userId: number, addressId: number): Promise<void>;

  editAddress(addressId: number, data: EditAddressInput): Promise<Address>;
}
