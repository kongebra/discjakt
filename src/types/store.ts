import { Product, Store } from "@prisma/client";

export type StoreDetail = Store & {
  products: Product[];
};
