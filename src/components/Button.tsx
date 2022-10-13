import clsx from "clsx";
import React, { useMemo } from "react";
import Spinner from "./Spinner";

export type ButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "black"
  | "white"
  | "sky";
export type ButtonVariant = "solid" | "outline" | "ghost" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
} & (
    | ({
        as?: "a";
      } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
    | { as?: React.ElementType; href?: never }
  );

type ButtonClasses = {
  [c in ButtonColor]: {
    [v in ButtonVariant]: string;
  };
};

const buttonDefaultClasses =
  "inline-flex appearance-none justify-center items-center select-none relative whitespace-nowrap align-middle outline outline-transparent outline-2 outline-offset-2 leading-tight rounded-md font-semibold transition focus:ring";

type ButtonSizeClasses = Record<ButtonSize, string>;

const buttonSizeClasses: ButtonSizeClasses = {
  xs: "h-6 min-w-[24px] px-2 text-xs",
  sm: "h-8 min-w-[32px] px-3 text-sm",
  md: "h-10 min-w-[40px] px-4 text-base",
  lg: "h-12 min-w-[48px] px-6 text-lg",
};

const buttonClasses: ButtonClasses = {
  primary: {
    solid:
      "bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white disabled:hover:bg-teal-600",
    outline:
      "border border-teal-600 text-teal-600 hover:bg-teal-50 active:bg-teal-100 disabled:hover:bg-transparent",
    ghost:
      "text-teal-600 hover:bg-teal-50 active:bg-teal-100 disabled:hover:bg-transparent",
    link: "text-teal-500 hover:underline active:text-teal-700 disabled:hover:no-underline",
  },
  secondary: {
    solid:
      "bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-black disabled:hover:bg-gray-200",
    outline:
      "border border-gray-600 text-gray-600 hover:bg-gray-50 active:bg-gray-200 disabled:hover:bg-transparent",
    ghost:
      "text-gray-600 hover:bg-gray-50 active:bg-gray-200 disabled:hover:bg-transparent",
    link: "text-gray-500 hover:underline active:text-gray-700 disabled:hover:no-underline",
  },
  success: {
    solid:
      "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white disabled:hover:bg-green-600",
    outline:
      "border border-green-600 text-green-600 hover:bg-green-50 active:bg-green-100 disabled:hover:bg-transparent",
    ghost:
      "text-green-600 hover:bg-green-50 active:bg-green-100 disabled:hover:bg-transparent",
    link: "text-green-500 hover:underline active:text-green-700 disabled:hover:no-underline",
  },
  danger: {
    solid:
      "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white disabled:hover:bg-red-600",
    outline:
      "border border-red-600 text-red-600 hover:bg-red-50 active:bg-red-100 disabled:hover:bg-transparent",
    ghost:
      "text-red-600 hover:bg-red-50 active:bg-red-100 disabled:hover:bg-transparent",
    link: "text-red-500 hover:underline active:text-red-700 disabled:hover:no-underline",
  },
  warning: {
    solid:
      "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-black disabled:hover:bg-yellow-500",
    outline:
      "border border-yellow-500 text-yellow-500 hover:bg-yellow-50 active:bg-yellow-100 disabled:hover:bg-transparent",
    ghost:
      "text-yellow-500 hover:bg-yellow-50 active:bg-yellow-100 disabled:hover:bg-transparent",
    link: "text-yellow-500 hover:underline active:text-yellow-700 disabled:hover:no-underline",
  },
  black: {
    solid:
      "bg-black hover:bg-gray-900 active:bg-gray-800 text-white disabled:hover:bg-black",
    outline:
      "border border-black text-black hover:bg-gray-50 active:bg-gray-200 disabled:hover:bg-transparent",
    ghost:
      "text-black hover:bg-gray-50 active:bg-gray-200 disabled:hover:bg-transparent",
    link: "text-black hover:underline active:text-gray-700 disabled:hover:no-underline",
  },
  white: {
    solid:
      "bg-white hover:bg-gray-100 active:bg-gray-200 text-black disabled:hover:bg-white",
    outline:
      "border border-white text-white hover:bg-gray-50 hover:text-black active:bg-gray-200 disabled:hover:bg-transparent",
    ghost:
      "text-white hover:bg-gray-50 active:bg-gray-200 hover:text-black disabled:hover:bg-transparent",
    link: "text-white hover:underline active:text-gray-200 disabled:hover:no-underline",
  },
  sky: {
    solid:
      "bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white disabled:hover:bg-sky-600",
    outline:
      "border border-sky-600 text-sky-600 hover:bg-sky-50 active:bg-sky-100 disabled:hover:bg-transparent",
    ghost:
      "text-sky-600 hover:bg-sky-50 active:bg-sky-100 disabled:hover:bg-transparent",
    link: "text-sky-500 hover:underline active:text-sky-700 disabled:hover:no-underline",
  },
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      color = "primary",
      variant = "solid",
      size = "md",
      type = "button",
      className,
      disabled,
      isLoading,
      children,
      as = "button",
      ...rest
    },
    ref
  ) => {
    const spinnerColor = useMemo(() => {
      if (variant === "solid") {
        if (color === "secondary" || color === "white") {
          return "black";
        }

        return "white";
      }

      return color;
    }, [color, variant]);

    const Component = as || "button";
    const resolvedType = as === "button" ? type : undefined;

    return (
      <Component
        ref={ref}
        type={resolvedType}
        className={clsx(
          buttonDefaultClasses,
          buttonClasses[color][variant],
          buttonSizeClasses[size],
          {
            "cursor-not-allowed opacity-40 shadow-none": disabled || isLoading,
          },
          className
        )}
        aria-disabled={disabled || isLoading || undefined}
        disabled={disabled || isLoading || undefined}
        {...rest}
      >
        {isLoading ? (
          <>
            <span className="opacity-0">{children}</span>
            <div className="flex items-center absolute text-base leading-normal">
              <Spinner color={spinnerColor} size={size} />
            </div>
          </>
        ) : (
          children
        )}
      </Component>
    );
  }
);

Button.displayName = "Button";

export default Button;
