import { User, RefreshToken } from "@prisma/client";

import {
  CreateUserDTO,
  CreateUserResponse,
  UserWithRelations,
} from "../types/auth.types.js";

export type RefreshTokenWithUser = RefreshToken & { user: User };

export interface IAuthRepository {
  createUser(data: CreateUserDTO): Promise<CreateUserResponse>;

  findUserByEmail(email: string): Promise<User | null>;

  findUserByEmailWithoutPassword(
    email: string,
  ): Promise<CreateUserResponse | null>;

  findUserById(id: number): Promise<UserWithRelations | null>;

  createRefreshToken(data: {
    userId: number;
    token: string;
    expiresAt: Date;
  }): Promise<RefreshToken>;

  findRefreshToken(hashedToken: string): Promise<RefreshTokenWithUser | null>;

  deleteRefreshToken(id: number): Promise<RefreshToken>;

  deleteRefreshTokensByUserId(userId: number): Promise<{ count: number }>;
}
