import z from "zod";

export const CreateAddressSchema = z.object({
  userId: z.number(),
  street: z.string().max(255),
  city: z.string().max(100),
  state: z.string().max(100),
  zipCode: z.string().max(20),
  isDefault: z.boolean().default(false),
});

export type CreateAddressInput = z.infer<typeof CreateAddressSchema>;
