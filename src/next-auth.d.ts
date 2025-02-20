import NextAuth, { type DefaultSession, type JWT } from "next-auth";

export enum UserRoles {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_USER = 'ROLE_USER',
  ROLE_SENIORMANAGER = 'ROLE_SENIORMANAGER',
  ROLE_SUPERADMIN = 'ROLE_SUPERADMIN',
  ROLE_MANAGER = 'ROLE_MANAGER',
  USER = "USER"
}


export type ExtendedUser = DefaultSession["user"] & {
  role: UserRoles;
  firstname: string;
  lastname: string;
  email: string;
  district: string;
  region: string;
};

export type ExtendedToken = JWT['token'] & {
  access_token: string;
  refresh_token: string;
}
/*  */
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  };

}
