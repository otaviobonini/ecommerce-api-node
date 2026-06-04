import { IS3Gateway } from "../../interfaces/IS3Gateway.js";
import { IImageRepository } from "../../interfaces/IImageRepository.js";
import { IAuthRepository } from "../../interfaces/IAuthRepository.js";
import { IAddressRepository } from "../../interfaces/IAddressRepository.js";
import { IProductRepository } from "../../interfaces/IProductRepository.js";
import { ICartRepository } from "../../interfaces/ICartRepository.js";
import { IPaymentGateway } from "../../interfaces/IPaymentGateway.js";
import { IOrderRepository } from "../../interfaces/IOrderRepository.js";
import { ICategoryRepository } from "../../interfaces/ICategoriesRepository.js";

export const ImageRepositoryMock: jest.Mocked<IImageRepository> = {
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
  setPrimaryImage: jest.fn(),
  findImageById: jest.fn(),
};

export const S3GatewayMock: jest.Mocked<IS3Gateway> = {
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
};

export const authRepositoryMock: jest.Mocked<IAuthRepository> = {
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  findUserByEmailWithoutPassword: jest.fn(),
  findUserById: jest.fn(),
};

export const addressRepositoryMock: jest.Mocked<IAddressRepository> = {
  createAddress: jest.fn(),
  getUserAddresses: jest.fn(),
  getAddressById: jest.fn(),
  deleteAddress: jest.fn(),
  setDefaultAddress: jest.fn(),
  editAddress: jest.fn(),
};

export const cartRepositoryMock: jest.Mocked<ICartRepository> = {
  createCart: jest.fn(),
  upsertCartItem: jest.fn(),
  findCartItem: jest.fn(),
  updateCartItemQuantity: jest.fn(),
  clearCart: jest.fn(),
  getCartItems: jest.fn(),
  deleteCartItem: jest.fn(),
  findCartByUserId: jest.fn(),
  findCartById: jest.fn(),
  findCartItemById: jest.fn(),
};

export const productRepositoryMock: jest.Mocked<IProductRepository> = {
  createProduct: jest.fn(),
  editProduct: jest.fn(),
  deleteProduct: jest.fn(),
  getProducts: jest.fn(),
  findProductById: jest.fn(),
};

export const orderRepositoryMock: jest.Mocked<IOrderRepository> = {
  createOrder: jest.fn(),
  getAllOrders: jest.fn(),
  restoreStock: jest.fn(),
  cancelOrder: jest.fn(),
  updateOrderPaymentLink: jest.fn(),
  getOrderById: jest.fn(),
  getOrdersByUserId: jest.fn(),
  editOrderStatus: jest.fn(),
};

export const paymentGatewayMock: jest.Mocked<IPaymentGateway> = {
  createCheckoutSession: jest.fn(),
  constructWebhookEvent: jest.fn(),
};

export const categoriesRepositoryMock: jest.Mocked<ICategoryRepository> = {
  createCategory: jest.fn(),
  deleteCategory: jest.fn(),
  findAll: jest.fn(),
  findByName: jest.fn(),
  findById: jest.fn(),
  getProductsByCategory: jest.fn(),
  getFeaturedProducts: jest.fn(),
};
