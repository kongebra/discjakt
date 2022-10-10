import { TRPCError } from "@trpc/server";
import { isAdminMiddleware } from "src/server/middleware";
import { router, baseProcedure } from "src/server/trpc";

import { defaultStoreSelect, detailStoreSelect } from "./prismaSelect";
import { createStoreSchema, getStoreBySlugSchema } from "./validation";

export const storeRouter = router({
  list: baseProcedure.query(async ({ ctx }) => {
    const stores = await ctx.prisma.store.findMany({
      select: defaultStoreSelect,
    });

    return stores;
  }),

  getBySlug: baseProcedure
    .input(getStoreBySlugSchema)
    .query(async ({ ctx, input }) => {
      const store = await ctx.prisma.store.findFirst({
        where: {
          slug: input,
        },
        select: detailStoreSelect,
      });

      if (!store) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No store with slug ${input}`,
        });
      }

      return store;
    }),

  create: baseProcedure
    .use(isAdminMiddleware)
    .input(createStoreSchema)
    .mutation(async ({ ctx, input }) => {
      const store = await ctx.prisma.store.create({
        data: input,
      });

      return store;
    }),
});
