import { Prisma } from "@prisma/client";

export type CreateUserDTO = {
  username: string;
  hashedPassword: string;
  email: string;
};

export type CreateUserResponse = {
  userId: number;
  username: string;
  email: string;
};

export type SafeUser = {
  userId: number;
  email: string;
  username: string;
};

export type UserWithRelations = Prisma.UserGetPayload<{
  select: {
    address: true;
    cart: true;
    order: true;
    role: true;
    userId: true;
    username: true;
    email: true;
  };
}>;
