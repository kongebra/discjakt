import clsx from "clsx";
import React from "react";

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
type SpinnerColor =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "white"
  | "black"
  | "sky";

export type SpinnerProps = {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
};

type SpinnerSizeClasses = Record<SpinnerSize, string>;
type SpinnerColorClasses = Record<SpinnerColor, string>;

const spinnerSizeClasses: SpinnerSizeClasses = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const spinnerColorClasses: SpinnerColorClasses = {
  primary: "border-teal-600",
  secondary: "border-gray-200",
  success: "border-green-600",
  danger: "border-red-600",
  warning: "border-yellow-500",
  white: "border-white",
  black: "border-black",
  sky: "border-sky-500",
};

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "primary",
  className,
}) => {
  return (
    <div
      className={clsx(
        "inline-block rounded-full border-2 border-b-transparent border-l-transparent animate-spin-fast",
        spinnerSizeClasses[size],
        spinnerColorClasses[color],
        className
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
