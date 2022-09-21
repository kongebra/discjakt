import type { GetServerSideProps, NextPage } from "next";

import { signIn, signOut, useSession } from "next-auth/react";

import { Product, Store } from "@prisma/client";
import { prisma } from "lib/prisma";

import useUser from "hooks/use-user";
import Navbar from "layout/Navbar";

import Main from "components/Main";

type Props = {
  stores: (Store & {
    products: Product[];
  })[];
};

const Home: NextPage<Props> = ({ stores }) => {
  const session = useSession();
  const user = useUser();

  return (
    <Main>
      <h1 className="text-xl font-semibold">Hello world</h1>
    </Main>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const data = await prisma.store.findMany({});
    const stores = JSON.parse(JSON.stringify(data));

    return {
      props: {
        stores,
      },
    };
  } catch (ex) {
    console.error(ex);
    return {
      props: {
        stores: [],
      },
    };
  }
};

export default Home;
