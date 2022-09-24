import clsx from "clsx";
import React from "react";

export type SelectOption = {
  value: string | number;
  label: React.ReactNode;
};

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: SelectOption[];
};

const Select = React.forwardRef<HTMLSelectElement, Props>(
  ({ className, options, ...rest }, ref) => {
    return (
      <select
        ref={ref}
        className={clsx(
          "block w-full rounded border-slate-300 sm:text-sm text-base shadow-sm",
          className
        )}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = "Select";

export default Select;
