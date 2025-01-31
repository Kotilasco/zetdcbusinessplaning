import NextAuth, { type DefaultSession, type JWT } from "next-auth";

export enum UserRoles {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_USER = 'ROLE_USER',
  ROLE_DISTRICTMANAGER = 'ROLE_DISTRICTMANAGER',
  ROLE_GENERALMANAGER = 'ROLE_GENERALMANAGER',
  ROLE_MANAGINGDIRECTOR = 'ROLE_MANAGINGDIRECTOR',
  ROLE_STORESCLERK = 'ROLE_STORESCLERK',
  ROLE_PROJECTENGINEER = 'ROLE_PROJECTENGINEER',
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
