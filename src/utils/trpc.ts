import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";

import superjson from "superjson";

import { AppRouter } from "src/server/routers/_app";

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,

          headers() {
            if (ctx?.req) {
              const { connection: _connection, ...headers } = ctx.req.headers;

              return {
                ...headers,
                "x-ssr": "1",
              };
            }

            return {};
          },
        }),
      ],

      queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },

  ssr: true,
});
