import express from "express";
import helmet from "helmet";
import cors from "cors";
import {
  errorHandler,
  multerErrorHandler,
  prismaErrorHandler,
  stripeErrorHandler,
} from "../middlewares/errorHandler.js";
import authRoutes from "../modules/auth/auth.routes.js";
import meRoutes from "../modules/me/me.routes.js";
import categoriesRoutes from "../modules/categories/categories.routes.js";
import productRoutes from "../modules/products/product.routes.js";
import {
  AddressLimiter,
  CartLimiter,
  OrderLimiter,
  ProductLimiter,
} from "../utils/rateLimit.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../config/swagger.js";
import cartRoutes from "../modules/cart/cart.routes.js";
import addressRoutes from "../modules/address/address.routes.js";
import orderRoutes, { webhookRouter } from "../modules/order/order.routes.js";
import { env } from "../schemas/env.schema.js";
import { healthCheck } from "../modules/health/health.controller.js";
import cookiesParser from "cookie-parser";

const app = express();
// atrás do Caddy (reverse proxy), o Express só vê o IP interno do Docker;
// confiar em exatamente 1 salto faz req.ip vir do X-Forwarded-For real —
// sem isso, o rate limiter põe o mundo inteiro num único balde
app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use("/", webhookRouter);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/health", healthCheck);
app.use(express.json());

app.use(cookiesParser());
app.use("/", authRoutes);
app.use("/", ProductLimiter, productRoutes);
app.use("/", OrderLimiter, orderRoutes);
app.use("/", CartLimiter, cartRoutes);
app.use("/", AddressLimiter, addressRoutes);
app.use("/", ProductLimiter, categoriesRoutes);
app.use("/", meRoutes);

app.use(multerErrorHandler);
app.use(stripeErrorHandler);
app.use(prismaErrorHandler);
app.use(errorHandler);
export default app;
