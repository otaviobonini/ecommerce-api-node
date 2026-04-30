import z from "zod";

export const CreateProductSchema = z.object({
  productName: z.string(),
  productPrice: z.coerce.number().min(0),
  stock: z.coerce.number().min(0),
});

export const EditProductSchema = CreateProductSchema.partial();

export const ProductIdParamSchema = z.object({
  productId: z
    .string()
    .regex(/^\d+$/, "Product id must be a number")
    .transform(Number),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
