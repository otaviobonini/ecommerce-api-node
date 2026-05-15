import { Role } from "@prisma/client";
import { Request } from "express";
declare namespace Express {
  interface Request {
    userId?: number;
    userRole?: Role;
  }
}

export interface AuthenticatedRequest extends Request {
  userId: number;
  userRole: Role;
}
