import Button from "src/components/Button";
import Container from "src/components/Container";
import Heading from "src/components/Heading";
import PriceHistory from "src/components/PriceHistory";

import { useDiscDetails } from "src/hooks/use-disc-details";
import useStores from "src/hooks/use-stores";

import superjson from "superjson";

import Image from "next/future/image";
import Link from "next/link";
import { useRouter } from "next/router";

import React, { useCallback, useMemo } from "react";
import { discTypeToString } from "src/utils/discType";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextApiRequest,
  NextPage,
} from "next";
import { trpc } from "src/utils/trpc";
import { getQueryStringValue } from "src/utils/query";
import { prisma } from "src/lib/prisma";
import { detailDiscSelect } from "src/server/routers/disc/prismaSelect";
import { DiscDetails } from "src/types/trpc";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const DiscDetailPage: NextPage<Props> = ({ disc }) => {
  const {
    query: { slug },
  } = useRouter();

  const { stores, isLoading } = useStores();
  // const { isLoading } = useDiscDetails(slug as string | undefined);

  const getStoreName = useCallback(
    (id: number) => {
      return stores.find((x) => x.id === id)?.name || "";
    },
    [stores]
  );

  const getStore = useCallback(
    (id: number) => {
      return stores.find((x) => x.id === id);
    },
    [stores]
  );

  if (isLoading) {
    return (
      <Container>
        <Heading>Loading ....</Heading>
      </Container>
    );
  }

  if (!disc) {
    return (
      <Container>
        <Heading>Disc not found</Heading>
      </Container>
    );
  }

  return (
    <>
      <div className="bg-teal-700 text-white py-2">
        <Container>
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href={`/brands/${disc.brand.id}`} passHref>
                <a className="ml-1 text-sm font-medium text-white hover:text-gray-300 md:ml-2">
                  {disc.brand.name}
                </a>
              </Link>
            </li>
            <li className="inline-flex items-center">
              /
              <Link
                href={`/brands/${disc.brand.id}/${disc.type.toLowerCase()}`}
                passHref
              >
                <a className="ml-1 text-sm font-medium text-white hover:text-gray-300 md:ml-2">
                  {discTypeToString(disc.type)}
                </a>
              </Link>
            </li>
            <li className="inline-flex items-center">
              /
              <span className="ml-1 text-sm font-medium text-gray-300 md:ml-2">
                {disc.name}
              </span>
            </li>
          </ol>
        </Container>
      </div>
      <Container className="py-8">
        <div className="flex gap-8">
          <Image
            src={disc.imageUrl}
            alt={disc.name}
            width={512}
            height={512}
            className="max-w-full h-auto"
          />

          <div>
            <Heading>{disc.name}</Heading>
            <Heading as="h2">{disc.brand.name}</Heading>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Heading as="h2">Priser</Heading>

          {disc.products.map((product: any) => {
            const price = product.prices.length
              ? product.prices.slice(-1)[0]
              : undefined;

            return (
              <div
                key={product.id}
                className="bg-zinc-200 p-4 rounded-lg flex items-center justify-between"
              >
                <div className="flex gap-4">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    width={128}
                    height={128}
                    className="max-w-full h-auto rounded-md"
                  />

                  <div className="flex flex-col justify-between">
                    <span className="text-xl font-semibold">
                      {product.title}
                    </span>
                    <a
                      className="text-teal-700 underline hover:no-underline"
                      href={`${getStore(product.storeId)?.baseUrl}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {getStoreName(product.storeId)}
                    </a>
                  </div>
                </div>

                {price ? (
                  <Button
                    as="a"
                    href={product.loc}
                    target="_blank"
                    rel="noreferrer"
                    disabled={price.amount === 0}
                  >
                    {`${price.amount.toFixed(0)} ${price.currency}`}
                  </Button>
                ) : (
                  <Button disabled>Ikke på lager</Button>
                )}
              </div>
            );
          })}
        </div>

        {/* <div className="flex-1 flex flex-col">
        <div className="flex justify-between">
          <span>Prishistorikk</span>

          <span>Nå {disc.lowestPrice},-</span>
        </div>

        <div>
          <PriceHistory
            data={disc.products
              .map((product) =>
                product.prices.map((price) => ({
                  ...price,
                  storeName: getStoreName(product.storeId),
                }))
              )
              .flat()}
          />
        </div>
      </div> */}
      </Container>
    </>
  );
};

type ServerProps = {
  disc: DiscDetails;
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async ({
  query,
}) => {
  const slug = getQueryStringValue("slug", { query });
  if (!slug) {
    return {
      notFound: true,
    };
  }

  const data = await prisma.disc.update({
    where: {
      slug,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    select: detailDiscSelect,
  });

  const disc = JSON.parse(JSON.stringify(data));

  return {
    props: {
      disc,
    },
  };
};

export default DiscDetailPage;
