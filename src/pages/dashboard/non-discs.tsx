import React, { useMemo } from "react";
import useProducts from "src/hooks/use-products";
import DashboardLayout from "src/layout/DashboardLayout";

import Image from "next/future/image";
import Button from "src/components/Button";
import { Product, ProductPrice } from "@prisma/client";

const NonDiscs = () => {
  const {
    products,
    mutations: { update: updateProduct },
  } = useProducts();

  const filteredProducts = useMemo(
    () => products.filter((x) => x.isDisc === false),
    [products]
  );

  const handleReset = async (product: Product & { prices: ProductPrice[] }) => {
    const { prices, ...rest } = product;
    const copy = {
      ...rest,
      isDisc: null,
    };

    await updateProduct.mutateAsync(copy);
  };

  return (
    <>
      <DashboardLayout className="bg-gray-100">
        <div className="grid grid-cols-1 gap-3">
          {filteredProducts.map((product) => (
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
                      color="danger"
                      onClick={() => handleReset(product)}
                    >
                      Reset isDisc
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DashboardLayout>
    </>
  );
};

export default NonDiscs;
