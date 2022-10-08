import { GetInferenceHelpers, initTRPC } from "@trpc/server";

import superjson from "superjson";

import { Context } from "./context";
import { AppRouter } from "./routers/_app";

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export type InferProcedures = GetInferenceHelpers<AppRouter>;
