import { Request, Response, NextFunction } from "express";
import { AppError } from "../common/AppError.js";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.userRole !== "ADMIN") {
    throw new AppError(403, "User do not have permission to access route");
  }
  next();
};
