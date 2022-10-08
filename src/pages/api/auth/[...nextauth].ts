import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";

import Auth0Provider from "next-auth/providers/auth0";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "src/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID || "",
      clientSecret: process.env.AUTH0_CLIENT_SECRET || "",
      issuer: process.env.AUTH0_ISSUER,
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
