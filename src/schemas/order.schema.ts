import { z } from "zod";

export const CreateOrderSchema = z.object({
  addressId: z.coerce.number().int().positive(),
});

export const GetUserOrdersSchema = z.object({
  status: z
    .enum(["PENDING", "PAID", "ONGOING", "DELIVERED", "CANCELLED"])
    .optional(),
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const OrderIdParamSchema = z.object({
  orderId: z
    .string()
    .regex(/^\d+$/, "orderId must be a number")
    .transform(Number),
});

export const GetAllOrdersSchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type GetUserOrdersInput = z.infer<typeof GetUserOrdersSchema>;
export type GetAllOrdersInput = z.infer<typeof GetAllOrdersSchema>;
export type OrderIdParamInput = z.infer<typeof OrderIdParamSchema>;
