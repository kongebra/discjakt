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

  secret: "HBm3/JcDRRtmQKXzzM17oS/jZJEyJmyR3PEDKdCg6b4=",

  callbacks: {
    session({ session, user, token }) {
      session.user.id = user.id;
      session.user.role = user.role;

      return session;
    },
  },
};

export default NextAuth(authOptions);
