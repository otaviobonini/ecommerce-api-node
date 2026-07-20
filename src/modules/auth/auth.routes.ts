import { Router } from "express";
import { validateRequest } from "../../middlewares/validate.js";
import {
  CreateUserSchema,
  LoginUserSchema,
  RefreshTokenSchema,
} from "../../schemas/auth.schema.js";

import { makeAuthController } from "./auth.factory.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { AdminSessionLimiter, AuthLimiter, RefreshLimiter } from "../../utils/rateLimit.js";

const Controller = makeAuthController();
const router = Router();

router.post(
  "/register",
  AuthLimiter,
  validateRequest(CreateUserSchema, "body"),
  Controller.register.bind(Controller),
);

router.post(
  "/login",
  AuthLimiter,
  validateRequest(LoginUserSchema, "body"),
  Controller.login.bind(Controller),
);

router.post(
  "/logout-all",
  authMiddleware,
  Controller.logoutAll.bind(Controller),
);
router.post("/logout", Controller.logout.bind(Controller));

router.post(
  "/refresh-token",
  RefreshLimiter,
  Controller.renewRefreshToken.bind(Controller),
);

router.post("/auth/admin-session", AdminSessionLimiter, Controller.validateAdminSession.bind(Controller));
export default router;
