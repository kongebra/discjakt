import type { NextPage } from "next";

import useDiscs from "hooks/use-discs";

import Container from "components/Container";
import Heading from "components/Heading";
import DiscFeaturedItem from "components/DiscFeaturedItem";
import DiscFeaturedItemSkeleton from "components/DiscFeaturedItemSkeleton";

type Props = {};

const HomePage: NextPage<Props> = () => {
  const { discs, isLoading } = useDiscs();

  if (isLoading) {
    return (
      <Container className="py-6">
        <Heading className="text-center mb-6">Featured discs</Heading>

        <div className="grid grid-cols-4 gap-4 mb-4">
          {[1, 2, 3, 4].map((item) => (
            <DiscFeaturedItemSkeleton key={item} />
          ))}
        </div>

        <div className="grid grid-cols-5 gap-4 mb-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <DiscFeaturedItemSkeleton key={item} />
          ))}
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-6">
      <Heading className="text-center mb-6">Featured discs</Heading>

      <div className="grid grid-cols-4 gap-4 mb-4">
        {discs.slice(0, 4).map((disc) => (
          <DiscFeaturedItem key={disc.id} disc={disc} />
        ))}
      </div>

      <div className="grid grid-cols-5 gap-4">
        {discs.slice(5, 10).map((disc) => (
          <DiscFeaturedItem key={disc.id} disc={disc} />
        ))}
      </div>
    </Container>
  );
};

export default HomePage;
