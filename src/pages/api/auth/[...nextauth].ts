import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  secret: process.env.NEXT_AUTH_SECRET,

  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role;

      return session;
    },
  },
};

export default NextAuth(authOptions);
