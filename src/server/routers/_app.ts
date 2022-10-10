import { router } from "src/server/trpc";

import { discRouter } from "./disc/router";
import { brandRouter } from "./brand/router";
import { storeRouter } from "./store/router";
import { productRouter } from "./product/router";

export const appRouter = router({
  disc: discRouter,
  brand: brandRouter,
  store: storeRouter,
  product: productRouter,
});

export type AppRouter = typeof appRouter;
