import express from "express";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "../middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use(errorHandler);
export default app;
