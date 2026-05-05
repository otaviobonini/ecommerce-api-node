import z from "zod";

export const CreateAddressSchema = z.object({
  userId: z.number(),
  street: z.string().max(255),
  city: z.string().max(100),
  state: z.string().max(100),
  zipCode: z.string().max(20),
  isDefault: z.boolean().default(false),
});

export const EditAddressSchema = CreateAddressSchema.partial();

export const AddressIdParamSchema = z.object({
  addressId: z
    .string()
    .regex(/^\d+$/, "addressId must be a number")
    .transform(Number),
});

export type EditAddressInput = z.infer<typeof EditAddressSchema>;
export type CreateAddressInput = z.infer<typeof CreateAddressSchema>;
export type AddressIdParamInput = z.infer<typeof AddressIdParamSchema>;
