import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID || "",
      clientSecret: process.env.AUTH0_CLIENT_SECRET || "",
      issuer: process.env.AUTH0_ISSUER || "",
    }),
  ],

  secret: "HBm3/JcDRRtmQKXzzM17oS/jZJEyJmyR3PEDKdCg6b4=",

  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;

      return session;
    },
  },
};

export default NextAuth(authOptions);
