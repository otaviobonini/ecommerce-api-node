import { User, Address, Cart, CartItem, Product } from "@prisma/client";

import {
  CreateAddressInput,
  EditAddressInput,
} from "../schemas/address.schema.js";

import {
  CreateUserDTO,
  CreateUserResponse,
  SafeUser,
  UserWithRelations,
} from "./auth.types.js";

import { CreateProductInput } from "../schemas/product.schema.js";

export interface IAuthRepository {
  createUser(data: CreateUserDTO): Promise<CreateUserResponse>;

  findUserByEmail(email: string): Promise<User | null>;

  findUserByEmailWithoutPassword(email: string): Promise<SafeUser | null>;

  findUserById(id: number): Promise<UserWithRelations | null>;
}

export interface IAddressRepository {
  createAddress(data: CreateAddressInput, userId: number): Promise<Address>;

  getUserAddresses(userId: number): Promise<Address[]>;

  getAddressById(addressId: number): Promise<Address | null>;

  deleteAddress(addressId: number): Promise<void>;

  setDefaultAddress(userId: number, addressId: number): Promise<void>;

  editAddress(addressId: number, data: EditAddressInput): Promise<Address>;
}

export interface ICartRepository {
  createCart(userId: number): Promise<Cart>;

  upsertCartItem(
    cartId: number,
    productId: number,
    quantity: number,
  ): Promise<CartItem>;

  findCartItem(cartId: number, productId: number): Promise<CartItem | null>;

  updateCartItemQuantity(
    cartItemId: number,
    quantity: number,
  ): Promise<CartItem>;

  clearCart(cartId: number): Promise<{ count: number }>;

  getCartItems(cartId: number): Promise<
    (CartItem & {
      product: Product;
    })[]
  >;

  deleteCartItem(cartItemId: number): Promise<CartItem>;

  findCartByUserId(userId: number): Promise<Cart | null>;

  findCartById(cartId: number): Promise<Cart | null>;

  findCartItemById(cartItemId: number): Promise<CartItem | null>;
}

export interface IProductRepository {
  createProduct(data: CreateProductInput): Promise<Product>;

  editProduct(data: CreateProductInput, productId: number): Promise<Product>;

  deleteProduct(productId: number): Promise<Product>;

  getProducts(limit: number, offset: number): Promise<Product[]>;

  findProductById(productId: number): Promise<Product | null>;
}
