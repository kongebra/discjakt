import React, { useMemo, useState } from "react";

import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

import {
  Breadcrumbs,
  Container,
  Heading,
  Section,
  SelectDiscSort,
  SimpleProduct,
} from "src/components";

import { useSortDiscs } from "src/hooks";
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
  type: string;
};

const BrandTypesPage: NextPage<Props> = ({ brand, discs, type }) => {
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
            href: `/brands/${brand.slug}`,
            label: brand.name,
          },
          {
            label: discTypeToString(type),
          },
        ]}
      />

      <Section>
        <Container className="flex flex-col lg:flex-row justify-between lg:items-center">
          <Heading className="mb-4 lg:mb-0">
            {brand.name} ({discTypeToString(type)})
          </Heading>
          <div>
            <SelectDiscSort value={sort} onChange={setSort} />
          </div>
        </Container>
      </Section>

      <hr />

      <Section>
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {discs.sort(sortFn).map((disc) => (
              <SimpleProduct key={disc.id} disc={disc} />
            ))}
          </div>
        </Container>
      </Section>
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
    select: brandDetailsSelect,
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
    select: discDetailsSelect,
  });

  const discs = discsRaw.map(serializeDisc);

  return {
    props: {
      brand,
      discs,
      type,
    },
    revalidate: 60 * 5,
  };
};

export default BrandTypesPage;
