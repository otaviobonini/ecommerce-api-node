import { User } from "@prisma/client";

import {
  CreateUserDTO,
  CreateUserResponse,
  UserWithRelations,
} from "./auth.types.js";

export interface IAuthRepository {
  createUser(data: CreateUserDTO): Promise<CreateUserResponse>;

  findUserByEmail(email: string): Promise<User | null>;

  findUserByEmailWithoutPassword(
    email: string,
  ): Promise<CreateUserResponse | null>;

  findUserById(id: number): Promise<UserWithRelations | null>;
}
