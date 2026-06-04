import { prisma } from "../database/prisma.js";
import { User } from "@prisma/client";
import {
  CreateUserDTO,
  CreateUserResponse,
  UserWithRelations,
} from "../types/auth.types.js";
import { IAuthRepository } from "../interfaces/IAuthRepository.js";

export class AuthRepository implements IAuthRepository {
  async createUser(data: CreateUserDTO): Promise<CreateUserResponse> {
    return prisma.user.create({
      data: data,
      select: { userId: true, username: true, email: true },
    });
  }
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }
  async findUserByEmailWithoutPassword(
    email: string,
  ): Promise<CreateUserResponse | null> {
    return prisma.user.findUnique({
      where: { email },
      select: {
        userId: true,
        email: true,
        username: true,
      },
    });
  }
  async findUserById(id: number): Promise<UserWithRelations | null> {
    return prisma.user.findUnique({
      where: { userId: id },
      select: {
        address: true,
        cart: true,
        email: true,
        order: true,
        role: true,
        userId: true,
        username: true,
      },
    });
  }

  //Refresh token methods
  async createRefreshToken(data: {
    userId: number;
    token: string;
    expiresAt: Date;
  }) {
    return prisma.refreshToken.create({ data });
  }

  async findRefreshToken(hashedToken: string) {
    return prisma.refreshToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });
  }

  async deleteRefreshToken(id: number) {
    return prisma.refreshToken.delete({ where: { id } });
  }

  async deleteRefreshTokensByUserId(userId: number) {
    return prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
