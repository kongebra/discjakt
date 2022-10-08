import { Prisma } from "@prisma/client";

export const defaultBrandSelect = Prisma.validator<Prisma.BrandSelect>()({
  id: true,
  name: true,
  description: true,
  url: true,
  imageUrl: true,
  slug: true,
});

export const detailBrandSelect = Prisma.validator<Prisma.BrandSelect>()({
  id: true,
  name: true,
  description: true,
  url: true,
  imageUrl: true,
  slug: true,

  discs: {
    select: {
      id: true,
      name: true,
      speed: true,
      glide: true,
      turn: true,
      fade: true,
      type: true,
      slug: true,

      products: {
        select: {
          id: true,
          loc: true,
          lastmod: true,
          title: true,
          imageUrl: true,

          prices: {
            select: {
              amount: true,
              currency: true,
              createdAt: true,
            },
          },
        },
      },
    },
  },
});
