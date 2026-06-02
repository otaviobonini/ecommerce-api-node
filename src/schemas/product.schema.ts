import z from "zod";

export const CreateProductSchema = z.object({
  productName: z.string(),
  productPrice: z.coerce.number().positive(),
  stock: z.coerce.number().int().positive(),
  productDescription: z.string().optional(),
  isFeatured: z.boolean().optional(),
  categoryId: z.coerce.number().int().positive().optional().nullable(),
});

export const EditProductSchema = z.object({
  productName: z.string().optional(),
  productPrice: z.coerce.number().positive().optional(),
  productDescription: z.string().optional(),
  stock: z.coerce.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
  categoryId: z.coerce.number().int().positive().optional().nullable(),
});

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
    .optional()
    .default(10),
  offset: z
    .string()
    .regex(/^\d+$/, "Offset must be a number")
    .transform(Number)
    .optional()
    .default(0),
});

export type EditProductInput = z.infer<typeof EditProductSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type GetProductsQueryInput = z.infer<typeof GetProductsQuerySchema>;
