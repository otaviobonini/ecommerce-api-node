import rateLimit from "express-rate-limit";

export const AuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message: "Too many login attempts. Try again later.",
});

export const ProductLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 40, // Limit each IP to 40 requests per `window` (here, per 10 minutes)
  message: "Too many requests, please try again later.",
});

export const CartLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 40,
  message: "Too many requests, please try again later.",
});

export const OrderLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20,
  message: "Too many requests, please try again later.",
});
export const AddressLimiter = ProductLimiter;
