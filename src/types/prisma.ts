import { Prisma } from "@prisma/client";

export const discSelect = Prisma.validator<Prisma.DiscSelect>()({
  id: true,
  name: true,
  description: true,
  imageUrl: true,
  slug: true,
  type: true,

  speed: true,
  glide: true,
  turn: true,
  fade: true,

  views: true,

  brand: {
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      slug: true,
      url: true,
    },
  },

  products: {
    select: {
      id: true,
      loc: true,
      lastmod: true,
      title: true,
      description: true,
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

export type DiscDetails = Prisma.DiscGetPayload<{
  select: typeof discSelect;
}>;

export const storeSelect = Prisma.validator<Prisma.StoreSelect>()({
  id: true,
  name: true,
  slug: true,
  baseUrl: true,
  sitemapUrl: true,

  products: {
    select: {
      id: true,
      loc: true,
      lastmod: true,
      title: true,
      description: true,
      imageUrl: true,
      isDisc: true,

      disc: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
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
    },
  },
});

export type StoreDetails = Prisma.StoreGetPayload<{
  select: typeof storeSelect;
}>;

export const brandSelect = Prisma.validator<Prisma.BrandSelect>()({
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
      description: true,
      imageUrl: true,
      slug: true,
      type: true,

      speed: true,
      glide: true,
      turn: true,
      fade: true,

      views: true,
    },
  },
});

export type BrandDetails = Prisma.BrandGetPayload<{
  select: typeof brandSelect;
}>;
