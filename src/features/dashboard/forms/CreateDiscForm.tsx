import { Brand, Disc, Product } from "@prisma/client";
import Button from "components/Button";
import FormInput from "components/FormInput";
import FormSelect from "components/FormSelect";
import Input from "components/Input";
import Select from "components/Select";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";

type Props = {
  brands: Brand[];

  defaultValues?: Product;

  onSubmit: (data: Disc) => void;
  onCancel: () => void;
};

const CreateDiscForm: React.FC<Props> = ({
  brands,
  defaultValues,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<Disc>({
    defaultValues: {
      name: defaultValues?.title || "",
      imageUrl: defaultValues?.imageUrl,
      description: defaultValues?.description,

      speed: 0,
      glide: 0,
      turn: 0,
      fade: 0,
    },
  });

  const brandOptions = useMemo(
    () =>
      brands
        .map((brand) => ({ value: brand.id, label: brand.name }))
        .sort((a, b) => {
          if (a.label > b.label) {
            return 1;
          }

          if (a.label < b.label) {
            return -1;
          }

          return 0;
        }),
    [brands]
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormInput
        label="Navn"
        {...form.register("name", { required: "Feltet er påkrevd" })}
        error={form.formState.errors.name?.message}
      />
      <FormInput label="Beskrivelse" {...form.register("description")} />

      <FormSelect
        label="Merke"
        options={brandOptions}
        {...form.register("brandId")}
      />

      <FormInput label="Bilde URL" {...form.register("imageUrl")} />

      <div className="flex gap-3">
        <div className="flex-1">
          <FormInput type="number" label="Speed" {...form.register("speed")} />
        </div>
        <div className="flex-1">
          <FormInput type="number" label="Glide" {...form.register("glide")} />
        </div>
        <div className="flex-1">
          <FormInput type="number" label="Turn" {...form.register("turn")} />
        </div>
        <div className="flex-1">
          <FormInput type="number" label="Fade" {...form.register("fade")} />
        </div>
      </div>

      <div className="flex justify-between pt-3">
        <Button
          type="button"
          variant="outline"
          color="secondary"
          onClick={onCancel}
        >
          Avbryt
        </Button>

        <Button type="submit" isLoading={form.formState.isSubmitting}>
          Lagre
        </Button>
      </div>
    </form>
  );
};

export default CreateDiscForm;
