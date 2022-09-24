import clsx from "clsx";
import React from "react";

type Props = React.HTMLAttributes<HTMLSpanElement> & {};

const FormError: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <span
      className={clsx("text-red-600 font-semibold text-sm", className)}
      {...rest}
    >
      {children}
    </span>
  );
};

export default FormError;
