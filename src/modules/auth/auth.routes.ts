import AuthController from "./authController.js";
import { Router } from "express";
import { validateRequest } from "../../middlewares/validate.js";
import {
  CreateUserSchema,
  LoginUserSchema,
} from "../../schemas/auth.schema.js";
import AuthService from "./authService.js";
import { AuthRepository } from "../../repositories/AuthRepository.js";

const Controller = new AuthController(new AuthService(new AuthRepository()));

const router = Router();

router.post(
  "/register",
  validateRequest(CreateUserSchema, "body"),
  Controller.login.bind(Controller),
);

export default router;
