import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import AuthService from "../AuthService.js";
import { AuthRepository } from "../../../repositories/AuthRepository.js";
import {
  CreatedUser,
  CreateUserInputData,
} from "./factories/makeUser.factory.js";
import { AppError } from "../../../common/AppError.js";

const authRepositoryMock: jest.Mocked<AuthRepository> = {
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  findUserByEmailWithoutPassword: jest.fn(),
  findUserById: jest.fn(),
};
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const jwtMock = jwt as jest.Mocked<typeof jwt>;
const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;

describe("Auth Service tests", () => {
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(authRepositoryMock);
  });

  test("Should create a new user", async () => {
    authRepositoryMock.findUserByEmail.mockResolvedValue(null);

    authRepositoryMock.createUser.mockResolvedValue(CreatedUser);

    const result = await service.register(CreateUserInputData);

    expect(authRepositoryMock.findUserByEmail).toHaveBeenCalledWith(
      CreateUserInputData.email,
    );
    expect(authRepositoryMock.createUser).toHaveBeenCalled();

    expect(result).toEqual(CreatedUser);
  });
  test("Should fail if user exists", async () => {
    authRepositoryMock.findUserByEmail.mockResolvedValue({
      ...CreatedUser,
      hashedPassword: "hash",
      role: "USER",
    });
    const result = service.register(CreateUserInputData);
    await expect(result).rejects.toBeInstanceOf(AppError);
    await expect(result).rejects.toHaveProperty("statusCode", 409);
  });
  test("Should login sucessfully", async () => {
    authRepositoryMock.findUserByEmail.mockResolvedValue({
      ...CreatedUser,
      hashedPassword: "hash",
      role: "USER",
    });
    bcryptMock.compare.mockResolvedValue(true as never);
    jwtMock.sign.mockReturnValue("token" as never);
    const result = await service.login(CreateUserInputData);
    expect(result).toEqual({
      id: CreatedUser.userId,
      email: CreatedUser.email,
      username: CreatedUser.username,
      token: "token",
    });
  });
  test("Should fail if password incorrect", async () => {
    authRepositoryMock.findUserByEmail.mockResolvedValue({
      ...CreatedUser,
      hashedPassword: "hash",
      role: "USER",
    });
    bcryptMock.compare.mockResolvedValue(false as never);
    const result = service.login(CreateUserInputData);
    await expect(result).rejects.toBeInstanceOf(AppError);
    await expect(result).rejects.toHaveProperty("statusCode", 401);
  });
  test("Should fail if user not found", async () => {
    authRepositoryMock.findUserByEmail(null as never);
    const result = service.login(CreateUserInputData);
    await expect(result).rejects.toBeInstanceOf(AppError);
    await expect(result).rejects.toHaveProperty("statusCode", 401);
  });
});
