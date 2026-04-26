import z from "zod";

const envSchema = z.object({
  PORT: z.number(),
  JWT_SECRET: z.string().nonempty(),
  DATABASE_URL: z.string().nonempty(),
});

export const env = envSchema.parse(process.env);
