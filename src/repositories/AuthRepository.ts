import { prisma } from "../database/prisma.js";
import { CreateUserDTO, CreateUserResponse } from "../types/auth.types.js";
import { IAuthRepository } from "../types/IAuthRepository.js";

export class AuthRepository implements IAuthRepository {
  async createUser(data: CreateUserDTO): Promise<CreateUserResponse> {
    const user = await prisma.user.create({
      data: data,
      select: { userId: true, username: true, email: true },
    });
    return user;
  }
  async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }
  async findUserByEmailWithoutPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        userId: true,
        email: true,
        username: true,
      },
    });
    return user;
  }
  async findUserById(id: number) {
    const user = await prisma.user.findUnique({
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
    return user;
  }
}
