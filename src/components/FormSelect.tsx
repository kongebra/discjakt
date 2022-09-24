import clsx from "clsx";
import React, { useId } from "react";
import FormError from "./FormError";
import FormLabel from "./FormLabel";
import Select, { SelectOption } from "./Select";

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: React.ReactNode;
  error?: React.ReactNode;

  options: SelectOption[];
};

const FormSelect = React.forwardRef<HTMLSelectElement, Props>(
  ({ label, error, id, ...rest }, ref) => {
    const labelId = useId();
    const errorId = useId();
    const selectId = id ?? labelId;

    return (
      <div className="mb-4">
        {label && <FormLabel htmlFor={selectId}>{label}</FormLabel>}

        <Select
          ref={ref}
          id={selectId}
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

FormSelect.displayName = "FormSelect";

export default FormSelect;
