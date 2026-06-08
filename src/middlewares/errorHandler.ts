import { Request, Response, NextFunction } from "express";
import { AppError } from "../common/AppError.js";
import { Prisma } from "@prisma/client";
import Stripe from "stripe";
import { MulterError } from "multer";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
};

export const stripeErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof Stripe.errors.StripeError) {
    return next(new AppError(502, "Payment provider error"));
  }
  return next(err);
};

export const multerErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(new AppError(400, "File exceeds size limit"));
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return next(new AppError(400, "Unexpected file field"));
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return next(new AppError(400, "Too many files"));
    }
  }
  return next(err);
};

export const prismaErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002"
  ) {
    return next(new AppError(400, "Unique constraint failed..."));
  }
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2025"
  ) {
    return next(new AppError(404, "Record not found"));
  }
  return next(err);
};
