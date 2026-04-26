import { CreateUserInput } from "../../../../schemas/auth.schema.js";
import { CreateUserReponse } from "../../../../types/auth.types.js";

export const CreateUserInputData: CreateUserInput = {
  email: "test@gmail.com",
  username: "test",
  password: "password",
};

export const CreatedUser: CreateUserReponse = {
  userId: 1,
  username: "test",
  email: "test@gmail.com",
};
