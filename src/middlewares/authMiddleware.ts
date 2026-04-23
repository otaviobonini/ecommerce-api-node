import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "message" });
  }
  const auth = authHeader.split(" ");
  if (auth[0] !== "Bearer" || !auth[1]) {
    return res.status(401).json({ error: "message" });
  }
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("Undefined JWT_SECRET");
    }
    const decoded = jwt.verify(auth[1], process.env.JWT_SECRET) as JwtPayload;
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
