import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  name: string;
  email: string;
  emailVerified: Date;
  password: string;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  location: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
