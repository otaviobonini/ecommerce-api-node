import { CreateUserInput, LoginUserInput } from "../../schemas/auth.schema.js";
import AuthService from "./authService.js";
import { Request, Response } from "express";

class AuthController {
  constructor(private service: AuthService) {}

  async register(req: Request, res: Response) {
    const { username, email, password } = req.body as CreateUserInput;

    const user = await this.service.register({ username, email, password });
    return res.status(201).json(user);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body as LoginUserInput;
    const user = await this.service.login({ email, password });
    return res.status(200).json(user);
  }
}

export default AuthController;
