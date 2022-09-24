import type { NextPage } from "next";

import { useSession } from "next-auth/react";

import useUser from "hooks/use-user";
import { prisma } from "lib/prisma";

type Props = {};

const HomePage: NextPage<Props> = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1>Hello world!</h1>
    </div>
  );
};

export const getServerSideProps = async () => {
  const items = await prisma.store.findMany();
  const stores = JSON.parse(JSON.stringify(items));

  return {
    props: {
      stores,
    },
  };
};

export default HomePage;
