export type CreateUserDTO = {
  username: string;
  hashedPassword: string;
  email: string;
};

export type CreateUserReponse = {
  userId: number;
  username: string;
  email: string;
};
