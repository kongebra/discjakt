import { TRPCError } from "@trpc/server";
import { middleware } from "./trpc";

export const isAdminMiddleware = middleware(async ({ ctx, next }) => {
  if (!ctx.session || (ctx.session?.role as string).toLowerCase() !== "admin") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

export const isUserMiddleware = middleware(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});
