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
