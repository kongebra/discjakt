import { Brand } from "@prisma/client";
import Button from "src/components/Button";
import FormInput from "src/components/FormInput";
import FormTextarea from "src/components/FormTextarea";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";

type Props = {
  brands: Brand[];
  defaultValues?: Brand;

  onSubmit: (data: Brand) => void;
  onCancel: () => void;
};

const CreateBrandForm: React.FC<Props> = ({
  brands,
  defaultValues,
  onCancel,
  onSubmit,
}) => {
  const form = useForm<Brand>({ defaultValues });

  const isNameInUse = useCallback(
    (name: string) => {
      const names = brands.map((x) => x.name.toLowerCase());

      return names.includes(name.toLowerCase());
    },
    [brands]
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormInput
        label="Navn"
        {...form.register("name", {
          required: "Feltet er påkrevd",
          validate: {
            uniqueName: (value) => {
              if (isNameInUse(value)) {
                return "Dette merket finnes allerede";
              }

              return true;
            },
          },
        })}
      />

      <FormTextarea
        label="Beskrivelse"
        {...form.register("description")}
        rows={3}
      />

      <FormInput label="Bilde" {...form.register("imageUrl")} />

      <FormInput label="Hjemmeside" {...form.register("url")} />

      <div className="flex justify-between pt-3">
        <Button
          type="button"
          variant="outline"
          color="secondary"
          onClick={onCancel}
        >
          Avbryt
        </Button>

        <Button type="submit">Lagre</Button>
      </div>
    </form>
  );
};

export default CreateBrandForm;
