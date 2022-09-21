import { useState } from "react";

import type { AppProps, NextWebVitalsMetric } from "next/app";
import Head from "next/head";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import config from "lib/react-query";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme";

import Layout from "layout/Layout";

import "../styles/globals.css";

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
        <ChakraProvider theme={theme}>
          <Head>
            <title>DiscJakt</title>
          </Head>

          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>

        <ReactQueryDevtools />
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default App;
