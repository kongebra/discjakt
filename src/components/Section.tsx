import clsx from "clsx";
import React from "react";

type Props = React.HTMLAttributes<HTMLElement> & {};

const Section: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <section className={clsx("py-8 lg:py-16", className)} {...rest}>
      {children}
    </section>
  );
};

export default Section;
