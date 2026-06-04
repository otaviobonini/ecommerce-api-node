import { AppError } from "../../common/AppError.js";
import { CreateUserInput, LoginUserInput } from "../../schemas/auth.schema.js";
import bcrypt from "bcrypt";
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
        expiresIn: "7d",
      },
    );
    return {
      id: userExists.userId,
      email: userExists.email,
      username: userExists.username,
      token,
    };
  }
}

export default AuthService;
