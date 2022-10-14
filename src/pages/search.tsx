import React from "react";
import Image from "next/future/image";
import { useRouter } from "next/router";

import { useQuery } from "@tanstack/react-query";

import {
  Container,
  SelectDiscSort,
  Heading,
  Breadcrumbs,
  SimpleProduct,
  Section,
} from "src/components";

import config from "src/config";
import { useSortDiscs } from "src/hooks";
import type { DiscDetails } from "src/types/prisma";
import { getQueryStringValue } from "src/utils/query";

const fetchSearch = async (query?: string) => {
  const url = `${config.baseUrl}/api/discs/search?q=${query || ""}`;
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
      <>
        <Breadcrumbs
          items={[
            {
              label: "Forsiden",
              href: "/",
            },
            {
              label: `Søk: ${query}`,
            },
          ]}
        />

        <Section>
          <Container>
            <Heading className="mb-8">
              Søker etter <em>{query}</em> ...
            </Heading>

            <Image
              src="/illustrations/loading.svg"
              alt="Laster inn"
              width={1024}
              height={1024}
            />
          </Container>
        </Section>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: "Forsiden",
            href: "/",
          },
          {
            label: `Søk: ${query}`,
          },
        ]}
      />

      <Section>
        <Container className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <Heading className="">
              Søkeresultat: <em>{query}</em>
            </Heading>

            <p className="text-gray-700 font-semibold text-lg mb-4 lg:mb-0">
              {data?.length} treff
            </p>
          </div>

          <div>
            <SelectDiscSort value={sort} onChange={setSort} />
          </div>
        </Container>
      </Section>

      <hr />

      <Section>
        <Container>
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.sort(sortFn).map((disc: DiscDetails) => (
              <SimpleProduct key={disc.id} disc={disc} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
};

export default SearchPage;
