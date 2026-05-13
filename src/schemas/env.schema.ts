import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().nonempty(),
  DATABASE_URL: z.string().nonempty(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  CLIENT_URL: z.string().nonempty(),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  APP_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
