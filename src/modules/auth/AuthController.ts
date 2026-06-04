import { CreateUserInput, LoginUserInput } from "../../schemas/auth.schema.js";
import AuthService from "./AuthService.js";
import { Request, Response } from "express";

class AuthController {
  constructor(private service: AuthService) {}

  async register(req: Request, res: Response): Promise<Response> {
    const { username, email, password } = req.body as CreateUserInput;

    const user = await this.service.register({ username, email, password });
    return res.status(201).json(user);
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body as LoginUserInput;
    const user = await this.service.login({ email, password });
    return res.status(200).json(user);
  }
  async logoutAll(req: Request, res: Response): Promise<Response> {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await this.service.logoutAll(userId);
    return res.status(204).send();
  }
  async logout(req: Request, res: Response): Promise<Response> {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    await this.service.logout(refreshToken);
    return res.status(204).send();
  }
  async renewRefreshToken(req: Request, res: Response): Promise<Response> {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    const tokens = await this.service.renewRefreshToken(refreshToken);
    return res.status(200).json(tokens);
  }
}

export default AuthController;
