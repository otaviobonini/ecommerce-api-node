import { z } from "zod";

export const CartIdParamSchema = z.object({
  cartId: z
    .string()
    .regex(/^\d+$/, "cartId must be a number")
    .transform(Number),
});

export const CartItemIdParamSchema = z.object({
  cartItemId: z
    .string()
    .regex(/^\d+$/, "cartItemId must be a number")
    .transform(Number),
});

export const CreateCartItemSchema = z.object({
  cartId: z.coerce.number().int().positive(),
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
});

export const UpdateCartItemQuantitySchema = z.object({
  quantity: z.coerce.number().int().positive(),
});

export type CreateCartItemInput = z.infer<typeof CreateCartItemSchema>;
