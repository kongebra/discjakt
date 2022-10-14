import { GetStaticProps, NextPage } from "next";
import Image from "next/future/image";
import Link from "next/link";
import React from "react";
import { Breadcrumbs, Container, Heading, Section } from "src/components";
import { prisma } from "src/lib/prisma";
import { StoreDetails, storeDetailsSelect } from "src/types/prisma";

type Props = {
  stores: StoreDetails[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const stores = await prisma.store.findMany({
    select: storeDetailsSelect,
  });

  return {
    props: {
      stores: JSON.parse(JSON.stringify(stores)) || [],
    },
    revalidate: 60 * 10, // 10 minutter
  };
};

const StoreIndex: NextPage<Props> = ({ stores }) => {
  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: "Forsiden",
            href: "/",
          },
          {
            label: "Nettbutikker",
          },
        ]}
      />

      <Section>
        <Container className="text-center">
          <Heading className="mb-8 font-bold">Nettbutikker</Heading>

          <p className="text-gray-500 mb-8">
            Her ser du en liste over nettbutikker som vi samler data fra, hvor
            du kan finne din favoritt disk til best mulig pris!
            <br />
            Eller bare sjekke om de har den disken du vil ha på lager!
          </p>
        </Container>
      </Section>

      <hr />

      <Section>
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stores.map((store) => {
              const discCount = store.products.filter(
                (product) => product.disc
              ).length;

              return (
                <Link key={store.id} href={`/stores/${store.slug}`} passHref>
                  <a className="group" title={store.name}>
                    <div className="flex flex-col items-center">
                      <Image
                        src={"/placeholder.png"} //  TODO: Få inn bilde
                        alt={store.name}
                        width={512}
                        height={512}
                        className="max-w-full h-auto rounded-md border-4 mb-4 group-hover:ring-4 aspect-square object-contain"
                      />

                      <div className="flex flex-col items-center">
                        <span
                          className="font-light text-gray-500"
                          aria-label={store.baseUrl}
                        >
                          {store.baseUrl}
                        </span>
                        <span
                          className="font-semibold text-lg group-hover:underline"
                          aria-label={store.name}
                        >
                          {store.name}
                        </span>
                      </div>

                      <span>{`${discCount} disker`}</span>
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
};

export default StoreIndex;
