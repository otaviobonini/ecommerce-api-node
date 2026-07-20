import rateLimit from "express-rate-limit";
import { RedisStore, type RedisReply } from "rate-limit-redis";
import { redis } from "../database/redis.js";

// prefixo próprio por limiter: sem isso, todo mundo usa o mesmo "rl:" default
// e um hit no AuthLimiter e outro no ProductLimiter do mesmo IP colidiriam
// na mesma chave do Redis.
function createRedisStore(prefix: string) {
  return new RedisStore({
    prefix,
    sendCommand: (...args: string[]) =>
      redis.call(...(args as [string, ...string[]])) as Promise<RedisReply>,
  });
}

export const AuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  store: createRedisStore("rl:auth:"),
  handler: (req, res) => {
    res.status(429).json({
      message: "Muitas tentativas de login. Tente novamente em alguns minutos.",
    });
  },
});

export const RefreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  store: createRedisStore("rl:refresh:"),
  handler: (req, res) => {
    res.status(429).json({
      message: "Muitas tentativas de login. Tente novamente em alguns minutos.",
    });
  },
});

export const ProductLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 70, // Limit each IP to 70 requests per `window` (here, per 10 minutes)
  store: createRedisStore("rl:product:"),
  handler: (req, res) => {
    res.status(429).json({
      message: "Muitas solicitações. Tente novamente em alguns minutos.",
    });
  },
});

export const CartLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 70,
  store: createRedisStore("rl:cart:"),
  handler: (req, res) => {
    res.status(429).json({
      message: "Muitas solicitações. Tente novamente em alguns minutos.",
    });
  },
});

export const AdminSessionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 40,
  store: createRedisStore("rl:admin-session:"),
  handler: (req, res) => {
    res.status(429).json({
      message: "Muitas solicitações. Tente novamente em alguns minutos.",
    });
  },
});


export const OrderLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20,
  store: createRedisStore("rl:order:"),
  handler: (req, res) => {
    res.status(429).json({
      message: "Muitas solicitações. Tente novamente em alguns minutos.",
    });
  },
});
export const AddressLimiter = ProductLimiter;
