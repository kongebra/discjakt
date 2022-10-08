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
import axios from "axios";
import DataCleaningProduct from "src/features/dashboard/components/DataCleaningProduct";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const BASE_URL = `${API_URL}/api/data`;

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
