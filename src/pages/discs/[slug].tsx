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
import { DiscDetails, discDetailsSelect } from "src/types/prisma";
import Breadcrumbs from "src/components/Breadcrumbs";
import { serializeDisc } from "src/utils/disc";
import { Section } from "src/components";
import clsx from "clsx";

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

      <Section>
        <Container className="flex flex-col items-center gap-4">
          <div className="text-center">
            <Heading as="h1" className="font-black">
              {disc.name}
            </Heading>
            <Heading as="h2">{disc.brand.name}</Heading>
          </div>

          <div className="p-4">
            <Image
              src={disc.imageUrl}
              alt={disc.name}
              width={512}
              height={512}
              className="max-w-full h-auto rounded"
            />
          </div>
        </Container>
      </Section>

      <hr />

      <Section>
        <Container>
          <div className="text-center mb-8">
            <Heading as="h2" className="text-center">
              Priser
            </Heading>

            <p className="text-gray-500">Her ser du en oversikt på</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {allProducts.map((product) => {
              const price = [...product.prices].pop();
              const storeName = getStoreName(product.storeId);
              const inStock = price && price.amount !== 0;

              return (
                <a
                  key={product.id}
                  href={product.loc}
                  target="_blank"
                  rel="noreferrer"
                  className="group"
                  title={product.title}
                >
                  <div className="flex flex-col items-center">
                    <div className="relative bg-white rounded-md border-4 mb-4 group-hover:ring-4 transition p-2">
                      <Image
                        src={
                          product.imageUrl
                            ? product.imageUrl
                            : "/placeholder.png"
                        }
                        alt={product.title}
                        width={512}
                        height={512}
                        className="max-w-full h-auto rounded group-hover:opacity-75 transition aspect-square object-contain"
                      />
                    </div>

                    <div className="flex flex-col items-center">
                      <span
                        className="font-light text-gray-500"
                        aria-label={storeName}
                        title={storeName}
                      >
                        {storeName}
                      </span>
                      <span
                        className="font-semibold text-lg group-hover:underline transition"
                        aria-label={product.title}
                        title={product.title}
                      >
                        {product.title}
                      </span>
                    </div>

                    <span
                      title={inStock ? `${price.amount} kr` : "Ikke på lager"}
                      className={clsx({
                        "text-red-700 font-semibold": !inStock,
                      })}
                    >
                      {inStock ? `${price.amount} kr` : "Ikke på lager"}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </Container>
      </Section>
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
    select: discDetailsSelect,
  });

  const disc = serializeDisc(data);

  return {
    props: {
      disc,
    },
    revalidate: 60 * 5, // 5 minutt
  };
};

export default DiscDetailPage;
