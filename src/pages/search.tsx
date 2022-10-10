import { useRouter } from "next/router";
import React from "react";
import Container from "src/components/Container";
import DiscFeaturedItem from "src/components/DiscFeaturedItem";
import Heading from "src/components/Heading";
import { DiscDetails } from "src/types/trpc";
import { getQueryStringValue } from "src/utils/query";
import { trpc } from "src/utils/trpc";

const SearchPage = () => {
  const router = useRouter();
  const query = getQueryStringValue("q", { query: router.query });

  const { data, isLoading } = trpc.disc.search.useQuery(query);

  if (isLoading) {
    return (
      <Container>
        <Heading>Søker ...</Heading>
      </Container>
    );
  }

  return (
    <Container>
      <Heading>Søk: {query}</Heading>

      <div className="grid grid-cols-4 gap-4">
        {data?.hits?.map((disc: DiscDetails) => (
          <DiscFeaturedItem key={disc.id} disc={disc} />
        ))}
      </div>
    </Container>
  );
};

export default SearchPage;
