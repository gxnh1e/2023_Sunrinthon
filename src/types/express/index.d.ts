declare global {
  namespace Express {
    export interface User extends ExtendUser { }
  }
}

export interface ExtendUser {
  email: string[{ value: string, verified: boolean }];
  username: { familyName: string, givenName: string };
  id?: string;
}