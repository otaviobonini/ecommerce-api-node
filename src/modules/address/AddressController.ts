import { AddressService } from "./addressService.js";
import { Request, Response } from "express";
import { CreateAddressInput } from "../../schemas/address.schema.js";

export class AddressController {
  constructor(private address: AddressService) {}
  async createAddress(req: Request, res: Response) {
    const data = req.body;
    const address = await this.address.createAddress(data);
    return res.status(201).json(address);
  }
  async getUserAddresses(req: Request, res: Response) {
    const userId = Number(req.userId);
    const addresses = await this.address.getUserAddresses(userId);
    return res.status(200).json(addresses);
  }
  async deleteAddress(req: Request, res: Response) {
    const addressId = Number(req.params.addressId);
    const userId = Number(req.userId);
    await this.address.deleteAddress(addressId, userId);
    return res.status(204).send();
  }
  async setDefaultAddress(req: Request, res: Response) {
    const addressId = Number(req.params.addressId);
    const userId = Number(req.userId);
    await this.address.setDefaultAddress(userId, addressId);
    return res.status(204).send();
  }
  async editAddress(req: Request, res: Response) {
    const addressId = Number(req.params.addressId);
    const userId = Number(req.userId);
    const data = req.body as Partial<CreateAddressInput>;
    const address = await this.address.editAddress(addressId, userId, data);
    return res.status(200).json(address);
  }
}
