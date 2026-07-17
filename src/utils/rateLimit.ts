import rateLimit from "express-rate-limit";

export const AuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  handler: (req, res) => {
    res.status(429).json({
      message: "Muitas tentativas de login. Tente novamente em alguns minutos.",
    });
  },
});

export const RefreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  handler: (req, res) => {
    res.status(429).json({
      message: "Muitas tentativas de login. Tente novamente em alguns minutos.",
    });
  },
});

export const ProductLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 70, // Limit each IP to 70 requests per `window` (here, per 10 minutes)
  handler: (req, res) => {
    res.status(429).json({
      message: "Muitas solicitações. Tente novamente em alguns minutos.",
    });
  },
});

export const CartLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 70,
  handler: (req, res) => {
    res.status(429).json({
      message: "Muitas solicitações. Tente novamente em alguns minutos.",
    });
  },
});

export const OrderLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20,
  handler: (req, res) => {
    res.status(429).json({
      message: "Muitas solicitações. Tente novamente em alguns minutos.",
    });
  },
});
export const AddressLimiter = ProductLimiter;
