import { AddressService } from "./AddressService.js";
import { Request, Response } from "express";
import {
  CreateAddressInput,
  EditAddressInput,
} from "../../schemas/address.schema.js";
import { AppError } from "../../common/AppError.js";

export class AddressController {
  constructor(private address: AddressService) {}
  async createAddress(req: Request, res: Response): Promise<Response> {
    const userId = req.userId;
    if (!userId) throw new AppError(401, "Unauthorized");
    const data: CreateAddressInput = req.body;
    const address = await this.address.createAddress(data, userId);
    return res.status(201).json(address);
  }
  async getUserAddresses(req: Request, res: Response): Promise<Response> {
    const userId = req.userId;
    if (!userId) throw new AppError(401, "Unauthorized");
    const addresses = await this.address.getUserAddresses(userId);
    return res.status(200).json(addresses);
  }
  async deleteAddress(req: Request, res: Response): Promise<Response> {
    const addressId = Number(req.params.addressId);
    const userId = req.userId;
    if (!userId) throw new AppError(401, "Unauthorized");
    await this.address.deleteAddress(addressId, userId);
    return res.status(204).send();
  }
  async setDefaultAddress(req: Request, res: Response): Promise<Response> {
    const addressId = Number(req.params.addressId);
    const userId = req.userId;
    if (!userId) throw new AppError(401, "Unauthorized");
    await this.address.setDefaultAddress(userId, addressId);
    return res.status(204).send();
  }
  async editAddress(req: Request, res: Response): Promise<Response> {
    const addressId = Number(req.params.addressId);
    const userId = req.userId;
    if (!userId) throw new AppError(401, "Unauthorized");
    const data: EditAddressInput = req.body;
    const address = await this.address.editAddress(addressId, userId, data);
    return res.status(200).json(address);
  }
}
