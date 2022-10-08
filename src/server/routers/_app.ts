import { initTRPC } from "@trpc/server";

import { brandRouter } from "./brand/router";
import { discRouter } from "./disc/router";

const t = initTRPC.create();

export const appRouter = t.router({
  brand: brandRouter,
  disc: discRouter,
});

export type AppRouter = typeof appRouter;
