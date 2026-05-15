import { AddressService } from "./AddressService.js";
import { Request, Response } from "express";
import {
  CreateAddressInput,
  EditAddressInput,
} from "../../schemas/address.schema.js";
import { AuthenticatedRequest } from "../../types/express.js";

export class AddressController {
  constructor(private address: AddressService) {}
  async createAddress(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    const userId = req.userId;
    const data: CreateAddressInput = req.body;
    const address = await this.address.createAddress(data, userId);
    return res.status(201).json(address);
  }
  async getUserAddresses(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    const userId = req.userId;

    const addresses = await this.address.getUserAddresses(userId);
    return res.status(200).json(addresses);
  }
  async deleteAddress(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    const addressId = Number(req.params.addressId);
    const userId = req.userId;
    await this.address.deleteAddress(addressId, userId);
    return res.status(204).send();
  }
  async setDefaultAddress(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    const addressId = Number(req.params.addressId);
    const userId = req.userId;
    await this.address.setDefaultAddress(userId, addressId);
    return res.status(204).send();
  }
  async editAddress(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    const addressId = Number(req.params.addressId);
    const userId = req.userId;
    const data: EditAddressInput = req.body;
    const address = await this.address.editAddress(addressId, userId, data);
    return res.status(200).json(address);
  }
}
