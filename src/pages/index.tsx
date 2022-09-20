import type { GetServerSideProps, NextPage } from "next";

import { signIn, signOut, useSession } from "next-auth/react";

import { Product, Store } from "@prisma/client";
import { prisma } from "lib/prisma";

import useUser from "hooks/use-user";

type Props = {
  stores: (Store & {
    products: Product[];
  })[];
};

const Home: NextPage<Props> = ({ stores }) => {
  const session = useSession();
  const user = useUser();

  return (
    <div className="container mx-auto">
      <h1 className="text-xl font-semibold">Hello world</h1>

      {!session.data && (
        <button
          type="button"
          className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4"
          onClick={() => signIn("auth0")}
        >
          Sign in
        </button>
      )}

      {session.data && (
        <button
          type="button"
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      )}

      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const data = await prisma.store.findMany({
    include: {
      products: true,
    },
  });
  const stores = JSON.parse(JSON.stringify(data));

  return {
    props: {
      stores,
    },
  };
};

export default Home;
