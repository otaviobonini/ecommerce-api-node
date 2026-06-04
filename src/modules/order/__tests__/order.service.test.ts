import OrderService from "../OrderService.js";
import {
  cartRepositoryMock,
  addressRepositoryMock,
  orderRepositoryMock,
  paymentGatewayMock,
} from "../../../database/__mocks__/repositories.mock.js";
import {
  AddressData,
  CartData,
  mockCartItems,
  mockOrderWithItems,
  mockPaymentResponse,
} from "./factories/order.factory.js";

describe("Order Service Tests", () => {
  let service: OrderService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new OrderService(
      paymentGatewayMock,
      orderRepositoryMock,
      cartRepositoryMock,
      addressRepositoryMock,
    );
  });
  describe("Create order tests", () => {
    test("Should create a sucessfull order", async () => {
      orderRepositoryMock.createOrder.mockResolvedValue(mockOrderWithItems);
      addressRepositoryMock.getAddressById.mockResolvedValue(AddressData);
      cartRepositoryMock.findCartByUserId.mockResolvedValue(CartData);
      cartRepositoryMock.getCartItems.mockResolvedValue(mockCartItems);
      paymentGatewayMock.createCheckoutSession.mockResolvedValue(
        mockPaymentResponse,
      );
      orderRepositoryMock.updateOrderPaymentLink.mockResolvedValue(
        mockOrderWithItems,
      );
      cartRepositoryMock.clearCart.mockResolvedValue({ count: 1 });

      const result = await service.createOrder(1, 1);
      expect(result).toEqual({
        orderId: 1,
        paymentLink: mockPaymentResponse.paymentLink,
      });

      expect(orderRepositoryMock.createOrder).toHaveBeenCalled();
      expect(paymentGatewayMock.createCheckoutSession).toHaveBeenCalled();
      expect(orderRepositoryMock.updateOrderPaymentLink).toHaveBeenCalledWith(
        1,
        mockPaymentResponse.paymentLink,
      );
      expect(cartRepositoryMock.clearCart).toHaveBeenCalledWith(1);
    });
    test("Should throw 404 if address does not exist", async () => {
      addressRepositoryMock.getAddressById.mockResolvedValue(null);

      await expect(service.createOrder(1, 1)).rejects.toMatchObject({
        statusCode: 404,
        message: "Address not found",
      });

      expect(cartRepositoryMock.findCartByUserId).not.toHaveBeenCalled();
    });

    test("Should throw 403 if address belongs to another user", async () => {
      addressRepositoryMock.getAddressById.mockResolvedValue({
        ...AddressData,
        userId: 2,
      });

      await expect(service.createOrder(1, 1)).rejects.toMatchObject({
        statusCode: 403,
        message: "Forbidden",
      });

      expect(cartRepositoryMock.findCartByUserId).not.toHaveBeenCalled();
    });

    test("Should throw 404 if cart does not exist", async () => {
      addressRepositoryMock.getAddressById.mockResolvedValue(AddressData);
      cartRepositoryMock.findCartByUserId.mockResolvedValue(null);

      await expect(service.createOrder(1, 1)).rejects.toMatchObject({
        statusCode: 404,
        message: "Cart not found",
      });

      expect(cartRepositoryMock.getCartItems).not.toHaveBeenCalled();
    });

    test("Should throw 400 if cart is empty", async () => {
      addressRepositoryMock.getAddressById.mockResolvedValue(AddressData);
      cartRepositoryMock.findCartByUserId.mockResolvedValue(CartData);
      cartRepositoryMock.getCartItems.mockResolvedValue([]);

      await expect(service.createOrder(1, 1)).rejects.toMatchObject({
        statusCode: 400,
        message: "Cart is empty",
      });

      expect(orderRepositoryMock.createOrder).not.toHaveBeenCalled();
      expect(paymentGatewayMock.createCheckoutSession).not.toHaveBeenCalled();
    });
    test("Should cancel order if payment provider fails", async () => {
      addressRepositoryMock.getAddressById.mockResolvedValue(AddressData);

      cartRepositoryMock.findCartByUserId.mockResolvedValue(CartData);

      cartRepositoryMock.getCartItems.mockResolvedValue(mockCartItems);

      orderRepositoryMock.createOrder.mockResolvedValue(mockOrderWithItems);

      paymentGatewayMock.createCheckoutSession.mockRejectedValue(
        new Error("Stripe error"),
      );

      orderRepositoryMock.cancelOrder.mockResolvedValue();

      await expect(service.createOrder(1, 1)).rejects.toMatchObject({
        statusCode: 502,
        message: "Payment provider unavailable, please try again",
      });

      expect(orderRepositoryMock.cancelOrder).toHaveBeenCalledWith(1);

      expect(orderRepositoryMock.updateOrderPaymentLink).not.toHaveBeenCalled();

      expect(cartRepositoryMock.clearCart).not.toHaveBeenCalled();
    });
  });
  describe("Webhook tests", () => {
    test("Should mark order as PAID when checkout session is completed", async () => {
      paymentGatewayMock.constructWebhookEvent.mockReturnValue({
        type: "checkout.session.completed",
        orderId: 1,
      });
      orderRepositoryMock.getOrderById.mockResolvedValue(mockOrderWithItems);

      orderRepositoryMock.editOrderStatus.mockResolvedValue(mockOrderWithItems);

      await service.handleWebhook(Buffer.from("payload"), "signature");

      expect(paymentGatewayMock.constructWebhookEvent).toHaveBeenCalledWith(
        Buffer.from("payload"),
        "signature",
      );

      expect(orderRepositoryMock.editOrderStatus).toHaveBeenCalledWith(
        1,
        "PAID",
      );
    });

    test("Should cancel order and restore stock when payment fails", async () => {
      paymentGatewayMock.constructWebhookEvent.mockReturnValue({
        type: "payment_intent.payment_failed",
        orderId: 1,
      });

      orderRepositoryMock.editOrderStatus.mockResolvedValue(mockOrderWithItems);
      orderRepositoryMock.restoreStock.mockResolvedValue(undefined);

      await service.handleWebhook(Buffer.from("payload"), "signature");

      expect(orderRepositoryMock.editOrderStatus).toHaveBeenCalledWith(
        1,
        "CANCELLED",
      );

      expect(orderRepositoryMock.restoreStock).toHaveBeenCalledWith(1);
    });
  });

  describe("Get orders by user id tests", () => {
    test("Should return user orders", async () => {
      orderRepositoryMock.getOrdersByUserId.mockResolvedValue([
        mockOrderWithItems,
      ]);

      const result = await service.getOrdersByUserId(1, "PAID", 0, 20);

      expect(result).toEqual([mockOrderWithItems]);

      expect(orderRepositoryMock.getOrdersByUserId).toHaveBeenCalledWith(
        1,
        "PAID",
        0,
        20,
      );
    });
  });

  describe("Get order by id tests", () => {
    test("Should return order if it belongs to user", async () => {
      orderRepositoryMock.getOrderById.mockResolvedValue(mockOrderWithItems);

      const result = await service.getOrderById(1, 1);

      expect(result).toEqual(mockOrderWithItems);
      expect(orderRepositoryMock.getOrderById).toHaveBeenCalledWith(1);
    });

    test("Should throw 404 if order does not exist", async () => {
      orderRepositoryMock.getOrderById.mockResolvedValue(null);

      await expect(service.getOrderById(1, 1)).rejects.toMatchObject({
        statusCode: 404,
        message: "Order not found",
      });
    });

    test("Should throw 403 if order belongs to another user", async () => {
      orderRepositoryMock.getOrderById.mockResolvedValue({
        ...mockOrderWithItems,
        userId: 2,
      });

      await expect(service.getOrderById(1, 1)).rejects.toMatchObject({
        statusCode: 403,
        message: "Forbidden",
      });
    });
  });

  describe("Get all orders tests", () => {
    test("Should return all orders", async () => {
      orderRepositoryMock.getAllOrders.mockResolvedValue([mockOrderWithItems]);

      const result = await service.getAllOrders(0, 20);

      expect(result).toEqual([mockOrderWithItems]);

      expect(orderRepositoryMock.getAllOrders).toHaveBeenCalledWith(0, 20);
    });
  });
});
