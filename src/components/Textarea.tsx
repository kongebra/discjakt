import clsx from "clsx";
import React from "react";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {};

const Textarea = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ className, ...rest }, ref) => {
    return (
      <textarea
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

Textarea.displayName = "Textarea";

export default Textarea;
