import type { NextPage } from "next";

import { useSession } from "next-auth/react";

import useUser from "hooks/use-user";

type Props = {};

const Home: NextPage<Props> = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1>Hello world!</h1>
    </div>
  );
};

export default Home;
