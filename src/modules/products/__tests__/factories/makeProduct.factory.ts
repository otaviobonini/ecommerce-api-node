import { CreateProductDTO } from "../../../../types/product.types.js";
import { Decimal } from "@prisma/client/runtime/library";

export type Role = "ADMIN" | "USER";
export const CreateProductInputData: CreateProductDTO = {
  productName: "test",
  productPrice: 20,
  stock: 2,
};

export const FindUserByIdData = {
  userId: 1,
  email: "test@test.com",
  username: "rafael",
  role: "ADMIN" as Role,
  order: [],
  cart: null,
  address: [],
};

export const ProductData = {
  productId: 1,
  productName: "Produto Teste",
  productPrice: new Decimal(99.9),
  stock: 10,
};

export const ProductList = [
  {
    productId: 1,
    productName: "Produto Teste",
    productPrice: new Decimal(99.9),
    stock: 10,
  },
  {
    productId: 2,
    productName: "Mouse Gamer",
    productPrice: new Decimal(150),
    stock: 5,
  },
  {
    productId: 3,
    productName: "Teclado Mecânico",
    productPrice: new Decimal(300),
    stock: 3,
  },
];
