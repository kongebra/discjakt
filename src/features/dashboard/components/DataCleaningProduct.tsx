import { Disc, Product } from "@prisma/client";
import React, { useCallback } from "react";
import Button from "src/components/Button";
import Image from "next/future/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useProducts from "src/hooks/use-products";
import useDiscs from "src/hooks/use-discs";

type SearchResult = {
  hits: {
    id: string;
    discId: number;
    name: string;
    brandId: number;
    brand: string;
  }[];
  count: number;
};

type Props = {
  product: Product;

  onClickCreateDisc: (product: Product) => void;
  onClickSelectDisc: (product: Product) => void;
};

const DataCleaningProduct: React.FC<Props> = ({
  product,
  onClickCreateDisc,
  onClickSelectDisc,
}) => {
  const { discs } = useDiscs();
  const {
    mutations: { update: updateProduct },
  } = useProducts();

  const findMatches = useCallback(
    (product: Product) => {
      const titleWords = product.title.toLowerCase().split(" ");

      const extraCheck = (value: string) => {
        if (
          product.title.toLowerCase().includes(value.toLowerCase()) &&
          !titleWords.includes(value)
        ) {
          titleWords.push(value);
        }
      };

      extraCheck("v2");
      extraCheck("swan");

      return discs
        .filter((disc: Disc) => {
          const discNameWords = disc.name.toLowerCase().split(" ");

          return titleWords.some((word) => discNameWords.includes(word));
        })
        .sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          }

          if (a.name < b.name) {
            return -1;
          }

          return 0;
        });
    },
    [discs]
  );

  const onMatchClicked = async (product: Product, discId: number) => {
    const copy = {
      ...product,
      discId,
      isDisc: true,
    };

    await updateProduct.mutateAsync(copy);
  };

  const onNoDiscClicked = async (product: Product) => {
    const copy = {
      ...product,
      isDisc: false,
    };

    await updateProduct.mutateAsync(copy);
  };

  return (
    <div
      key={product.id}
      className="flex justify-between items-center gap-4 p-2 bg-white rounded-lg shadow"
    >
      <div className="flex gap-4">
        <Image
          className="max-w-full h-auto rounded-lg mb-2 aspect-square"
          src={product.imageUrl}
          alt={product.title}
          width={64}
          height={64}
        />

        <div className="flex flex-col justify-between">
          <h3 className="font-xl font-bold">{product.title}</h3>

          <div className="flex gap-1">
            <Button
              size="xs"
              color="success"
              onClick={() => onClickCreateDisc(product)}
              isLoading={updateProduct.isLoading}
            >
              Lag disc
            </Button>

            <Button
              size="xs"
              color="primary"
              onClick={() => onClickSelectDisc(product)}
              isLoading={updateProduct.isLoading}
            >
              Velg disc
            </Button>

            <Button
              size="xs"
              color="danger"
              onClick={async () => {
                await onNoDiscClicked(product);
              }}
              isLoading={updateProduct.isLoading}
            >
              Ikke disc
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-1">
        {findMatches(product).map((disc: Disc) => (
          <Button
            key={disc.id}
            size="xs"
            onClick={async () => {
              await onMatchClicked(product, disc.id);
            }}
            isLoading={updateProduct.isLoading}
          >
            {disc.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DataCleaningProduct;
