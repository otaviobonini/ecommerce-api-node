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

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use("/", AuthLimiter, authRoutes);
app.use(authMiddleware);
app.use("/", ProductLimiter, productRoutes);
app.use("/", CartLimiter, cartRoutes);
app.use("/", AddressLimiter, addressRoutes);

app.use(prismaErrorHandler);
app.use(errorHandler);
export default app;
