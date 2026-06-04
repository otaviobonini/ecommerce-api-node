import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Request, Response } from "express";
import AuthController from "../AuthController.js";
import AuthService from "../AuthService.js";

const authServiceMock: jest.Mocked<AuthService> = {
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  logoutAll: jest.fn(),
  renewRefreshToken: jest.fn(),
} as any;

describe("Auth Controller test", () => {
  let controller: AuthController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AuthController(authServiceMock);
  });
  test("Should return sucess when login", async () => {
    const req = {
      body: {
        username: "test",
        email: "test@test.com",
        password: "123456",
      },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
  test("Should return sucess when register", async () => {
    const req = {
      body: {
        email: "test@test.com",
        password: "123456",
      },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  // refresh token controller tests
  test("Should return 204 when logout succeeds", async () => {
    const req = {
      body: { refreshToken: "valid-token" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    await controller.logout(req, res);

    expect(authServiceMock.logout).toHaveBeenCalledWith("valid-token");
    expect(res.status).toHaveBeenCalledWith(204);
  });

  test("Should return 400 when logout is called without refresh token", async () => {
    const req = { body: {} } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.logout(req, res);

    expect(authServiceMock.logout).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("Should return 204 when logoutAll succeeds", async () => {
    const req = { userId: 1 } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    await controller.logoutAll(req, res);

    expect(authServiceMock.logoutAll).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(204);
  });

  test("Should return 200 with new tokens when renewing refresh token", async () => {
    authServiceMock.renewRefreshToken.mockResolvedValue({
      token: "new-access-token",
      refreshToken: "new-refresh-token",
    });
    const req = {
      body: { refreshToken: "old-token" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.renewRefreshToken(req, res);

    expect(authServiceMock.renewRefreshToken).toHaveBeenCalledWith("old-token");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: "new-access-token",
      refreshToken: "new-refresh-token",
    });
  });

  test("Should return 400 when renewing without refresh token", async () => {
    const req = { body: {} } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.renewRefreshToken(req, res);

    expect(authServiceMock.renewRefreshToken).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
