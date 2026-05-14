// order.factory.ts
// This factory is responsible for creating the OrderController with all its dependencies.

import OrderController from "./OrderController.js";
import OrderService from "./OrderService.js";
import { OrderRepository } from "../../repositories/OrderRepository.js";
import { CartRepository } from "../../repositories/CartRepository.js";
import { AddressRepository } from "../../repositories/AddressRepository.js";
import { StripeGateway } from "../../providers/StripeGateway.js";

export function makeOrderController() {
  const paymentGateway = new StripeGateway();

  const orderRepository = new OrderRepository();
  const cartRepository = new CartRepository();
  const addressRepository = new AddressRepository();

  const orderService = new OrderService(
    paymentGateway,
    orderRepository,
    cartRepository,
    addressRepository,
  );

  return new OrderController(orderService);
}
