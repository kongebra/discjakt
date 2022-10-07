import { Disc, Product } from "@prisma/client";
import Autocomplete from "src/components/Autocomplete";
import Button from "src/components/Button";
import Drawer from "src/components/Drawer";
import FormSelect from "src/components/FormSelect";
import useBrands from "src/hooks/use-brands";
import useDiscs, { DiscDetails } from "src/hooks/use-discs";
import useProducts from "src/hooks/use-products";
import React, { useMemo, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { debounce } from "src/utils/debounce";

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

  const [selectedDisc, setSelectedDisc] = useState<Disc | undefined>();
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce(value, 200);

  const filteredDiscs = useMemo(() => {
    if (value) {
      return discs.filter(
        (x) =>
          x.name.toLowerCase().includes(value.toLowerCase()) ||
          x.brand.name.toLowerCase().includes(value.toLowerCase())
      );
    }

    return discs;
  }, [discs, value]);

  const onSubmit = async () => {
    if (defaultValues && selectedDisc) {
      await updateProduct.mutateAsync({
        ...defaultValues,
        discId: selectedDisc.id,
      });

      onClose();
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  return (
    <Drawer
      title="Velg en disc"
      show={show}
      onClose={onClose}
      size="sm"
      className="flex flex-col justify-between"
    >
      <Autocomplete<DiscDetails>
        items={filteredDiscs}
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
