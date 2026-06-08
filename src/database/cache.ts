import { redis } from "./redis.js";

export async function invalidateCache(pattern: string) {
  let cursor = 0;
  // need to declare cursor first
  do {
    // destruct the objects
    const [nextCursor, keys] = await redis.scan(
      cursor,
      "MATCH",
      pattern,
      "COUNT",
      100,
    );
    cursor = Number(nextCursor); // now we redefine the cursor

    if (keys.length > 0) {
      // if keys return something related to the pattern we delete it
      await redis.del(...keys);
    }
  } while (cursor !== 0);
}
