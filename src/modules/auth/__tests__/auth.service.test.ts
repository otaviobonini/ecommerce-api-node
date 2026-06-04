import { describe, expect, jest, beforeEach } from "@jest/globals";
import AuthService from "../AuthService.js";
import { authRepositoryMock } from "../../../database/__mocks__/repositories.mock.js";
import {
  CreatedUser,
  CreateUserInputData,
} from "./factories/makeUser.factory.js";
import { AppError } from "../../../common/AppError.js";

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
      refreshToken: expect.any(String),
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
    authRepositoryMock.findUserByEmail.mockResolvedValue(null);
    const result = service.login(CreateUserInputData);
    await expect(result).rejects.toBeInstanceOf(AppError);
    await expect(result).rejects.toHaveProperty("statusCode", 401);
  });

  // Additional tests for logout and refresh token are here

  test("Should logout successfully with valid refresh token", async () => {
    authRepositoryMock.findRefreshToken.mockResolvedValue({
      id: 1,
      userId: CreatedUser.userId,
      token: "hashed",
      expiresAt: new Date(Date.now() + 10000),
      user: { ...CreatedUser, hashedPassword: "hash", role: "USER" as const },
    });

    await service.logout("raw-token");

    expect(authRepositoryMock.deleteRefreshToken).toHaveBeenCalledWith(1);
  });

  test("Should return silently when logout with invalid refresh token", async () => {
    authRepositoryMock.findRefreshToken.mockResolvedValue(null);

    await expect(service.logout("invalid-token")).resolves.toBeUndefined();
    expect(authRepositoryMock.deleteRefreshToken).not.toHaveBeenCalled();
  });

  test("Should logout all sessions by userId", async () => {
    await service.logoutAll(CreatedUser.userId);

    expect(authRepositoryMock.deleteRefreshTokensByUserId).toHaveBeenCalledWith(
      CreatedUser.userId,
    );
  });

  test("Should renew refresh token successfully", async () => {
    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    authRepositoryMock.findRefreshToken.mockResolvedValue({
      id: 1,
      userId: CreatedUser.userId,
      token: "hashed",
      expiresAt: futureDate,
      user: { ...CreatedUser, hashedPassword: "hash", role: "USER" as const },
    });
    authRepositoryMock.findUserById.mockResolvedValue({
      ...CreatedUser,
      role: "USER" as const,
      address: [],
      cart: null,
      order: [],
    });
    jwtMock.sign.mockReturnValue("new-access-token" as never);

    const result = await service.renewRefreshToken("raw-token");

    expect(result).toEqual({
      token: "new-access-token",
      refreshToken: expect.any(String),
    });
    expect(authRepositoryMock.deleteRefreshToken).toHaveBeenCalledWith(1);
  });

  test("Should fail to renew if refresh token is expired", async () => {
    const pastDate = new Date(Date.now() - 1000);
    authRepositoryMock.findRefreshToken.mockResolvedValue({
      id: 1,
      userId: CreatedUser.userId,
      token: "hashed",
      expiresAt: pastDate,
      user: { ...CreatedUser, hashedPassword: "hash", role: "USER" as const },
    });
    authRepositoryMock.findUserById.mockResolvedValue({
      ...CreatedUser,
      role: "USER" as const,
      address: [],
      cart: null,
      order: [],
    });

    const result = service.renewRefreshToken("raw-token");

    await expect(result).rejects.toBeInstanceOf(AppError);
    await expect(result).rejects.toHaveProperty("statusCode", 401);
    expect(authRepositoryMock.deleteRefreshToken).toHaveBeenCalledWith(1);
  });

  test("Should fail to renew if refresh token is invalid", async () => {
    authRepositoryMock.findRefreshToken.mockResolvedValue(null);

    const result = service.renewRefreshToken("invalid-token");

    await expect(result).rejects.toBeInstanceOf(AppError);
    await expect(result).rejects.toHaveProperty("statusCode", 401);
  });
});
