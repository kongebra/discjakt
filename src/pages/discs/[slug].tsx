import Button from "src/components/Button";
import Container from "src/components/Container";
import Heading from "src/components/Heading";

import useStores from "src/hooks/use-stores";

import Image from "next/future/image";
import Link from "next/link";
import { useRouter } from "next/router";

import React, { useCallback, useMemo } from "react";
import { discTypeToString } from "src/utils/discType";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { prisma } from "src/lib/prisma";
import { FaHeart } from "react-icons/fa";
import { DiscDetails, discSelect } from "src/types/prisma";
import Breadcrumbs from "src/components/Breadcrumbs";
import { serializeDisc } from "src/utils/disc";

type Props = {
  disc: DiscDetails;
};

const DiscDetailPage: NextPage<Props> = ({ disc }) => {
  const {
    query: { slug },
  } = useRouter();

  const { stores, isLoading } = useStores();

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

  const allProducts = useMemo(() => {
    return disc.products
      .map((product) => ({
        ...product,
        latestPrice: product.prices.length
          ? product.prices[product.prices.length - 1]
          : undefined,
      }))
      .sort((a, b) => {
        if (a.latestPrice && b.latestPrice) {
          if (a.latestPrice?.amount === 0) {
            return 1;
          }

          if (b.latestPrice.amount === 0) {
            return -1;
          }

          return a.latestPrice.amount - b.latestPrice.amount;
        }

        if (a.latestPrice && !b.latestPrice) {
          return -1;
        }

        if (!a.latestPrice && b.latestPrice) {
          return 1;
        }

        return 0;
      });
  }, [disc.products]);

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
      <Breadcrumbs
        items={[
          {
            label: "Forsiden",
            href: "/",
          },
          {
            label: "Merker",
            href: "/brands",
          },
          {
            href: `/brands/${disc.brand.slug}`,
            label: disc.brand.name,
          },
          {
            href: `/brands/${disc.brand.slug}/${disc.type.toLowerCase()}`,
            label: discTypeToString(disc.type),
          },
          {
            label: disc.name,
          },
        ]}
      />

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

            <Button color="danger" onClick={async () => {}}>
              <FaHeart className="mr-2" />
              Favoritt
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Heading as="h2">Priser</Heading>

          {allProducts.map((product) => {
            const price = product.latestPrice;

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

export const getStaticPaths: GetStaticPaths = async () => {
  const discs = await prisma.disc.findMany({
    select: {
      slug: true,
    },
  });

  const paths = discs.map((disc) => ({ params: { slug: disc.slug } }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string | undefined;
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
    select: discSelect,
  });

  const disc = serializeDisc(data);

  return {
    props: {
      disc,
    },
    revalidate: 60,
  };
};

export default DiscDetailPage;
