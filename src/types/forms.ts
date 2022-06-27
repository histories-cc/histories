export interface ILoginFormInput {
  login: string;
  password: string;
}

export interface IRegisterFormInput {
  username: string;
  firstName: string;
  lastName?: string;
  googleId?: string;
  password: string;
  email: string;
}
