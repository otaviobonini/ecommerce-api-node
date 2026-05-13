// auth.factory.ts
// This factory is responsible for creating the AuthController with all its dependencies.

import AuthController from "./AuthController.js";
import AuthService from "./AuthService.js";
import { AuthRepository } from "../../repositories/AuthRepository.js";

export function makeAuthController() {
  const authRepository = new AuthRepository();
  const authService = new AuthService(authRepository);
  return new AuthController(authService);
}
