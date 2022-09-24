import { Brand } from "@prisma/client";
import Button from "components/Button";
import FormFileUpload from "components/FormFileUpload";
import FormInput from "components/FormInput";
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
      console.log({ brands });
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

      <FormInput label="Beskrivelse" {...form.register("description")} />

      <FormFileUpload
        label="Bilde"
        onFileUploaded={(url) => {
          form.setValue("imageUrl", url);
        }}
      />

      <FormInput
        label="Hjemmeside"
        {...form.register("url", {
          required: "Feltet er påkrevd",
        })}
      />

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
