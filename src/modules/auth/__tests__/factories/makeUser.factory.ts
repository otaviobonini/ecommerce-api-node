import { CreateUserInput } from "../../../../schemas/auth.schema.js";
import { CreateUserResponse } from "../../../../types/auth.types.js";

export const CreateUserInputData: CreateUserInput = {
  email: "test@gmail.com",
  username: "test",
  password: "password",
};

export const CreatedUser: CreateUserResponse = {
  userId: 1,
  username: "test",
  email: "test@gmail.com",
};
