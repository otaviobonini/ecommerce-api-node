// address.factory.ts
// This factory is responsible for creating the AddressController with all its dependencies.

import { AddressRepository } from "../../repositories/AddressRepository.js";
import { AddressController } from "./AddressController.js";
import { AddressService } from "./AddressService.js";

export function makeAddressController() {
  return new AddressController(new AddressService(new AddressRepository()));
}
