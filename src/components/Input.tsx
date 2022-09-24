import clsx from "clsx";
import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {};

const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ type = "text", className, ...rest }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={clsx(
          "block w-full rounded border-slate-300 sm:text-sm text-base shadow-sm",
          className
        )}
        {...rest}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
