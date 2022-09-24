import clsx from "clsx";
import React, { useId, useRef, useState } from "react";
import Button from "./Button";
import FormError from "./FormError";
import FormLabel from "./FormLabel";
import Input from "./Input";
import { FaPlus, FaTimes, FaUpload } from "react-icons/fa";
import Image from "next/future/image";
import { uploadFile } from "lib/storage";

type Props = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
> & {
  label?: React.ReactNode;
  error?: React.ReactNode;

  onFileUploaded?: (url: string) => void;
};

const FormFileUpload = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      error,
      id,
      onInput,
      multiple = false,
      accept = "image/*",
      onFileUploaded,
      ...rest
    },
    ref
  ) => {
    const labelId = useId();
    const errorId = useId();
    const inputId = id ?? labelId;

    const interalRef = useRef<HTMLInputElement>(null);
    const resolvedRef = ref || interalRef;

    const [src, setSrc] = useState("");
    const [file, setFile] = useState<File | undefined>();

    const handleonInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
      onInput?.(e);

      const { files } = e.target;
      if (files && files.length) {
        const file = files[0];
        const url = await uploadFile(file);

        if (url) {
          setFile(file);
          setSrc(url);

          onFileUploaded?.(url);
        }
      }

      // reset input
      e.target.value = "";
    };

    const formatSize = (size: number) => {
      if (size >= 1e9) {
        return `${(size / 1e9).toFixed(2)} GB`;
      }

      if (size >= 1e6) {
        return `${(size / 1e6).toFixed(2)} MB`;
      }

      if (size >= 1e3) {
        return `${(size / 1e3).toFixed(2)} kB`;
      }

      return `${size} B`;
    };

    return (
      <div>
        {label && <FormLabel>{label}</FormLabel>}
        <div className="mt-1 rounded border-dashed border-gray-300 border-2">
          <div className="border-dashed border-gray-300 border-b-2 p-3 flex gap-3">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                if (
                  resolvedRef &&
                  typeof resolvedRef !== "function" &&
                  resolvedRef.current
                ) {
                  resolvedRef.current.click();
                }
              }}
            >
              <FaPlus className="mr-1" />
              Velg fil
            </Button>

            <input
              ref={resolvedRef}
              type="file"
              id={inputId}
              className="sr-only"
              aria-invalid={error ? true : undefined}
              aria-errormessage={errorId}
              onInput={handleonInput}
              multiple={multiple}
              accept={accept}
              {...rest}
            />
          </div>
          <div className="flex p-3">
            {file && src && (
              <div className="flex flex-1 justify-between items-center">
                <div>
                  <Image
                    src={src}
                    alt="Bilde"
                    width={50}
                    height={50}
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>

                <span>{file.name}</span>

                <span>{formatSize(file.size)}</span>

                <Button
                  size="xs"
                  onClick={() => {
                    setSrc("");
                    setFile(undefined);
                  }}
                >
                  <FaTimes />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

FormFileUpload.displayName = "FormFileUpload";

export default FormFileUpload;
