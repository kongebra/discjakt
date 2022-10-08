import { TRPCError } from "@trpc/server";

import { t } from "src/server/trpc";

import { defaultProductSelect, detailProductSelect } from "./prismaSelect";
import { getProductByIdSchema, updateProductSchema } from "./validation";

export const productRouter = t.router({
  list: t.procedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany({
      select: defaultProductSelect,
    });

    return products;
  }),

  getById: t.procedure
    .input(getProductByIdSchema)
    .query(async ({ input, ctx }) => {
      const product = await ctx.prisma.product.findFirst({
        where: {
          id: input,
        },
        select: detailProductSelect,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No product with id ${input}`,
        });
      }

      return product;
    }),

  getUnlinkedProducts: t.procedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany({
      where: {
        disc: null,
        isDisc: null,
      },
      select: defaultProductSelect,
    });

    return products;
  }),

  update: t.procedure
    .input(updateProductSchema)
    .mutation(async ({ input: { id, ...data }, ctx }) => {
      const product = await ctx.prisma.product.update({
        where: {
          id,
        },
        data,
      });

      return product;
    }),
});
