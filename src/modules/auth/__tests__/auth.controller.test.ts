import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Request, Response } from "express";
import AuthController from "../AuthController.js";
import AuthService from "../AuthService.js";

const authServiceMock: jest.Mocked<AuthService> = {
  login: jest.fn(),
  register: jest.fn(),
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
});
