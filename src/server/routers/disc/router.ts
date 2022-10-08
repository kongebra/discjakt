import { TRPCError } from "@trpc/server";

import { t } from "src/server/trpc";
import { prisma } from "src/lib/prisma";

import {
  createDiscSchema,
  deleteDiscSchema,
  getDiscBySlugSchema,
  updateDiscSchema,
} from "./validation";
import { defaultDiscSelect, detailDiscSelect } from "./prismaSelect";
import { isAdminMiddleware } from "src/server/middleware";

export const discRouter = t.router({
  list: t.procedure.query(async () => {
    const discs = await prisma.disc.findMany({
      select: defaultDiscSelect,
    });

    return discs;
  }),

  getBySlug: t.procedure.input(getDiscBySlugSchema).query(async ({ input }) => {
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

  create: t.procedure
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

  update: t.procedure
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

  delete: t.procedure
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
});
