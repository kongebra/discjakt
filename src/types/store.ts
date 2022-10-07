import { Product, ProductPrice, Store } from "@prisma/client";

export type StoreDetail = Store & {
  products: (Product & {
    prices: ProductPrice[];
  })[];
};
