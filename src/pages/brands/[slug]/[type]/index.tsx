import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/future/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import Breadcrumbs from "src/components/Breadcrumbs";
import Container from "src/components/Container";
import DiscFeaturedItem from "src/components/DiscFeaturedItem";
import Heading from "src/components/Heading";
import Select from "src/components/Select";
import { prisma } from "src/lib/prisma";
import {
  BrandDetails,
  brandSelect,
  DiscDetails,
  discSelect,
} from "src/types/prisma";
import { serializeDisc } from "src/utils/disc";
import { discTypeToString } from "src/utils/discType";

type Props = {
  brand: BrandDetails;
  discs: DiscDetails[];
  type: string;
};

const BrandTypesPage: NextPage<Props> = ({ brand, discs, type }) => {
  const [sort, setSort] = useState<string>("name");

  const sortFn = useMemo<(a: DiscDetails, b: DiscDetails) => number>(() => {
    switch (sort) {
      case "speed-asc":
        return (a, b) => a.speed - b.speed;
      case "speed-desc":
        return (a, b) => b.speed - a.speed;

      case "glide-asc":
        return (a, b) => a.glide - b.glide;
      case "glide-desc":
        return (a, b) => b.glide - a.glide;

      case "turn-asc":
        return (a, b) => a.turn - b.turn;
      case "turn-desc":
        return (a, b) => b.turn - a.turn;

      case "fade-asc":
        return (a, b) => a.fade - b.fade;
      case "fade-desc":
        return (a, b) => b.fade - a.fade;

      case "name":
      default:
        return (a, b) => a.name.localeCompare(b.name);
    }
  }, [sort]);

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
            href: `/brands/${brand.slug}`,
            label: brand.name,
          },
          {
            label: discTypeToString(type),
          },
        ]}
      />

      <Container className="py-4">
        <div className="flex justify-between items-center">
          <Heading className="mb-4">
            {brand.name} ({discTypeToString(type)})
          </Heading>

          <div>
            <Select
              placeholder="Sorter"
              value={sort}
              options={[
                {
                  value: "name",
                  label: "Navn",
                },
                {
                  value: "speed-asc",
                  label: "Speed lav-høy",
                },
                {
                  value: "speed-desc",
                  label: "Speed høy-lav",
                },
                {
                  value: "glide-asc",
                  label: "Glide lav-høy",
                },
                {
                  value: "glide-desc",
                  label: "Glide høy-lav",
                },
                {
                  value: "turn-asc",
                  label: "Turn lav-høy",
                },
                {
                  value: "turn-desc",
                  label: "Turn høy-lav",
                },
                {
                  value: "fade-asc",
                  label: "Fade lav-høy",
                },
                {
                  value: "fade-desc",
                  label: "Fade høy-lav",
                },
              ]}
              onChange={(event) => setSort(event.currentTarget.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
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

  const types = ["putter", "midrage", "fairway", "distance"];
  const paths = types
    .map((type) =>
      brands.map((brand) => ({ params: { slug: brand.slug, type: type } }))
    )
    .flat();

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string | undefined;
  const type = params?.type as string | undefined;

  if (!slug || !type) {
    return {
      notFound: true,
    };
  }

  const brand = await prisma.brand.findFirst({
    where: {
      slug,
    },
    select: brandSelect,
  });

  if (!brand) {
    return {
      notFound: true,
    };
  }

  const discsRaw = await prisma.disc.findMany({
    where: {
      type,
      brandId: brand.id,
    },
    select: discSelect,
  });

  const discs = discsRaw.map(serializeDisc);

  return {
    props: {
      brand,
      discs,
      type,
    },
    revalidate: 60,
  };
};

export default BrandTypesPage;
