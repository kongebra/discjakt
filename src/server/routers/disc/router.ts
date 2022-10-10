import { TRPCError } from "@trpc/server";

import { router, baseProcedure } from "src/server/trpc";
import { prisma } from "src/lib/prisma";

import {
  createDiscSchema,
  deleteDiscSchema,
  getDiscBySlugSchema,
  searchDiscSchema,
  updateDiscSchema,
} from "./validation";
import { defaultDiscSelect, detailDiscSelect } from "./prismaSelect";
import { isAdminMiddleware } from "src/server/middleware";
import axios from "axios";
import config from "src/config";
import { create, insertBatch, search } from "@lyrasearch/lyra";

export const discRouter = router({
  list: baseProcedure.query(async () => {
    const discs = await prisma.disc.findMany({
      select: defaultDiscSelect,
    });

    return discs;
  }),

  getBySlug: baseProcedure
    .input(getDiscBySlugSchema)
    .query(async ({ input }) => {
      const disc = await prisma.disc.findFirst({
        where: {
          slug: input,
        },
        select: detailDiscSelect,
      });

      if (!disc) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No disc with slug ${input}`,
        });
      }

      return disc;
    }),

  search: baseProcedure
    .input(searchDiscSchema)
    .query(async ({ input, ctx }) => {
      const db = create({
        schema: {
          discId: "number",
          name: "string",
          brandId: "number",
          brand: "string",
        },
      });

      const discs = await prisma.disc.findMany({
        select: {
          id: true,
          name: true,

          brand: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      await insertBatch(
        db,
        discs.map((disc) => {
          return {
            discId: disc.id,
            name: disc.name,
            brandId: disc.brand.id,
            brand: disc.brand.name,
          };
        })
      );

      const searchResult: any = search(db, {
        term: input || "",
        properties: ["name", "brand"],
      });

      // const result = await prisma.disc.findMany({
      //   where: {
      //     id: {
      //       in: searchResult.hits.map()
      //     }
      //   }
      // })

      const { count, hits } = searchResult;

      return { count, hits };
    }),

  create: baseProcedure
    .use(isAdminMiddleware)
    .input(createDiscSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session || ctx.session?.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `You are not allowed to perform this action`,
        });
      }

      const disc = await prisma.disc.create({
        data: {
          ...input,
        },
        select: detailDiscSelect,
      });

      return disc;
    }),

  update: baseProcedure
    .use(isAdminMiddleware)
    .input(updateDiscSchema)
    .mutation(async ({ input: { id, ...rest } }) => {
      const disc = await prisma.disc.update({
        where: {
          id,
        },
        data: { ...rest },
        select: detailDiscSelect,
      });

      if (!disc) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No disc with id ${id}`,
        });
      }

      return disc;
    }),

  delete: baseProcedure
    .use(isAdminMiddleware)
    .input(deleteDiscSchema)
    .mutation(async ({ input }) => {
      const disc = await prisma.disc.delete({
        where: {
          id: input,
        },
      });

      if (!disc) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No disc with id ${input}`,
        });
      }

      return disc;
    }),

  view: baseProcedure
    .input(getDiscBySlugSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.disc.update({
        where: {
          slug: input,
        },
        data: {
          views: {
            increment: 1,
          },
        },
      });
    }),
});
