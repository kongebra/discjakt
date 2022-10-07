import { Disc, Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Button from "src/components/Button";
import Modal from "src/components/Modal";
import CreateDiscDrawer from "src/features/dashboard/drawers/CreateDiscDrawer";
import SelectDiscDrawer from "src/features/dashboard/drawers/SelectDiscDrawer";
import useBrands from "src/hooks/use-brands";
import useDiscs from "src/hooks/use-discs";
import useProducts from "src/hooks/use-products";
import DashboardLayout from "src/layout/DashboardLayout";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";
import { useBoolean } from "usehooks-ts";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const BASE_URL = `${API_URL}/api/data`;

const fetchData = async () => {
  const resp = await fetch(BASE_URL);
  return await resp.json();
};

const DashboardDataCleaingPage = () => {
  const { data } = useQuery<Product[]>(["data-cleaning"], fetchData, {});

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

      return discs.filter((disc: Disc) => {
        const discNameWords = disc.name.toLowerCase().split(" ");

        return titleWords.some((word) => discNameWords.includes(word));
      });
    },
    [discs]
  );

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const createModal = useBoolean();
  const selectModal = useBoolean();

  const onMatchClicked = async (product: Product, disc: Disc) => {
    const copy = {
      ...product,
      discId: disc.id,
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
    <>
      <DashboardLayout className="bg-gray-100">
        <div className="flex flex-col gap-3">
          {data?.map((product) => (
            <div
              key={product.id}
              className="flex gap-1 items-center justify-between p-2 bg-white rounded-lg shadow"
            >
              <div className="flex gap-4">
                <Image
                  className="rounded-lg mb-2"
                  src={product.imageUrl}
                  alt={product.title}
                  layout="fixed"
                  width={64}
                  height={64}
                />

                <div className="flex flex-col justify-between">
                  <h3 className="font-xl font-bold">{product.title}</h3>

                  <div className="flex gap-1">
                    <Button
                      size="xs"
                      color="success"
                      onClick={() => {
                        setSelectedProduct(product);
                        createModal.setTrue();
                      }}
                      isLoading={updateProduct.isLoading}
                    >
                      Lag disc
                    </Button>

                    <Button
                      size="xs"
                      color="primary"
                      onClick={() => {
                        setSelectedProduct(product);
                        selectModal.setTrue();
                      }}
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

              <div className="grid gap-1">
                {findMatches(product).map((disc: Disc) => (
                  <Button
                    key={disc.id}
                    size="xs"
                    onClick={async () => {
                      await onMatchClicked(product, disc);
                    }}
                    isLoading={updateProduct.isLoading}
                  >
                    {disc.name}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DashboardLayout>

      <CreateDiscDrawer
        show={createModal.value}
        onClose={() => {
          setSelectedProduct(undefined);
          createModal.setFalse();
        }}
        defaultValues={selectedProduct}
      />

      <SelectDiscDrawer
        show={selectModal.value}
        onClose={() => {
          setSelectedProduct(undefined);
          selectModal.setFalse();
        }}
        defaultValues={selectedProduct}
      />
    </>
  );
};

export default DashboardDataCleaingPage;
