import z from "zod";

export const CreateProductSchema = z.object({
  productName: z.string(),
  productPrice: z.number().min(0),
  stock: z.number().min(0),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
