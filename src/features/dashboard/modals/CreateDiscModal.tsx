import { Disc, Product } from "@prisma/client";
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

const CreateDiscModal: React.FC<Props> = ({ show, onClose, defaultValues }) => {
  const { brands } = useBrands();
  const {
    mutations: { create: createDisc },
  } = useDiscs();
  const {
    mutations: { update: updateProduct },
  } = useProducts();

  const onSubmit = async (data: Disc) => {
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
    <Modal title="Lag ny disc" show={show} onClose={onClose} size="3xl">
      <CreateDiscForm
        brands={brands}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default CreateDiscModal;
