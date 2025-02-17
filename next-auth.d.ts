import NextAuth, { type DefaultSession, type JWT } from "next-auth";

export enum UserRoles {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_USER = 'ROLE_USER',
  USER = "USER"
}

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRoles;
  firstname: string;
  lastname: string;
  email: string;
  departmentId: string;
  sectionId: string;
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
