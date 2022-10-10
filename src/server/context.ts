import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

import { Session, unstable_getServerSession } from "next-auth";

import { authOptions } from "src/pages/api/auth/[...nextauth]";

import { prisma } from "src/lib/prisma";

import { PrismaClient } from "@prisma/client";
interface CreateContextOptions {
  session: Session | null;
  prisma: PrismaClient;
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions) {
  return { ..._opts };
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts: trpcNext.CreateNextContextOptions
): Promise<Context> {
  const { req, res } = opts;
  // for API-response caching see https://trpc.io/docs/caching
  const session = await unstable_getServerSession(req, res, authOptions);

  return await createContextInner({ session, prisma });
}
