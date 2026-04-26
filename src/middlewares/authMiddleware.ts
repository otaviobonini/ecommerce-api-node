import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../schemas/env.schema.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Invalid token" });
  }
  const auth = authHeader.split(" ");
  if (auth[0] !== "Bearer" || !auth[1]) {
    return res.status(401).json({ error: "Invalid token" });
  }
  try {
    const decoded = jwt.verify(auth[1], env.JWT_SECRET) as JwtPayload;
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
