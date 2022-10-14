import type { GetStaticProps, NextPage } from "next";
import { type DiscDetails, discDetailsSelect } from "src/types/prisma";

import { Container, Heading, Section, SimpleProduct } from "src/components";
import { prisma } from "src/lib/prisma";

type Props = {
  trending: DiscDetails[];
  latest: DiscDetails[];
};

const HomePage: NextPage<Props> = ({ trending, latest }) => {
  return (
    <>
      <Section>
        <Container className="text-center mb-8">
          <Heading className="mb-4" aria-label="Populære disker">
            Trendende disker
          </Heading>
          <p className="text-gray-500 mb-8">
            Dette er de diskene som blir sett på mest av våre brukere.
          </p>
        </Container>

        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-4 mb-4 px-8">
          {trending.map((disc) => (
            <SimpleProduct key={disc.id} disc={disc} featured />
          ))}
        </div>
      </Section>

      <hr />

      <Section>
        <Container className="text-center mb-8">
          <Heading as="h2" className="mb-8" aria-label="Sist oppdaterte disckr">
            Sist oppdatert disker
          </Heading>
          <p className="text-gray-500 mb-8">
            Disse diskene er de som sist har hatt en oppdatering på lagerstatus
            eller pris!
          </p>

          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6 lg:gap-4">
            {latest.map((disc) => (
              <SimpleProduct key={disc.id} disc={disc} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const trendingData = await prisma.disc.findMany({
    select: discDetailsSelect,
    orderBy: {
      views: "desc",
    },
    take: 4,
  });

  const latestData = await prisma.product.findMany({
    select: {
      id: true,

      disc: {
        select: discDetailsSelect,
      },
    },
    where: {
      isDisc: true,
    },
    distinct: ["discId"],
    orderBy: {
      updatedAt: "desc",
    },
    take: 24,
  });

  const trendingDiscs = JSON.parse(
    JSON.stringify(trendingData)
  ) as DiscDetails[];

  const latestDiscs = JSON.parse(
    JSON.stringify(latestData.map((product) => product.disc))
  ) as DiscDetails[];

  return {
    props: {
      trending: trendingDiscs || [],
      latest: latestDiscs || [],
    },
    revalidate: 60 * 5,
  };
};

export default HomePage;
