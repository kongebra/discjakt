import { Prisma } from "@prisma/client";

export const discWithBrandSelect = Prisma.validator<Prisma.DiscSelect>()({
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
});

export const discDetailsSelect = Prisma.validator<Prisma.DiscSelect>()({
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
      storeId: true,

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

export type DiscWithBrand = Prisma.DiscGetPayload<{
  select: typeof discWithBrandSelect;
}>;
export type DiscDetails = Prisma.DiscGetPayload<{
  select: typeof discDetailsSelect;
}>;

export const storeDetailsSelect = Prisma.validator<Prisma.StoreSelect>()({
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
  select: typeof storeDetailsSelect;
}>;

export const brandDetailsSelect = Prisma.validator<Prisma.BrandSelect>()({
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
  select: typeof brandDetailsSelect;
}>;

export const productDetailsSelect = Prisma.validator<Prisma.ProductSelect>()({
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

  store: {
    select: {
      id: true,
      name: true,
      slug: true,
      baseUrl: true,
      sitemapUrl: true,
    },
  },
});

export type ProductDetails = Prisma.ProductGetPayload<{
  select: typeof productDetailsSelect;
}>;
