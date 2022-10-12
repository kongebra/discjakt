import { Disc, Product } from "@prisma/client";
import Drawer from "src/components/Drawer";
import useBrands from "src/hooks/use-brands";
import useDiscs from "src/hooks/use-discs";
import useProducts from "src/hooks/use-products";
import React from "react";
import CreateDiscForm from "../forms/CreateDiscForm";

type Props = {
  show: boolean;
  onClose: () => void;

  defaultValues?: Product;
};

const CreateDiscDrawer: React.FC<Props> = ({
  show,
  onClose,
  defaultValues,
}) => {
  const { brands } = useBrands();
  const {
    mutations: { create: createDisc },
  } = useDiscs();
  const {
    mutations: { update: updateProduct },
  } = useProducts();

  const onSubmit = async (data: Disc) => {
    const record = {
      ...data,
      name: data.name.trim(),
      description: data.description.trim(),

      speed: Number(data.speed),
      glide: Number(data.glide),
      turn: Number(data.turn),
      fade: Number(data.fade),

      brandId: Number(data.brandId),
    };

    delete (record as any).products;
    delete (record as any).brand;
    delete (record as any).lowestPrice;

    const disc = await createDisc.mutateAsync(record);

    if (defaultValues && disc) {
      await updateProduct.mutateAsync({
        ...defaultValues,
        discId: disc.id,
      });
    }

    onClose();
  };

  return (
    <Drawer
      title="Lag ny disc"
      show={show}
      onClose={onClose}
      size="xl"
      className="flex flex-col"
    >
      <CreateDiscForm
        brands={brands}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />
    </Drawer>
  );
};

export default CreateDiscDrawer;
