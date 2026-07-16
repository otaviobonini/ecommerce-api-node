import { Router } from "express";
import { validateRequest } from "../../middlewares/validate.js";
import {
  CreateUserSchema,
  LoginUserSchema,
  RefreshTokenSchema,
} from "../../schemas/auth.schema.js";

import { makeAuthController } from "./auth.factory.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

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
router.post(
  "/logout-all",
  authMiddleware,
  Controller.logoutAll.bind(Controller),
);

router.post("/logout", Controller.logout.bind(Controller));
router.post("/refresh-token", Controller.renewRefreshToken.bind(Controller));

export default router;
