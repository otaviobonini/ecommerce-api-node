import { redis } from "./redis.js";

export async function invalidateCache(path: string) {
  const keys = await redis.keys(`${path}`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
