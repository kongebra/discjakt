import clsx from "clsx";
import React from "react";

type Props = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement> & {}>;

const Container: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <div
      className={clsx("max-w-7xl mx-auto lg:px-0 px-4", className)}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Container;
