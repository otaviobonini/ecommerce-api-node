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
  REDIS_URL: z.string().url().default("redis://localhost:6379"),
  BUCKET_NAME: z.string().nonempty(),
  BUCKET_REGION: z.string().nonempty(),
  AWS_ACCESS_KEY_ID: z.string().nonempty(),
  AWS_SECRET_ACCESS_KEY: z.string().nonempty(),
  CDN_URl: z.string().nonempty(),
});

export const env = envSchema.parse(process.env);
