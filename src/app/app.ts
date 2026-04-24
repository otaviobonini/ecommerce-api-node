import express from "express";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "../middlewares/errorHandler.js";
import authRoutes from "../modules/auth/auth.routes.js";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(authRoutes);

app.use(errorHandler);
export default app;
