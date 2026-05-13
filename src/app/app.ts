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
  ProductLimiter,
} from "../utils/rateLimit.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import cartRoutes from "../modules/cart/cart.routes.js";
import addressRoutes from "../modules/address/address.routes.js";
import orderRoutes from "../modules/order/order.routes.js";
import { env } from "../schemas/env.schema.js";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);
app.use("/", AuthLimiter, authRoutes);
app.use("/", ProductLimiter, productRoutes);
app.use("/", orderRoutes);
app.use(authMiddleware);
app.use("/", CartLimiter, cartRoutes);
app.use("/", AddressLimiter, addressRoutes);

app.use(prismaErrorHandler);
app.use(errorHandler);
export default app;
