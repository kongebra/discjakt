import { Prisma } from "@prisma/client";

export const defaultDiscSelect = Prisma.validator<Prisma.DiscSelect>()({
  id: true,
  name: true,
  speed: true,
  glide: true,
  turn: true,
  fade: true,
  type: true,
  slug: true,
  imageUrl: true,

  brand: {
    select: {
      id: true,
      name: true,
      description: true,
      url: true,
      imageUrl: true,
      slug: true,
    },
  },

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
});

export const detailDiscSelect = Prisma.validator<Prisma.DiscSelect>()({
  id: true,
  name: true,
  speed: true,
  glide: true,
  turn: true,
  fade: true,
  type: true,
  slug: true,
  imageUrl: true,

  brand: {
    select: {
      id: true,
      name: true,
      description: true,
      url: true,
      imageUrl: true,
      slug: true,
    },
  },

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
});
