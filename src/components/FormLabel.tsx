import clsx from "clsx";
import React from "react";

type Props = React.LabelHTMLAttributes<HTMLLabelElement> & {};

const FormLabel: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <label className={clsx("font-semibold", className)} {...rest}>
      {children}
    </label>
  );
};

export default FormLabel;
