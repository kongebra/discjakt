import { Disc, Product } from "@prisma/client";
import Autocomplete from "components/Autocomplete";
import Button from "components/Button";
import Drawer from "components/Drawer";
import FormSelect from "components/FormSelect";
import useBrands from "hooks/use-brands";
import useDiscs, { DiscDetails } from "hooks/use-discs";
import useProducts from "hooks/use-products";
import React, { useMemo, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { debounce } from "utils/debounce";

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
  const { discs, setFilters } = useDiscs({ delay: 200 });
  const {
    mutations: { update: updateProduct },
  } = useProducts();

  const [selectedDisc, setSelectedDisc] = useState<Disc | undefined>();

  const onSubmit = async () => {
    if (defaultValues && selectedDisc) {
      await updateProduct.mutateAsync({
        ...defaultValues,
        discId: selectedDisc.id,
      });

      onClose();
    }
  };

  const handleOnChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFilters({ name: e.target.value }),
    400
  );

  return (
    <Drawer
      title="Velg en disc"
      show={show}
      onClose={onClose}
      size="sm"
      className="flex flex-col justify-between"
    >
      <Autocomplete<DiscDetails>
        items={discs.rows}
        onChange={handleOnChange}
        getItemKey={(item) => item.id}
        getDisplayValue={(item?) => {
          if (item) {
            return `${item?.name} (${item?.brand?.name})`;
          }

          return "";
        }}
        onItemSelected={setSelectedDisc}
      />

      <div>
        <Button onClick={onSubmit}>Lagre</Button>
      </div>
    </Drawer>
  );
};

export default SelectDiscDrawer;
