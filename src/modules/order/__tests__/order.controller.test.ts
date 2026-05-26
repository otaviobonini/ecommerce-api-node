import { describe, expect, jest, beforeEach } from "@jest/globals";
import { Request, Response } from "express";
import OrderController from "../OrderController.js";
import OrderService from "../OrderService.js";
import { AuthenticatedRequest } from "../../../types/authenticatedRequest.js";
import { OrderItem } from "@prisma/client";
import { any } from "zod";

const orderServiceMock: jest.Mocked<OrderService> = {
  createOrder: jest.fn(),
  handleWebhook: jest.fn(),
  getOrderById: jest.fn(),
  getOrdersByUserId: jest.fn(),
  getAllOrders: jest.fn(),
} as any;

describe("Order Controller test", () => {
  let controller: OrderController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new OrderController(orderServiceMock);
  });

  test("Should create order successfully", async () => {
    const req = {
      userId: 1,
      body: {
        addressId: 1,
      },
    } as unknown as AuthenticatedRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockOrder = {
      orderId: 1,
      userId: 1,
      addressId: 1,
      total: 100,
      status: "PENDING",
      createdAt: new Date(),
    };

    orderServiceMock.createOrder.mockResolvedValue(mockOrder as any);

    await controller.createOrder(req, res);

    expect(orderServiceMock.createOrder).toHaveBeenCalledWith(1, 1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockOrder);
  });

  test("Should handle webhook successfully", async () => {
    const req = {
      headers: {
        "stripe-signature": "test-signature",
      },
      body: Buffer.from("test-body"),
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    orderServiceMock.handleWebhook.mockResolvedValue(undefined as any);

    await controller.handleWebhook(req, res);

    expect(orderServiceMock.handleWebhook).toHaveBeenCalledWith(
      Buffer.from("test-body"),
      "test-signature",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });

  test("Should get order by id successfully", async () => {
    const req = {
      userId: 1,
      params: {
        orderId: "1",
      },
    } as unknown as AuthenticatedRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockOrder = {
      orderId: 1,
      userId: 1,
      addressId: 1,
      total: 100,
      status: "PENDING",
      createdAt: new Date(),
    };

    orderServiceMock.getOrderById.mockResolvedValue(mockOrder as any);

    await controller.getOrderById(req, res);

    expect(orderServiceMock.getOrderById).toHaveBeenCalledWith(1, 1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockOrder);
  });

  test("Should get user orders successfully", async () => {
    const req = {
      userId: 1,
      query: {
        status: "PENDING",
        offset: "0",
        limit: "10",
      },
    } as unknown as AuthenticatedRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockOrders = [
      {
        orderId: 1,
        userId: 1,
        addressId: 1,
        total: 100,
        status: "PENDING",
        createdAt: new Date(),
      },
    ];

    orderServiceMock.getOrdersByUserId.mockResolvedValue(mockOrders as any);

    await controller.getUserOrders(req, res);

    expect(orderServiceMock.getOrdersByUserId).toHaveBeenCalledWith(
      1,
      "PENDING",
      0,
      10,
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockOrders);
  });

  test("Should get user orders with default pagination", async () => {
    const req = {
      userId: 1,
      query: {},
    } as unknown as AuthenticatedRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockOrders: any = [];

    orderServiceMock.getOrdersByUserId.mockResolvedValue(mockOrders as any);

    await controller.getUserOrders(req, res);

    expect(orderServiceMock.getOrdersByUserId).toHaveBeenCalledWith(
      1,
      undefined,
      0,
      20,
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockOrders);
  });

  test("Should get all orders successfully", async () => {
    const req = {
      query: {
        offset: "0",
        limit: "20",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockOrders = [
      {
        orderId: 1,
        userId: 1,
        addressId: 1,
        total: 100,
        status: "COMPLETED",
        createdAt: new Date(),
      },
      {
        orderId: 2,
        userId: 2,
        addressId: 2,
        total: 200,
        status: "PENDING",
        createdAt: new Date(),
      },
    ];

    orderServiceMock.getAllOrders.mockResolvedValue(mockOrders as any);

    await controller.getAllOrders(req, res);

    expect(orderServiceMock.getAllOrders).toHaveBeenCalledWith(0, 20);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockOrders);
  });

  test("Should get all orders with default pagination", async () => {
    const req = {
      query: {},
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockOrders: any = [];

    orderServiceMock.getAllOrders.mockResolvedValue(mockOrders as any);

    await controller.getAllOrders(req, res);

    expect(orderServiceMock.getAllOrders).toHaveBeenCalledWith(0, 20);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockOrders);
  });
});
