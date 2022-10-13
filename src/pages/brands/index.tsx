import { GetStaticProps, NextPage } from "next";
import Image from "next/future/image";
import Link from "next/link";
import React from "react";
import Breadcrumbs from "src/components/Breadcrumbs";
import Container from "src/components/Container";
import Heading from "src/components/Heading";
import { prisma } from "src/lib/prisma";
import { BrandDetails, brandDetailsSelect } from "src/types/prisma";

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

      <section className="py-16">
        <Container className="text-center">
          <Heading className="mb-8 font-bold">Merker</Heading>
          <p className="text-gray-500">
            Her er en oversikt over alle merkene som det finnes disker
            tilgjengelig på markedet.
          </p>
        </Container>
      </section>

      <hr />

      <section className="py-16">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {brands
              .filter((brand) => brand.discs.length > 0)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((brand) => (
                <Link key={brand.id} href={`/brands/${brand.slug}`} passHref>
                  <a className="group" title={brand.name}>
                    <div className="flex flex-col items-center">
                      <Image
                        src={
                          brand.imageUrl ? brand.imageUrl : "/placeholder.png"
                        }
                        alt={brand.name}
                        width={512}
                        height={512}
                        className="max-w-full h-auto rounded-md border-4 mb-4 group-hover:ring-4"
                      />

                      <div className="flex flex-col items-center">
                        {/* <span
                          className="font-light text-gray-500"
                          aria-label={brand.brand.name}
                        >
                          {brand.brand.name}
                        </span> */}
                        <span
                          className="font-semibold text-lg group-hover:underline"
                          aria-label={brand.name}
                        >
                          {brand.name}
                        </span>
                      </div>

                      <span>{`${brand.discs.length} disker`}</span>
                    </div>
                  </a>
                </Link>
              ))}
          </div>
        </Container>
      </section>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const brands = await prisma.brand.findMany({
    select: brandDetailsSelect,
  });

  return {
    props: {
      brands,
    },
    revalidate: 60,
  };
};

export default BrandsPage;
