import { TRPCError } from "@trpc/server";

import { prisma } from "src/lib/prisma";
import { isAdminMiddleware } from "src/server/middleware";
import { t } from "src/server/trpc";

import { defaultBrandSelect, detailBrandSelect } from "./prismaSelect";
import {
  createBrandSchema,
  deleteBrandSchema,
  getBrandBySlugSchema,
  updateBrandSchema,
} from "./validation";

export const brandRouter = t.router({
  list: t.procedure.query(async () => {
    const brands = await prisma.brand.findMany({
      select: defaultBrandSelect,
    });

    return brands;
  }),

  getBySlug: t.procedure
    .input(getBrandBySlugSchema)
    .query(async ({ input }) => {
      const brand = await prisma.brand.findFirst({
        where: {
          slug: input,
        },
        select: detailBrandSelect,
      });

      if (!brand) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No brand with id ${input}`,
        });
      }

      return brand;
    }),

  create: t.procedure
    .use(isAdminMiddleware)
    .input(createBrandSchema)
    .mutation(async ({ input }) => {
      const brand = await prisma.brand.create({
        data: {
          ...input,
        },
        select: detailBrandSelect,
      });

      return brand;
    }),

  update: t.procedure
    .use(isAdminMiddleware)
    .input(updateBrandSchema)
    .mutation(async ({ input: { id, ...rest } }) => {
      const brand = await prisma.brand.update({
        where: {
          id,
        },
        data: { ...rest },
        select: detailBrandSelect,
      });

      if (!brand) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No brand with id ${id}`,
        });
      }

      return brand;
    }),

  delete: t.procedure
    .use(isAdminMiddleware)
    .input(deleteBrandSchema)
    .mutation(async ({ input }) => {
      const brand = await prisma.brand.delete({
        where: {
          id: input,
        },
      });

      if (!brand) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No brand with id ${input}`,
        });
      }

      return brand;
    }),
});
