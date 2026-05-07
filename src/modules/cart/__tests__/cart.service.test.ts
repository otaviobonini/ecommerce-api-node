import CartService from "../CartService.js";
import { cartObject, userId } from "./factories/cart.factory.js";
import { ProductData } from "../../products/__tests__/factories/makeProduct.factory.js";
import {
  ICartRepository,
  IProductRepository,
} from "../../../types/IRepository.js";

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

const productRepositoryMock: jest.Mocked<IProductRepository> = {
  createProduct: jest.fn(),
  editProduct: jest.fn(),
  deleteProduct: jest.fn(),
  getProducts: jest.fn(),
  findProductById: jest.fn(),
};

describe("Cart Service tests", () => {
  let service: CartService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CartService(cartRepositoryMock, productRepositoryMock);
  });

  describe("createCart", () => {
    test("It should create a cart", async () => {
      cartRepositoryMock.createCart.mockResolvedValue(cartObject);
      const result = await service.createCart(userId);
      expect(result).toBe(cartObject);
    });
  });

  describe("cleanCart", () => {
    test("It should clean a cart", async () => {
      const cartId = 1;

      cartRepositoryMock.findCartById.mockResolvedValue({
        cartId,
        userId,
      } as any);

      cartRepositoryMock.clearCart.mockResolvedValue({ count: 2 } as any);

      const result = await service.cleanCart(cartId, userId);

      expect(cartRepositoryMock.findCartById).toHaveBeenCalledWith(cartId);
      expect(cartRepositoryMock.clearCart).toHaveBeenCalledWith(cartId);
      expect(result).toEqual({ count: 2 });
    });

    test("It should fail to clean cart if does not belong to the user", async () => {
      cartRepositoryMock.findCartById.mockResolvedValue({
        cartId: 1,
        userId: 999,
      } as any);
      const result = service.cleanCart(1, 1);
      await expect(result).rejects.toThrow("Forbidden");
    });

    test("It should fail if cart not found", async () => {
      cartRepositoryMock.findCartById.mockResolvedValue(null);
      const result = service.cleanCart(1, 1);
      await expect(result).rejects.toThrow("Cart not found");
    });
  });

  describe("createCartItem", () => {
    test("It should create a new cart item", async () => {
      const cartId = 1;

      productRepositoryMock.findProductById.mockResolvedValue({
        ...ProductData,
        stock: 10,
      } as any);

      cartRepositoryMock.findCartByUserId.mockResolvedValue({
        cartId,
        userId,
      } as any);

      cartRepositoryMock.findCartItem.mockResolvedValue(null);

      const cartItemMock = {
        cartItemId: 1,
        cartId,
        productId: ProductData.productId,
        quantity: 1,
      };

      cartRepositoryMock.upsertCartItem.mockResolvedValue(cartItemMock as any);

      const result = await service.createCartItem(
        {
          productId: ProductData.productId,
          cartId,
          quantity: 1,
        },
        userId,
      );

      expect(cartRepositoryMock.upsertCartItem).toHaveBeenCalledWith(
        cartId,
        ProductData.productId,
        1,
      );
      expect(result).toEqual(cartItemMock);
    });

    test("It should throw if product not found", async () => {
      productRepositoryMock.findProductById.mockResolvedValue(null);

      await expect(
        service.createCartItem(
          { productId: 1, cartId: 1, quantity: 1 },
          userId,
        ),
      ).rejects.toThrow("Product not found");
    });

    test("It should throw if cart does not belong to user", async () => {
      productRepositoryMock.findProductById.mockResolvedValue(
        ProductData as any,
      );

      cartRepositoryMock.findCartByUserId.mockResolvedValue({
        cartId: 999,
        userId,
      } as any);

      await expect(
        service.createCartItem(
          { productId: 1, cartId: 1, quantity: 1 },
          userId,
        ),
      ).rejects.toThrow("Forbidden");
    });

    test("It should throw if insufficient stock", async () => {
      productRepositoryMock.findProductById.mockResolvedValue({
        ...ProductData,
        stock: 1,
      } as any);

      cartRepositoryMock.findCartByUserId.mockResolvedValue({
        cartId: 1,
        userId,
      } as any);

      cartRepositoryMock.findCartItem.mockResolvedValue({
        quantity: 1,
      } as any);

      await expect(
        service.createCartItem(
          { productId: 1, cartId: 1, quantity: 1 },
          userId,
        ),
      ).rejects.toThrow("Insufficient stock");
    });
  });

  describe("getCart", () => {
    test("It should return the cart for a valid user", async () => {
      cartRepositoryMock.findCartByUserId.mockResolvedValue(cartObject);
      const result = await service.getCart(userId);
      expect(cartRepositoryMock.findCartByUserId).toHaveBeenCalledWith(userId);
      expect(result).toBe(cartObject);
    });

    test("It should return null when user has no cart", async () => {
      cartRepositoryMock.findCartByUserId.mockResolvedValue(null);
      const result = await service.getCart(userId);
      expect(result).toBeNull();
    });
  });

  describe("getCartItem", () => {
    test("It should return cart items for a valid cart and user", async () => {
      const cartId = 1;
      const cartItemsMock = [
        {
          cartItemId: 1,
          cartId,
          productId: 10,
          quantity: 2,
          product: ProductData,
        },
      ];

      cartRepositoryMock.findCartById.mockResolvedValue({
        cartId,
        userId,
      } as any);
      cartRepositoryMock.getCartItems.mockResolvedValue(cartItemsMock as any);

      const result = await service.getCartItem(cartId, userId);

      expect(cartRepositoryMock.findCartById).toHaveBeenCalledWith(cartId);
      expect(cartRepositoryMock.getCartItems).toHaveBeenCalledWith(cartId);
      expect(result).toEqual(cartItemsMock);
    });

    test("It should throw 'Cart not found' when cart does not exist", async () => {
      cartRepositoryMock.findCartById.mockResolvedValue(null);

      await expect(service.getCartItem(1, userId)).rejects.toThrow(
        "Cart not found",
      );
      expect(cartRepositoryMock.getCartItems).not.toHaveBeenCalled();
    });

    test("It should throw 'Forbidden' when cart does not belong to user", async () => {
      cartRepositoryMock.findCartById.mockResolvedValue({
        cartId: 1,
        userId: 999,
      } as any);

      await expect(service.getCartItem(1, userId)).rejects.toThrow("Forbidden");
      expect(cartRepositoryMock.getCartItems).not.toHaveBeenCalled();
    });
  });

  describe("deleteCartItem", () => {
    test("It should delete a cart item successfully", async () => {
      const cartItemId = 1;
      const cartId = 1;

      cartRepositoryMock.findCartItemById.mockResolvedValue({
        cartItemId,
        cartId,
        productId: 10,
        quantity: 1,
      } as any);

      cartRepositoryMock.findCartById.mockResolvedValue({
        cartId,
        userId,
      } as any);
      cartRepositoryMock.deleteCartItem.mockResolvedValue({
        cartItemId,
      } as any);

      const result = await service.deleteCartItem(cartItemId, userId);

      expect(cartRepositoryMock.findCartItemById).toHaveBeenCalledWith(
        cartItemId,
      );
      expect(cartRepositoryMock.findCartById).toHaveBeenCalledWith(cartId);
      expect(cartRepositoryMock.deleteCartItem).toHaveBeenCalledWith(
        cartItemId,
      );
      expect(result).toEqual({ cartItemId });
    });

    test("It should throw 'Cart item not found' when item does not exist", async () => {
      cartRepositoryMock.findCartItemById.mockResolvedValue(null);

      await expect(service.deleteCartItem(1, userId)).rejects.toThrow(
        "Cart item not found",
      );
      expect(cartRepositoryMock.findCartById).not.toHaveBeenCalled();
      expect(cartRepositoryMock.deleteCartItem).not.toHaveBeenCalled();
    });

    test("It should throw 'Forbidden' when cart does not belong to user", async () => {
      cartRepositoryMock.findCartItemById.mockResolvedValue({
        cartItemId: 1,
        cartId: 1,
        productId: 10,
        quantity: 1,
      } as any);

      cartRepositoryMock.findCartById.mockResolvedValue({
        cartId: 1,
        userId: 999,
      } as any);

      await expect(service.deleteCartItem(1, userId)).rejects.toThrow(
        "Forbidden",
      );
      expect(cartRepositoryMock.deleteCartItem).not.toHaveBeenCalled();
    });

    test("It should throw 'Forbidden' when cart is not found during delete", async () => {
      cartRepositoryMock.findCartItemById.mockResolvedValue({
        cartItemId: 1,
        cartId: 1,
        productId: 10,
        quantity: 1,
      } as any);

      cartRepositoryMock.findCartById.mockResolvedValue(null);

      await expect(service.deleteCartItem(1, userId)).rejects.toThrow(
        "Forbidden",
      );
      expect(cartRepositoryMock.deleteCartItem).not.toHaveBeenCalled();
    });
  });

  describe("cartQuantityItem", () => {
    test("It should update the cart item quantity successfully", async () => {
      const cartItemId = 1;
      const cartId = 1;
      const newQuantity = 3;

      cartRepositoryMock.findCartItemById.mockResolvedValue({
        cartItemId,
        cartId,
        productId: ProductData.productId,
        quantity: 1,
      } as any);

      productRepositoryMock.findProductById.mockResolvedValue({
        ...ProductData,
        stock: 10,
      } as any);

      cartRepositoryMock.findCartById.mockResolvedValue({
        cartId,
        userId,
      } as any);

      const updatedItem = {
        cartItemId,
        cartId,
        productId: ProductData.productId,
        quantity: newQuantity,
      };
      cartRepositoryMock.updateCartItemQuantity.mockResolvedValue(
        updatedItem as any,
      );

      const result = await service.cartQuantityItem(
        cartItemId,
        newQuantity,
        userId,
      );

      expect(cartRepositoryMock.findCartItemById).toHaveBeenCalledWith(
        cartItemId,
      );
      expect(productRepositoryMock.findProductById).toHaveBeenCalledWith(
        ProductData.productId,
      );
      expect(cartRepositoryMock.findCartById).toHaveBeenCalledWith(cartId);
      expect(cartRepositoryMock.updateCartItemQuantity).toHaveBeenCalledWith(
        cartItemId,
        newQuantity,
      );
      expect(result).toEqual(updatedItem);
    });

    test("It should throw 'Cart item not found' when item does not exist", async () => {
      cartRepositoryMock.findCartItemById.mockResolvedValue(null);

      await expect(service.cartQuantityItem(1, 2, userId)).rejects.toThrow(
        "Cart item not found",
      );
      expect(productRepositoryMock.findProductById).not.toHaveBeenCalled();
    });

    test("It should throw 'Product not found' when product does not exist", async () => {
      cartRepositoryMock.findCartItemById.mockResolvedValue({
        cartItemId: 1,
        cartId: 1,
        productId: 99,
        quantity: 1,
      } as any);

      productRepositoryMock.findProductById.mockResolvedValue(null);

      await expect(service.cartQuantityItem(1, 2, userId)).rejects.toThrow(
        "Product not found",
      );
      expect(cartRepositoryMock.updateCartItemQuantity).not.toHaveBeenCalled();
    });

    test("It should throw 'Insufficient stock' when quantity exceeds stock", async () => {
      cartRepositoryMock.findCartItemById.mockResolvedValue({
        cartItemId: 1,
        cartId: 1,
        productId: ProductData.productId,
        quantity: 1,
      } as any);

      productRepositoryMock.findProductById.mockResolvedValue({
        ...ProductData,
        stock: 2,
      } as any);

      await expect(service.cartQuantityItem(1, 5, userId)).rejects.toThrow(
        "Insufficient stock",
      );
      expect(cartRepositoryMock.updateCartItemQuantity).not.toHaveBeenCalled();
    });

    test("It should throw 'Forbidden' when cart does not belong to user", async () => {
      cartRepositoryMock.findCartItemById.mockResolvedValue({
        cartItemId: 1,
        cartId: 1,
        productId: ProductData.productId,
        quantity: 1,
      } as any);

      productRepositoryMock.findProductById.mockResolvedValue({
        ...ProductData,
        stock: 10,
      } as any);

      cartRepositoryMock.findCartById.mockResolvedValue({
        cartId: 1,
        userId: 999,
      } as any);

      await expect(service.cartQuantityItem(1, 2, userId)).rejects.toThrow(
        "Forbidden",
      );
      expect(cartRepositoryMock.updateCartItemQuantity).not.toHaveBeenCalled();
    });

    test("It should throw 'Forbidden' when cart is not found during quantity update", async () => {
      cartRepositoryMock.findCartItemById.mockResolvedValue({
        cartItemId: 1,
        cartId: 1,
        productId: ProductData.productId,
        quantity: 1,
      } as any);

      productRepositoryMock.findProductById.mockResolvedValue({
        ...ProductData,
        stock: 10,
      } as any);

      cartRepositoryMock.findCartById.mockResolvedValue(null);

      await expect(service.cartQuantityItem(1, 2, userId)).rejects.toThrow(
        "Forbidden",
      );
      expect(cartRepositoryMock.updateCartItemQuantity).not.toHaveBeenCalled();
    });
  });
});
