import React, { useState } from "react";
import { useBoolean } from "usehooks-ts";

import { Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import CreateDiscDrawer from "src/features/dashboard/drawers/CreateDiscDrawer";
import SelectDiscDrawer from "src/features/dashboard/drawers/SelectDiscDrawer";
import DataCleaningProduct from "src/features/dashboard/components/DataCleaningProduct";

import DashboardLayout from "src/layout/DashboardLayout";

import config from "src/config";

const BASE_URL = `${config.apiUrl}/api/data`;

const fetchData = async () => {
  const resp = await fetch(BASE_URL);
  return await resp.json();
};

const DashboardDataCleaingPage = () => {
  const { data } = useQuery<Product[]>(["data-cleaning"], fetchData, {});

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const createModal = useBoolean();
  const selectModal = useBoolean();

  return (
    <>
      <DashboardLayout className="bg-gray-100">
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
