import { TRPCError } from "@trpc/server";
import { t } from "./trpc";

export const isAdminMiddleware = t.middleware(async ({ ctx, next }) => {
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

export const isUserMiddleware = t.middleware(async ({ ctx, next }) => {
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
