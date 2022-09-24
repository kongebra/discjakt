import clsx from "clsx";
import React, { useId } from "react";
import FormError from "./FormError";
import FormLabel from "./FormLabel";
import Input from "./Input";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: React.ReactNode;
  error?: React.ReactNode;
};

const FormInput = React.forwardRef<HTMLInputElement, Props>(
  ({ label, error, id, ...rest }, ref) => {
    const labelId = useId();
    const errorId = useId();
    const inputId = id ?? labelId;

    return (
      <div className="mb-4">
        {label && <FormLabel htmlFor={inputId}>{label}</FormLabel>}

        <Input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-errormessage={errorId}
          className={clsx({
            "mt-1": label !== undefined,
            "ring-2 ring-red-600": error !== undefined,
          })}
          {...rest}
        />

        {error && <FormError id={errorId}>{error}</FormError>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
