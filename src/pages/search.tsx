import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";
import Container from "src/components/Container";
import DiscFeaturedItem from "src/components/DiscFeaturedItem";
import Heading from "src/components/Heading";
import Input from "src/components/Input";
import SelectDiscSort from "src/components/SelectDiscSort";
import config from "src/config";
import useSortDiscs from "src/hooks/use-sort-discs";
import { DiscDetails } from "src/types/prisma";
import { getQueryStringValue } from "src/utils/query";

const fetchSearch = async (query?: string) => {
  const url = `${config.apiUrl}/api/discs/search?q=${query || ""}`;
  const response = await fetch(url);
  const data = await response.json();

  return data as DiscDetails[];
};

const SearchPage = () => {
  const router = useRouter();
  const query = getQueryStringValue("q", { query: router.query });

  const { sort, setSort, sortFn } = useSortDiscs();

  const { data, isLoading } = useQuery(
    ["search", query],
    () => fetchSearch(query),
    {
      enabled: !!query,
    }
  );

  if (isLoading && query) {
    return (
      <Container className="py-4">
        <Heading className="mb-4">Søker ...</Heading>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
        <Heading className="mb-4">Søkeresultat: {query}</Heading>

        <div>
          <SelectDiscSort value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {data?.sort(sortFn).map((disc: DiscDetails) => (
          <DiscFeaturedItem key={disc.id} disc={disc} />
        ))}
      </div>
    </Container>
  );
};

export default SearchPage;
