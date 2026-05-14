import express from "express";
import helmet from "helmet";
import cors from "cors";
import {
  errorHandler,
  prismaErrorHandler,
} from "../middlewares/errorHandler.js";
import authRoutes from "../modules/auth/auth.routes.js";
import productRoutes from "../modules/products/product.routes.js";
import {
  AddressLimiter,
  AuthLimiter,
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

const app = express();
app.use("/", webhookRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use("/health", (req, res) => res.status(200).json({ status: "ok" }));
app.use("/", AuthLimiter, authRoutes);
app.use("/", ProductLimiter, productRoutes);
app.use("/", OrderLimiter, orderRoutes);
app.use("/", CartLimiter, cartRoutes);
app.use("/", AddressLimiter, addressRoutes);

app.use(prismaErrorHandler);
app.use(errorHandler);
export default app;
