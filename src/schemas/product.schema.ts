import z from "zod";

export const CreateProductSchema = z.object({
  productName: z.string(),
  productPrice: z.coerce.number().int().positive(),
  stock: z.coerce.number().int().positive(),
});

export const EditProductSchema = CreateProductSchema.partial();

export const ProductIdParamSchema = z.object({
  productId: z
    .string()
    .regex(/^\d+$/, "Product id must be a number")
    .transform(Number),
});

export const GetProductsQuerySchema = z.object({
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a number")
    .transform(Number)
    .optional(),
  offset: z
    .string()
    .regex(/^\d+$/, "Offset must be a number")
    .transform(Number)
    .optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
