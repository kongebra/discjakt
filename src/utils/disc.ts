import { DiscDetails } from "src/types/prisma";

export const serializeDisc = (disc: DiscDetails) => {
  return {
    ...disc,
    products: disc.products.map((product) => ({
      ...product,
      prices: product.prices.map((price) => ({
        ...price,
        createdAt: price.createdAt.toISOString(),
      })),
    })),
  };
};
