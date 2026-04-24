import { AppError } from "../../common/AppError.js";
import { AuthRepository } from "../../repositories/AuthRepository.js";
import { CreateUserInput, LoginUserInput } from "../../schemas/auth.schema.js";
import bcrypt from "bcrypt";
import { CreateUserDTO } from "../../types/auth.types.js";
import jwt from "jsonwebtoken";

class AuthService {
  constructor(private database: AuthRepository) {}

  async register(data: CreateUserInput) {
    const userExists = await this.database.findUserByEmail(data.email);
    if (userExists) {
      throw new AppError(409, "User already exists");
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userData: CreateUserDTO = {
      username: data.username,
      hashedPassword,
      email: data.email,
    };
    const newUser = await this.database.createUser(userData);
    return newUser;
  }
  async login(data: LoginUserInput) {
    const userExists = await this.database.findUserByEmail(data.email);
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
    if (!process.env.JWT_SECRET) {
      throw new AppError(500, "Undefined JWT_SECRET");
    }

    const token = jwt.sign({ id: userExists.userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return {
      id: userExists.userId,
      email: userExists.email,
      username: userExists.username,
      token,
    };
  }
}

export default AuthService;
