export type UserCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  expiresIn: number;
};
