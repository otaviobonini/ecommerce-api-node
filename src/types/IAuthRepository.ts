import { User } from "@prisma/client";

import {
  CreateUserDTO,
  CreateUserResponse,
  SafeUser,
  UserWithRelations,
} from "./auth.types.js";

export interface IAuthRepository {
  createUser(data: CreateUserDTO): Promise<CreateUserResponse>;

  findUserByEmail(email: string): Promise<User | null>;

  findUserByEmailWithoutPassword(email: string): Promise<SafeUser | null>;

  findUserById(id: number): Promise<UserWithRelations | null>;
}
