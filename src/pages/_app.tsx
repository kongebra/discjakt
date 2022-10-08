import { useState } from "react";

import type { AppProps, NextWebVitalsMetric } from "next/app";
import Head from "next/head";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import config from "src/lib/react-query";

import Layout from "src/layout/Layout";

import "../styles/globals.css";

import { trpc } from "src/utils/trpc";

type AuthAppProps = AppProps<{
  session: Session;
}>;

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AuthAppProps) {
  const [queryClient] = useState(new QueryClient(config));

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>DiscJakt</title>
        </Head>

        <Layout>
          <Component {...pageProps} />
        </Layout>

        <ReactQueryDevtools />
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default trpc.withTRPC(App);
