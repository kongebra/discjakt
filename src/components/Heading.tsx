import clsx from "clsx";
import React from "react";

type HeadingElementType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = React.HTMLAttributes<HTMLElement> & {
  as?: HeadingElementType;
};

type HeadingClasses = Record<HeadingElementType, string>;

const headingClasses: HeadingClasses = {
  h1: "text-3xl lg:text-6xl",
  h2: "text-2xl lg:text-5xl",
  h3: "text-1xl lg:text-4xl",
  h4: "text-xl lg:text-3xl",
  h5: "text-lg lg:text-2xl",
  h6: "text-base lg:text-xl",
};

const Heading: React.FC<Props> = ({
  as = "h1",
  className,
  children,
  ...rest
}) => {
  const Component = as;

  return (
    <Component
      className={clsx(
        headingClasses[as],
        "font-semibold leading-tight",
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Heading;
