import { Prisma } from "@prisma/client";

export const defaultProductSelect = Prisma.validator<Prisma.ProductSelect>()({
  id: true,
  loc: true,
  lastmod: true,
  title: true,
  description: true,
  imageUrl: true,
  isDisc: true,
  storeId: true,
});

export const detailProductSelect = Prisma.validator<Prisma.ProductSelect>()({
  id: true,
  loc: true,
  lastmod: true,
  title: true,
  description: true,
  imageUrl: true,
  isDisc: true,

  store: {
    select: {
      id: true,
      name: true,
      baseUrl: true,
      sitemapUrl: true,
      slug: true,
    },
  },

  prices: {
    select: {
      amount: true,
      currency: true,
      createdAt: true,
    },
  },
});
