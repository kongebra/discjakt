import { initTRPC } from "@trpc/server";

import superjson from "superjson";

import { brandRouter } from "./brand/router";
import { discRouter } from "./disc/router";
import { productRouter } from "./product/router";
import { storeRouter } from "./store/router";

const t = initTRPC.create({
  transformer: superjson,
});

export const appRouter = t.router({
  brand: brandRouter,
  disc: discRouter,
  product: productRouter,
  store: storeRouter,
});

export type AppRouter = typeof appRouter;
