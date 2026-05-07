import { Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../schemas/env.schema.js";
import { AppError } from "../common/AppError.js";

export const authMiddleware = (req: Request, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new AppError(401, "Authorization header is missing"));
  }
  const auth = authHeader.split(" ");
  if (auth[0] !== "Bearer" || !auth[1]) {
    return next(new AppError(401, "Invalid token"));
  }
  try {
    const decoded = jwt.verify(auth[1], env.JWT_SECRET) as JwtPayload;
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return next(new AppError(401, "Invalid token"));
  }
};
