import { GetStaticProps, NextPage } from "next";
import Image from "next/future/image";
import Link from "next/link";
import React from "react";
import Breadcrumbs from "src/components/Breadcrumbs";
import Container from "src/components/Container";
import Heading from "src/components/Heading";
import { prisma } from "src/lib/prisma";
import { BrandDetails, brandSelect } from "src/types/prisma";

type Props = {
  brands: BrandDetails[];
};

const BrandsPage: NextPage<Props> = ({ brands }) => {
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
          },
        ]}
      />

      <Container className="py-4">
        <Heading className="mb-4">Merker</Heading>

        <div className="grid grid-cols-4 gap-4">
          {brands
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((brand) => (
              <Link key={brand.id} href={`/brands/${brand.slug}`} passHref>
                <a className="flex flex-col gap-4 rounded-lg bg-zinc-100 p-4 hover:shadow transition group">
                  <Image
                    src={brand.imageUrl ? brand.imageUrl : "/placeholder.png"}
                    alt={brand.name}
                    sizes="100vw"
                    width={1024}
                    height={1024}
                    className="max-w-full h-auto rounded-md aspect-square group-hover:animate-pulse"
                    quality={50}
                  />

                  <div>
                    <h2 className="text-2xl font-semibold group-hover:underline">
                      {brand.name}
                    </h2>
                    <h3 className="text-lg">{brand.discs.length} disker</h3>
                  </div>
                </a>
              </Link>
            ))}
        </div>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const brands = await prisma.brand.findMany({
    select: brandSelect,
  });

  return {
    props: {
      brands,
    },
    revalidate: 60,
  };
};

export default BrandsPage;
