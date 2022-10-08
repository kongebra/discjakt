import { Prisma } from "@prisma/client";

export const defaultStoreSelect = Prisma.validator<Prisma.StoreSelect>()({
  id: true,
  name: true,
  baseUrl: true,
  slug: true,
});

export const detailStoreSelect = Prisma.validator<Prisma.StoreSelect>()({
  id: true,
  name: true,
  baseUrl: true,
  slug: true,

  products: {
    select: {
      id: true,
      loc: true,
      lastmod: true,
      title: true,
      description: true,
      imageUrl: true,
      isDisc: true,

      prices: {
        select: {
          amount: true,
          currency: true,
          createdAt: true,
        },
      },
    },
  },
});
