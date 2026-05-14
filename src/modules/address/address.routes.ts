import { Router } from "express";

import { validateRequest } from "../../middlewares/validate.js";
import {
  AddressIdParamSchema,
  CreateAddressSchema,
  EditAddressSchema,
} from "../../schemas/address.schema.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { makeAddressController } from "./address.factory.js";

const router = Router();
const controller = makeAddressController();

router.post(
  "/address",
  authMiddleware,
  validateRequest(CreateAddressSchema, "body"),
  controller.createAddress.bind(controller),
);
router.get(
  "/address",
  authMiddleware,
  controller.getUserAddresses.bind(controller),
);
router.delete(
  "/address/:addressId",
  authMiddleware,
  validateRequest(AddressIdParamSchema, "params"),
  controller.deleteAddress.bind(controller),
);
router.put(
  "/address/:addressId/default",
  authMiddleware,
  validateRequest(AddressIdParamSchema, "params"),
  controller.setDefaultAddress.bind(controller),
);
router.put(
  "/address/:addressId",
  authMiddleware,
  validateRequest(AddressIdParamSchema, "params"),
  validateRequest(EditAddressSchema, "body"),
  controller.editAddress.bind(controller),
);

export default router;
