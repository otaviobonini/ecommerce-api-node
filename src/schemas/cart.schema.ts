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
  cartId: z.coerce.number().min(1),
  productId: z.coerce.number().min(1),
  quantity: z.coerce.number().min(1).default(1),
});

export type CreateCartItemInput = z.infer<typeof CreateCartItemSchema>;
