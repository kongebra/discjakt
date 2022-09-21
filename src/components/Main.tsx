import clsx from "clsx";
import React from "react";

type Props = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement> & {}>;

const Main: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <main className={clsx("max-w-7xl mx-auto py-5", className)} {...rest}>
      {children}
    </main>
  );
};

export default Main;
