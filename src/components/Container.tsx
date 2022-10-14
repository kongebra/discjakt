import clsx from "clsx";
import React from "react";

type Props = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement> & {}>;

const Container = React.forwardRef<HTMLDivElement, Props>(
  ({ children, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx("max-w-7xl mx-auto lg:px-0 px-4", className)}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

export default Container;
