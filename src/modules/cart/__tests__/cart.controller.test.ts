import CartService from "../CartService.js";
import CartController from "../CartController.js";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { AuthenticatedRequest } from "../../../types/authenticatedRequest.js";

const cartServiceMock: jest.Mocked<CartService> = {
  createCart: jest.fn().mockResolvedValue({ id: 1 }),
  cleanCart: jest.fn().mockResolvedValue(undefined),
  createCartItem: jest.fn(),
  getCartItem: jest.fn(),
  getCart: jest.fn().mockResolvedValue({ id: 1, items: [] }),
  deleteCartItem: jest.fn(),
  cartQuantityItem: jest.fn(),
} as any;

describe("Cart Controller test", () => {
  let controller: CartController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new CartController(cartServiceMock);
  });

  const mockResponse = () => {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;
  };

  test("Should create cart successfully", async () => {
    const req = { userId: 1 } as AuthenticatedRequest;
    const res = mockResponse();

    await controller.createCart(req, res);

    expect(cartServiceMock.createCart).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  test("Should get cart successfully", async () => {
    const req = { userId: 1 } as AuthenticatedRequest;
    const res = mockResponse();

    await controller.getCart(req, res);

    expect(cartServiceMock.getCart).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("Should clear cart successfully", async () => {
    const req = {
      params: { cartId: "1" },
      userId: 1,
    } as unknown as AuthenticatedRequest;

    const res = mockResponse();

    await controller.clearCart(req, res);

    expect(cartServiceMock.cleanCart).toHaveBeenCalledWith(1, 1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
  test("Should create cart item successfully", async () => {
    const req = {
      body: { cartId: 1, productId: 1, quantity: 2 },
      userId: 1,
    } as unknown as AuthenticatedRequest;
    const res = mockResponse();
    cartServiceMock.createCartItem.mockResolvedValue({
      cartItemId: 1,
      cartId: 1,
      productId: 1,
      quantity: 2,
    });

    await controller.createCartItem(req, res);
    expect(cartServiceMock.createCartItem).toHaveBeenCalledWith(
      { cartId: 1, productId: 1, quantity: 2 },
      1,
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });
  test("Should delete cart item successfully", async () => {
    const req = {
      params: { cartItemId: "1" },
      userId: 1,
    } as unknown as AuthenticatedRequest;
    const res = mockResponse();
    await controller.deleteCartItem(req, res);
    expect(cartServiceMock.deleteCartItem).toHaveBeenCalledWith(1, 1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
  test("Should update cart item quantity successfully", async () => {
    const req = {
      params: { cartItemId: "1" },
      userId: 1,
      body: { quantity: 5 },
    } as unknown as AuthenticatedRequest;
    const res = mockResponse();
    cartServiceMock.cartQuantityItem.mockResolvedValue({
      cartItemId: 1,
      cartId: 1,
      productId: 1,
      quantity: 5,
    });
    await controller.cartQuantityItem(req, res);
    expect(cartServiceMock.cartQuantityItem).toHaveBeenCalledWith(1, 5, 1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
  test("Should get cart items successfully", async () => {
    const req = {
      params: { cartId: "1" },
      userId: 1,
    } as unknown as AuthenticatedRequest;
    const res = mockResponse();
    cartServiceMock.getCartItem.mockResolvedValue([
      {
        cartItemId: 1,
        cartId: 1,
        productId: 1,
        quantity: 2,
        product: {
          productId: 1,
          productName: "Produto teste",
          productPrice: new Prisma.Decimal(10),
          stock: 5,
          productDescription: null,
          isFeatured: false,
          categoryId: null,
        },
      },
    ]);
    await controller.getCartItem(req, res);
    expect(cartServiceMock.getCartItem).toHaveBeenCalledWith(1, 1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});
