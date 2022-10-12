import { Brand, Disc } from "@prisma/client";
import clsx from "clsx";
import Button from "src/components/Button";
import FormError from "src/components/FormError";
import FormInput from "src/components/FormInput";
import FormLabel from "src/components/FormLabel";
import FormSelect from "src/components/FormSelect";
import FormTextarea from "src/components/FormTextarea";
import Input from "src/components/Input";
import Select from "src/components/Select";
import Image from "next/future/image";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { DiscDetails } from "src/types/prisma";

type Props = {
  brands: Brand[];

  defaultValues?: DiscDetails;

  onSubmit: (data: Disc) => void;
  onCancel?: () => void;
};

const EditDiscForm: React.FC<Props> = ({
  brands,
  defaultValues,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<Disc>({
    defaultValues: {
      ...defaultValues,
      brandId: defaultValues?.brand.id,
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

  const generateSlug = () => {
    const name = form.getValues("name").toLowerCase().split(" ").join("-");

    form.setValue("slug", name);
  };

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

        <div className="flex flex-col mb-3">
          <FormLabel>Slug</FormLabel>

          <div className="flex">
            <Input
              {...form.register("slug", { required: "Feltet er påkrevd" })}
              className={clsx("rounded-r-none", {
                "ring-2 ring-red-600":
                  form.formState.errors.slug?.message !== undefined,
              })}
            />

            <Button className="rounded-l-none" onClick={generateSlug}>
              Generate
            </Button>
          </div>

          <FormError>{form.formState.errors.slug?.message}</FormError>
        </div>

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
          error={form.formState.errors.brandId?.message}
        />

        <FormInput label="Bilde URL" {...form.register("imageUrl")} />

        <FormSelect
          label="Disc type"
          {...form.register("type", { required: "Feltet er påkrevd" })}
          options={[
            {
              value: "",
              label: "---",
            },
            {
              value: "putter",
              label: "Putt/Approach",
            },
            {
              value: "midrage",
              label: "Midrange",
            },
            {
              value: "fairway",
              label: "Fairway Driver",
            },
            {
              value: "distance",
              label: "Distance Driver",
            },
          ]}
          error={form.formState.errors.type?.message}
        />

        <div className="flex gap-3">
          <div className="flex-1">
            <FormInput
              type="number"
              label="Speed"
              {...form.register("speed", {
                required: "Feltet er påkrevd",
              })}
              step="0.5"
              error={form.formState.errors.speed?.message}
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
              error={form.formState.errors.glide?.message}
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
              error={form.formState.errors.turn?.message}
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
              error={form.formState.errors.fade?.message}
            />
          </div>
        </div>

        <div>
          {defaultValues && (
            <div className="bg-teal-500 p-4 rounded-3xl mb-2">
              <Image
                className="max-w-full h-auto rounded-2xl"
                src={defaultValues?.imageUrl}
                alt={defaultValues?.name}
                width={512}
                height={512}
              />
            </div>
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

export default EditDiscForm;
