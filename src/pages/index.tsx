import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";

import useDiscs from "src/hooks/use-discs";

import Container from "src/components/Container";
import Heading from "src/components/Heading";
import DiscFeaturedItem from "src/components/DiscFeaturedItem";
import DiscFeaturedItemSkeleton from "src/components/DiscFeaturedItemSkeleton";
import config from "src/config";
import { trpc } from "src/utils/trpc";
import { prisma } from "src/lib/prisma";
import { detailDiscSelect } from "src/server/routers/disc/prismaSelect";
import { DiscDetails } from "src/types/trpc";

type Props = {
  discs: DiscDetails[];
};

const HomePage: NextPage<Props> = ({ discs }) => {
  return (
    <Container className="py-6">
      <Heading className="text-center mb-6" aria-label="Populære disker">
        Populære disker
      </Heading>
      <div className="grid md:grid-cols-4 grid-cols-1 gap-4 mb-4">
        {discs?.slice(0, 4).map((disc) => (
          <DiscFeaturedItem key={disc.id} disc={disc} />
        ))}
      </div>

      <div className="grid md:grid-cols-5 grid-cols-1 gap-4">
        {discs?.slice(5, 10).map((disc) => (
          <DiscFeaturedItem key={disc.id} disc={disc} />
        ))}
      </div>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await prisma.disc.findMany({
    select: detailDiscSelect,
    orderBy: {
      views: "desc",
    },
    take: 10,
  });

  const discs = JSON.parse(JSON.stringify(data)) as DiscDetails[];

  return {
    props: {
      discs: discs || [],
    },
    revalidate: 60,
  };
};

export default HomePage;
