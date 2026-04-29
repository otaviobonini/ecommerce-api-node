export type CreateCartDTO = {
  userId: number;
};

export type CreateCartItemDTO = {
  cartId: number;
  productId: number;
  quantity: number;
};
