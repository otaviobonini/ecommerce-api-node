import { AddressController } from "../AddressController.js";
import { AddressService } from "../AddressService.js";
import { Request, Response } from "express";

const mockAddressService: jest.Mocked<AddressService> = {
  createAddress: jest.fn(),
  getUserAddresses: jest.fn(),
  deleteAddress: jest.fn(),
  setDefaultAddress: jest.fn(),
  editAddress: jest.fn(),
} as any;

describe("Address Controller tests", () => {
  let controller: AddressController;
  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AddressController(mockAddressService);
  });

  test("Should create a new address", async () => {
    const req = {
      userId: 1,
      body: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "12345",
      },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.createAddress(req, res);
    expect(mockAddressService.createAddress).toHaveBeenCalledWith(
      req.body,
      Number(req.userId),
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  test("Should get user addresses", async () => {
    const req = { userId: 1 } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.getUserAddresses(req, res);
    expect(mockAddressService.getUserAddresses).toHaveBeenCalledWith(
      Number(req.userId),
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("Should delete an address", async () => {
    const req = {
      userId: 1,
      params: { addressId: 1 },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    await controller.deleteAddress(req, res);
    expect(mockAddressService.deleteAddress).toHaveBeenCalledWith(1, 1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  test("Should set default address", async () => {
    const req = {
      userId: 1,
      params: { addressId: 1 },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    await controller.setDefaultAddress(req, res);
    expect(mockAddressService.setDefaultAddress).toHaveBeenCalledWith(1, 1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  test("Should edit an address", async () => {
    const body = {
      street: "456 Oak Ave",
      city: "Somewhere",
      state: "NY",
      zipCode: "67890",
    };
    const req = {
      userId: 1,
      params: { addressId: 1 },
      body,
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.editAddress(req, res);
    expect(mockAddressService.editAddress).toHaveBeenCalledWith(1, 1, body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});
