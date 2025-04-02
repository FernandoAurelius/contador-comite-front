import Token from "./Token";

export default interface User {
  name: string;
  email: string;
  password: string;
  token: Token;
}
