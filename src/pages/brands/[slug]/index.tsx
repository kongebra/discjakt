import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/future/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import Breadcrumbs from "src/components/Breadcrumbs";
import Container from "src/components/Container";
import DiscFeaturedItem from "src/components/DiscFeaturedItem";
import Heading from "src/components/Heading";
import Select from "src/components/Select";
import SelectDiscSort from "src/components/SelectDiscSort";
import useSortDiscs from "src/hooks/use-sort-discs";
import { prisma } from "src/lib/prisma";
import {
  BrandDetails,
  brandDetailsSelect,
  DiscDetails,
  discDetailsSelect,
} from "src/types/prisma";
import { serializeDisc } from "src/utils/disc";
import { discTypeToString } from "src/utils/discType";

type Props = {
  brand: BrandDetails;
  discs: DiscDetails[];
};

const BrandDetailsPage: NextPage<Props> = ({ brand, discs }) => {
  const { sort, setSort, sortFn } = useSortDiscs();

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
            label: brand.name,
          },
        ]}
      />

      <Container className="py-4">
        <div className="flex justify-between items-center">
          <Heading className="mb-4">{brand.name}</Heading>

          <div>
            <SelectDiscSort value={sort} onChange={setSort} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {["putter", "midrage", "fairway", "distance"].map((type) => (
            <Link key={type} href={`/brands/${brand.slug}/${type}`} passHref>
              <a className="bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white text-center flex items-center justify-center rounded-md h-32 text-2xl font-semibold">
                {discTypeToString(type)}
              </a>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {discs.sort(sortFn).map((disc) => (
            <DiscFeaturedItem key={disc.id} disc={disc} />
          ))}
        </div>
      </Container>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const brands = await prisma.brand.findMany({
    select: {
      slug: true,
    },
  });

  const paths = brands.map((brand) => ({ params: { slug: brand.slug } }));

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

  const brand = await prisma.brand.findFirst({
    where: {
      slug,
    },
    select: brandDetailsSelect,
  });

  if (!brand) {
    return {
      notFound: true,
    };
  }

  const discsRaw = await prisma.disc.findMany({
    where: {
      brandId: brand.id,
    },
    select: discDetailsSelect,
  });

  const discs = discsRaw.map(serializeDisc);

  return {
    props: {
      brand,
      discs,
    },
    revalidate: 60,
  };
};

export default BrandDetailsPage;
