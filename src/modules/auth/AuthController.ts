import { CreateUserInput, LoginUserInput } from "../../schemas/auth.schema.js";
import { env } from "../../schemas/env.schema.js";
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
    res.cookie("refreshToken", user.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/refresh-token", // escopo mínimo necessário
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      id: user.id,
      email: user.email,
      username: user.username,
      token: user.token,
    });
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
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    await this.service.logout(refreshToken);
    res.clearCookie("refreshToken", { path: "/" });
    return res.status(204).send();
  }
  async renewRefreshToken(req: Request, res: Response): Promise<Response> {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    const tokens = await this.service.renewRefreshToken(refreshToken);
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/refresh-token",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ token: tokens.token });
  }
}

export default AuthController;
