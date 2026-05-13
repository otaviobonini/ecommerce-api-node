import z from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(2, "User name must be at least 2 characters long")
    .max(120, "User name must be at most 120 characters long"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(120, "Password must be at most 120 characters long"),
});

export const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(120, "Password must be at most 120 characters long"),
});

export const JwtPayloadSchema = z.object({
  id: z.number().int().positive(),
  role: z.enum(["USER", "ADMIN"]),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type LoginUserInput = z.infer<typeof LoginUserSchema>;
