import React, { useMemo, useState } from "react";
import { useBoolean } from "usehooks-ts";

import { Product } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import CreateDiscDrawer from "src/features/dashboard/drawers/CreateDiscDrawer";
import SelectDiscDrawer from "src/features/dashboard/drawers/SelectDiscDrawer";
import DataCleaningProduct from "src/features/dashboard/components/DataCleaningProduct";

import DashboardLayout from "src/layout/DashboardLayout";

import config from "src/config";
import Button from "src/components/Button";
import { findMatch } from "src/features/dashboard/utils/find-match";
import useDiscs from "src/hooks/use-discs";
import useProducts from "src/hooks/use-products";

const BASE_URL = `${config.baseUrl}/api/data`;

const fetchData = async () => {
  const resp = await fetch(BASE_URL);
  return await resp.json();
};

const DashboardDataCleaingPage = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery<Product[]>(["data-cleaning"], fetchData, {});

  const { discs } = useDiscs();
  const { mutations } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const createModal = useBoolean();
  const selectModal = useBoolean();

  const allOneMatch = useMemo(() => {
    if (data) {
      return data.every((product) => findMatch(product, discs).length === 1);
    }

    return false;
  }, [data, discs]);

  const superpower = async () => {
    if (data) {
      data.forEach(async (product) => {
        const matches = findMatch(product, discs);

        if (matches.length === 1) {
          const match = matches[0]!;

          const copy = {
            ...product,
            discId: match.id,
            isDisc: true,
          };

          await mutations.update.mutateAsync(copy);
        }
      });
    }
  };

  return (
    <>
      <DashboardLayout className="bg-gray-100">
        <div className="flex justify-end mb-3">
          <Button
            type="button"
            disabled={!allOneMatch || data?.length === 0 || !data}
            onClick={async () => {
              await superpower();
              queryClient.resetQueries(["data-cleaning"]);
            }}
            isLoading={mutations.update.isLoading}
          >
            Superpower!
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {data?.map((product) => (
            <DataCleaningProduct
              key={product.id}
              product={product}
              onClickCreateDisc={(product) => {
                setSelectedProduct(product);
                createModal.setTrue();
              }}
              onClickSelectDisc={(product) => {
                setSelectedProduct(product);
                selectModal.setTrue();
              }}
              globalLoading={mutations.update.isLoading}
            />
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
