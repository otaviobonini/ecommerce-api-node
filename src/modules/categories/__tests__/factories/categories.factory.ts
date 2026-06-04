import { Category, Product } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export const newCategoryData: Category = {
  categoryId: 1,
  name: "New Category",
  categoryImage: null,
};

export const updatedCategoryData: Category = {
  categoryId: 1,
  name: "New Category",
  categoryImage: "https://example.com/categories/1/image",
};

export const productDataList: Product[] = [
  {
    productId: 1,
    productName: "Produto Teste",
    productPrice: new Decimal(99.9),
    stock: 10,
    productDescription: null,
    isFeatured: false,
    categoryId: null,
  },
  {
    productId: 2,
    productName: "Mouse Gamer",
    productPrice: new Decimal(150),
    stock: 5,
    productDescription: null,
    isFeatured: false,
    categoryId: null,
  },
  {
    productId: 3,
    productName: "Teclado Mecânico",
    productPrice: new Decimal(300),
    stock: 3,
    productDescription: null,
    isFeatured: false,
    categoryId: null,
  },
  {
    productId: 4,
    productName: "Monitor 27 polegadas",
    productPrice: new Decimal(1200),
    stock: 8,
    productDescription: "Monitor 4K com 144Hz",
    isFeatured: true,
    categoryId: null,
  },
  {
    productId: 5,
    productName: "Headset Sem Fio",
    productPrice: new Decimal(250),
    stock: 12,
    productDescription: "Headset gamer com cancelamento de ruído",
    isFeatured: false,
    categoryId: null,
  },
  {
    productId: 6,
    productName: "Mousepad Grande",
    productPrice: new Decimal(80),
    stock: 20,
    productDescription: "Mousepad XXL com RGB",
    isFeatured: false,
    categoryId: null,
  },
  {
    productId: 7,
    productName: "Webcam 1080p",
    productPrice: new Decimal(200),
    stock: 7,
    productDescription: "Webcam Full HD com microfone integrado",
    isFeatured: true,
    categoryId: null,
  },
  {
    productId: 8,
    productName: "Cadeira Gamer",
    productPrice: new Decimal(1500),
    stock: 4,
    productDescription: "Cadeira ergonômica com ajuste de altura",
    isFeatured: false,
    categoryId: null,
  },
];
