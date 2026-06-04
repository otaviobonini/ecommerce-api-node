import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(50),
});

export const CategoryIdParamSchema = z.object({
  categoryId: z
    .string()
    .regex(/^\d+$/, "categoryId must be a number")
    .transform(Number),
});

export const GetProductsSchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
