import { Request, Response } from "express";
import { prisma } from "../../database/prisma.js";
import { AppError } from "../../common/AppError.js";

export async function getUserDetails(req: Request, res: Response) {
  const userId = req.userId;
  const user = await prisma.user.findUnique({
    where: { userId },
    select: {
      userId: true,
      email: true,
      username: true,
      address: true,
      order: true,
    },
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  return res.status(200).json(user);
}
