import { Router } from "express";

import { validateRequest } from "../../middlewares/validate.js";
import {
  AddressIdParamSchema,
  CreateAddressSchema,
  EditAddressSchema,
} from "../../schemas/address.schema.js";
import { AuthenticatedRequest } from "../../types/authenticatedRequest.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { makeAddressController } from "./address.factory.js";

const router = Router();
const controller = makeAddressController();

router.post(
  "/address",
  authMiddleware,
  validateRequest(CreateAddressSchema, "body"),
  (req, res) => controller.createAddress(req as AuthenticatedRequest, res),
);
router.get("/address", authMiddleware, (req, res) =>
  controller.getUserAddresses(req as AuthenticatedRequest, res),
);
router.delete(
  "/address/:addressId",
  authMiddleware,
  validateRequest(AddressIdParamSchema, "params"),
  (req, res) => controller.deleteAddress(req as AuthenticatedRequest, res),
);
router.put(
  "/address/:addressId/default",
  authMiddleware,
  validateRequest(AddressIdParamSchema, "params"),
  (req, res) => controller.setDefaultAddress(req as AuthenticatedRequest, res),
);
router.put(
  "/address/:addressId",
  authMiddleware,
  validateRequest(AddressIdParamSchema, "params"),
  validateRequest(EditAddressSchema, "body"),
  (req, res) => controller.editAddress(req as AuthenticatedRequest, res),
);

export default router;
