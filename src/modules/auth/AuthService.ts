import { AppError } from "../../common/AppError.js";
import { CreateUserInput, LoginUserInput } from "../../schemas/auth.schema.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  CreateUserDTO,
  CreateUserResponse,
  SafeUserWithToken,
} from "../../types/auth.types.js";
import jwt from "jsonwebtoken";
import { env } from "../../schemas/env.schema.js";
import { IAuthRepository } from "../../interfaces/IAuthRepository.js";

class AuthService {
  constructor(private auth: IAuthRepository) {}

  async register(data: CreateUserInput): Promise<CreateUserResponse> {
    const userExists = await this.auth.findUserByEmail(data.email);
    if (userExists) {
      throw new AppError(409, "User already exists");
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userData: CreateUserDTO = {
      username: data.username,
      hashedPassword,
      email: data.email,
    };
    return this.auth.createUser(userData);
  }
  async login(data: LoginUserInput): Promise<SafeUserWithToken> {
    const userExists = await this.auth.findUserByEmail(data.email);
    if (!userExists) {
      throw new AppError(401, "Invalid email or password");
    }
    const validatePassword = await bcrypt.compare(
      data.password,
      userExists.hashedPassword,
    );
    if (!validatePassword) {
      throw new AppError(401, "Invalid email or password");
    }

    const token = jwt.sign(
      { id: userExists.userId, role: userExists.role },
      env.JWT_SECRET,
      {
        expiresIn: "15min",
      },
    );

    const refreshToken = await this.generateRefreshToken(userExists.userId);

    return {
      id: userExists.userId,
      email: userExists.email,
      username: userExists.username,
      token,
      refreshToken,
    };
  }

  private async generateRefreshToken(userId: number): Promise<string> {
    const rawRefreshToken = crypto.randomUUID();
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(rawRefreshToken)
      .digest("hex");
    // We need to hash the refresh token before storing in the database in case the database is
    // compromised. This way the attacker won't be able to use the refresh tokens.
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Refresh token valid for 7 days

    // Now we insert the data in the database
    await this.auth.createRefreshToken({
      userId,
      token: hashedRefreshToken,
      expiresAt,
    });
    // We return the raw refresh token to the user
    return rawRefreshToken;
  }
  async renewRefreshToken(oldToken: string): Promise<{
    token: string;
    refreshToken: string;
  }> {
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(oldToken)
      .digest("hex");
    const existingToken = await this.auth.findRefreshToken(hashedRefreshToken);
    if (!existingToken) {
      throw new AppError(401, "Invalid refresh token");
    }
    const user = await this.auth.findUserById(existingToken.userId);

    if (!user) {
      throw new AppError(401, "User not found");
    }
    if (existingToken.expiresAt < new Date()) {
      await this.auth.deleteRefreshToken(existingToken.id);
      throw new AppError(401, "Refresh token expired");
    }
    const newToken = await this.generateRefreshToken(existingToken.userId);

    await this.auth.deleteRefreshToken(existingToken.id);

    const token = jwt.sign(
      { id: existingToken.userId, role: user.role },
      env.JWT_SECRET,
      {
        expiresIn: "15min",
      },
    );
    return {
      token: token,
      refreshToken: newToken,
    };
  }

  async logoutAll(userId: number): Promise<void> {
    await this.auth.deleteRefreshTokensByUserId(userId);
  }
  async logout(refreshToken: string): Promise<void> {
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const existingToken = await this.auth.findRefreshToken(hashedRefreshToken);
    if (!existingToken) {
      return; // we dont return a error to avoid leaking information about the validity of the token
    }
    await this.auth.deleteRefreshToken(existingToken.id);
  }
  // checagem somente-leitura usada pelo middleware do front pra liberar /admin:
  // ao contrário de renewRefreshToken, NÃO rotaciona o token — o gate roda a
  // cada navegação e rotacionar aqui dessincronizaria o cookie do browser
  async validateAdminSession(refreshToken: string): Promise<void> {
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const token = await this.auth.findRefreshToken(hashedRefreshToken);
    if (!token) {
      throw new AppError(401, "Invalid refresh token");
    }
    if (token.expiresAt < new Date()) {
      await this.auth.deleteRefreshToken(token.id);
      throw new AppError(401, "Refresh token expired");
    }
    const user = await this.auth.findUserById(token.userId);
    if (!user) {
      throw new AppError(401, "User not found");
    }
    if (user.role !== "ADMIN") {
      throw new AppError(403, "Forbidden");
    }
  }
}

export default AuthService;
