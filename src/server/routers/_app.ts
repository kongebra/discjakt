import { initTRPC } from "@trpc/server";

import superjson from "superjson";

import { brandRouter } from "./brand/router";
import { discRouter } from "./disc/router";

const t = initTRPC.create({
  transformer: superjson,
});

export const appRouter = t.router({
  brand: brandRouter,
  disc: discRouter,
});

export type AppRouter = typeof appRouter;
