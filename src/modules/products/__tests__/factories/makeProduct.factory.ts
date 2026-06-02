import { Decimal } from "@prisma/client/runtime/library";
import { Product } from "@prisma/client";
import { CreateProductInput } from "../../../../schemas/product.schema.js";
import { ProductWithImages } from "../../../../types/product.types.js";

export type Role = "ADMIN" | "USER";
export const CreateProductInputData: CreateProductInput = {
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

export const ProductData: Product = {
  productId: 1,
  productName: "Produto Teste",
  productPrice: new Decimal(99.9),
  stock: 10,
  productDescription: null,
  isFeatured: false,
  categoryId: null,
};

export const ProductList: ProductWithImages[] = [
  {
    productId: 1,
    productName: "Produto Teste",
    productPrice: new Decimal(99.9),
    stock: 10,
    productDescription: null,
    isFeatured: false,
    categoryId: null,
    images: [],
  },
  {
    productId: 2,
    productName: "Mouse Gamer",
    productPrice: new Decimal(150),
    stock: 5,
    productDescription: null,
    isFeatured: false,
    categoryId: null,
    images: [],
  },
  {
    productId: 3,
    productName: "Teclado Mecânico",
    productPrice: new Decimal(300),
    stock: 3,
    productDescription: null,
    isFeatured: false,
    categoryId: null,
    images: [],
  },
];

export const ProductListJson = [
  {
    productId: 1,
    productName: "Produto Teste",
    productPrice: "99.9",
    stock: 10,
  },
  { productId: 2, productName: "Mouse Gamer", productPrice: "150", stock: 5 },
  {
    productId: 3,
    productName: "Teclado Mecânico",
    productPrice: "300",
    stock: 3,
  },
];
