import { Router } from "express";
import { validateRequest } from "../../middlewares/validate.js";
import {
  CreateUserSchema,
  LoginUserSchema,
} from "../../schemas/auth.schema.js";

import { makeAuthController } from "./auth.factory.js";

const Controller = makeAuthController();
const router = Router();

router.post(
  "/register",
  validateRequest(CreateUserSchema, "body"),
  Controller.register.bind(Controller),
);

router.post(
  "/login",
  validateRequest(LoginUserSchema, "body"),
  Controller.login.bind(Controller),
);

export default router;
