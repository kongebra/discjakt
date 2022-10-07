import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: number | null;
      role?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends Omit<DefaultUser, "id"> {
    id: number;
    role?: string | null;
  }
}
