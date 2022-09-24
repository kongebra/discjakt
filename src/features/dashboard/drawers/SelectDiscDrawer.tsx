import { Product } from "@prisma/client";
import Button from "components/Button";
import Drawer from "components/Drawer";
import FormSelect from "components/FormSelect";
import useBrands from "hooks/use-brands";
import useDiscs from "hooks/use-discs";
import useProducts from "hooks/use-products";
import React, { useMemo, useState } from "react";

type Props = {
  show: boolean;
  onClose: () => void;

  defaultValues?: Product;
};

const SelectDiscDrawer: React.FC<Props> = ({
  show,
  onClose,
  defaultValues,
}) => {
  const { discs } = useDiscs();
  const {
    mutations: { update: updateProduct },
  } = useProducts();

  const [selectedDisc, setSelectedDisc] = useState<string>("");

  const discOptions = useMemo(
    () =>
      discs
        .map((disc) => ({ value: disc.id, label: disc.name }))
        .sort((a, b) => {
          if (a.label > b.label) {
            return 1;
          }

          if (a.label < b.label) {
            return -1;
          }

          return 0;
        }),
    [discs]
  );

  const onSubmit = async () => {
    if (defaultValues && selectedDisc) {
      await updateProduct.mutateAsync({
        ...defaultValues,
        discId: selectedDisc,
      });

      onClose();
    }
  };

  return (
    <Drawer title="Lag ny disc" show={show} onClose={onClose} size="lg">
      <FormSelect
        label="Disker"
        options={discOptions}
        onChange={(e) => setSelectedDisc(e.currentTarget.value)}
      />
      <Button onClick={onSubmit}>Lagre</Button>
    </Drawer>
  );
};

export default SelectDiscDrawer;
