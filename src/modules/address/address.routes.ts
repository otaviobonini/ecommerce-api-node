import { Router } from "express";
import { AddressController } from "./AddressController.js";
import { AddressService } from "./AddressService.js";
import { AddressRepository } from "../../repositories/AddressRepository.js";
import { validateRequest } from "../../middlewares/validate.js";
import {
  AddressIdParamSchema,
  CreateAddressSchema,
  EditAddressSchema,
} from "../../schemas/address.schema.js";

const router = Router();
const controller = new AddressController(
  new AddressService(new AddressRepository()),
);

router.post(
  "/address",
  validateRequest(CreateAddressSchema, "body"),
  controller.createAddress.bind(controller),
);
router.get("/address", controller.getUserAddresses.bind(controller));
router.delete(
  "/address/:addressId",
  validateRequest(AddressIdParamSchema, "params"),
  controller.deleteAddress.bind(controller),
);
router.put(
  "/address/:addressId/default",
  validateRequest(AddressIdParamSchema, "params"),
  controller.setDefaultAddress.bind(controller),
);
router.put(
  "/address/:addressId",
  validateRequest(AddressIdParamSchema, "params"),
  validateRequest(EditAddressSchema, "body"),
  controller.editAddress.bind(controller),
);

export default router;
