import { Brand, Disc, Product } from "@prisma/client";
import Button from "src/components/Button";
import FormInput from "src/components/FormInput";
import FormSelect from "src/components/FormSelect";
import FormTextarea from "src/components/FormTextarea";
import Input from "src/components/Input";
import Select from "src/components/Select";
import Image from "next/future/image";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";

type Props = {
  brands: Brand[];

  defaultValues?: Product;

  onSubmit: (data: Disc) => void;
  onCancel?: () => void;
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
    () => [
      {
        value: "",
        label: "---",
      },
      ...brands
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
    ],
    [brands]
  );

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex-1 flex flex-col justify-between min-h-full"
    >
      <div>
        <FormInput
          label="Navn"
          {...form.register("name", { required: "Feltet er påkrevd" })}
          error={form.formState.errors.name?.message}
        />
        <FormTextarea
          label="Beskrivelse"
          {...form.register("description")}
          rows={5}
        />

        <FormSelect
          label="Merke"
          options={brandOptions}
          {...form.register("brandId", {
            required: "Feltet er påkrevd",
          })}
        />

        <FormInput label="Bilde URL" {...form.register("imageUrl")} />

        <div className="flex gap-3">
          <div className="flex-1">
            <FormInput
              type="number"
              label="Speed"
              {...form.register("speed", {
                required: "Feltet er påkrevd",
              })}
              step="0.5"
            />
          </div>
          <div className="flex-1">
            <FormInput
              type="number"
              label="Glide"
              {...form.register("glide", {
                required: "Feltet er påkrevd",
              })}
              step="0.5"
            />
          </div>
          <div className="flex-1">
            <FormInput
              type="number"
              label="Turn"
              {...form.register("turn", {
                required: "Feltet er påkrevd",
              })}
              step="0.5"
            />
          </div>
          <div className="flex-1">
            <FormInput
              type="number"
              label="Fade"
              {...form.register("fade", {
                required: "Feltet er påkrevd",
              })}
              step="0.5"
            />
          </div>
        </div>

        <div>
          {defaultValues && (
            <Image
              className="max-w-full h-auto rounded-lg mb-2"
              src={defaultValues?.imageUrl}
              alt={defaultValues?.title}
              width={512}
              height={512}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between pt-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            color="secondary"
            onClick={onCancel}
          >
            Avbryt
          </Button>
        )}

        <Button type="submit" isLoading={form.formState.isSubmitting}>
          Lagre
        </Button>
      </div>
    </form>
  );
};

export default CreateDiscForm;
