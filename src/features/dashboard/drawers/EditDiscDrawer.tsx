import { Disc, Product } from "@prisma/client";
import Drawer from "src/components/Drawer";
import useBrands from "src/hooks/use-brands";
import useDiscs from "src/hooks/use-discs";
import useProducts from "src/hooks/use-products";
import React from "react";
import CreateDiscForm from "../forms/CreateDiscForm";
import EditDiscForm from "../forms/EditDiscForm";
import { DiscDetails } from "src/types/prisma";

type Props = {
  show: boolean;
  onClose: () => void;

  defaultValues?: DiscDetails;
};

const EditDiscDrawer: React.FC<Props> = ({ show, onClose, defaultValues }) => {
  const { brands } = useBrands();
  const { mutations } = useDiscs();

  const onSubmit = async (data: Disc) => {
    if (!defaultValues) {
      return;
    }

    const record = {
      ...data,
      name: data.name.trim(),
      description: data.description.trim(),
    };

    delete (record as any).products;
    delete (record as any).brand;
    delete (record as any).lowestPrice;

    await mutations.update.mutateAsync({ slug: defaultValues?.slug, record });

    onClose();
  };

  return (
    <Drawer
      title="Editer  disc"
      show={show}
      onClose={onClose}
      size="xl"
      className="flex flex-col"
    >
      <EditDiscForm
        brands={brands}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />
    </Drawer>
  );
};

export default EditDiscDrawer;
