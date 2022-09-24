import { Disc, Product } from "@prisma/client";
import Drawer from "components/Drawer";
import Modal from "components/Modal";
import useBrands from "hooks/use-brands";
import useDiscs from "hooks/use-discs";
import useProducts from "hooks/use-products";
import { uploadFile } from "lib/storage";
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
    data.name = data.name.trim();
    data.description = data.description.trim();

    const disc = await createDisc.mutateAsync(data);

    if (defaultValues && disc) {
      await updateProduct.mutateAsync({
        ...defaultValues,
        discId: disc.id,
      });
    }

    onClose();
  };

  return (
    <Drawer title="Lag ny disc" show={show} onClose={onClose} size="lg">
      <CreateDiscForm
        brands={brands}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />
    </Drawer>
  );
};

export default CreateDiscDrawer;
