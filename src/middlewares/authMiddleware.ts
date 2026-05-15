import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../schemas/env.schema.js";
import { AppError } from "../common/AppError.js";
import { JwtPayloadSchema } from "../schemas/auth.schema.js";
import { AuthenticatedRequest } from "../types/authenticatedRequest.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    const { id, role } = JwtPayloadSchema.parse(decoded);
    const authenticatedReq = req as AuthenticatedRequest;
    authenticatedReq.userId = id;
    authenticatedReq.userRole = role;

    next();
  } catch (error) {
    return next(new AppError(401, "Invalid token"));
  }
};
