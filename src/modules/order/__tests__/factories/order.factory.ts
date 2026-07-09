import {
  Address,
  Cart,
  CartItem,
  Prisma,
  Product,
  ProductImage,
  Role,
} from "@prisma/client";

export const AddressData: Address = {
  addressId: 1,
  userId: 1,
  street: "test street",
  city: "Criciúma",
  state: "SC",
  zipCode: "88200-000",
  isDefault: true,
};

export const CartData: Cart = {
  cartId: 1,
  userId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCartItems: (CartItem & { product: Product })[] = [
  {
    cartItemId: 1,
    cartId: 1,
    productId: 1,
    quantity: 2,
    product: {
      productId: 1,
      productName: "Test Product",
      productPrice: new Prisma.Decimal(100),
      stock: 10,
      productDescription: null,
      isFeatured: false,
      categoryId: null,
    },
  },
  {
    cartItemId: 2,
    cartId: 1,
    productId: 2,
    quantity: 1,
    product: {
      productId: 2,
      productName: "Premium Product",
      productPrice: new Prisma.Decimal(250.5),
      stock: 5,
      productDescription: null,
      isFeatured: false,
      categoryId: null,
    },
  },
  {
    cartItemId: 3,
    cartId: 1,
    productId: 3,
    quantity: 3,
    product: {
      productId: 3,
      productName: "Budget Product",
      productPrice: new Prisma.Decimal(49.99),
      stock: 20,
      productDescription: null,
      isFeatured: false,
      categoryId: null,
    },
  },
  {
    cartItemId: 4,
    cartId: 1,
    productId: 4,
    quantity: 1,
    product: {
      productId: 4,
      productName: "Deluxe Product",
      productPrice: new Prisma.Decimal(500),
      stock: 3,
      productDescription: null,
      isFeatured: false,
      categoryId: null,
    },
  },
];

export const mockPaymentResponse = {
  paymentLink: "https://checkout.stripe.com/pay/cs_test_123456789",
  sessionId: "cs_test_123456789",
};

export const mockOrderWithItems = {
  orderId: 1,
  userId: 1,
  addressId: 1,
  total: new Prisma.Decimal(1299.95),
  status: "PENDING" as const,
  paymentLink: "https://checkout.stripe.com/pay/cs_test_123456789",
  createdAt: new Date(),
  updatedAt: new Date(),

  user: {
    userId: 1,
    username: "Test User",
    email: "test@example.com",
    hashedPassword: "hashed-password",
    role: Role.USER,
  },

  address: AddressData,

  orderItems: mockCartItems.map((item, index) => ({
    orderItemId: index + 1,
    orderId: 1,
    productId: item.productId,
    quantity: item.quantity,
    priceAtTime: item.product.productPrice,

    product: {
      ...item.product,
      category: null,
      images: [] as ProductImage[],
    },
  })),
};
