import clsx from "clsx";
import React from "react";
import { FaAd } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import { Color } from "src/types/color";

type Props = {
  title: string;
  value: string | number;
  icon?: IconType;
  className?: string;
  color?: Color;
};

type ColorClasses = Record<Color, string>;

const borderColorClasses: ColorClasses = {
  slate: "border-slate-500",
  gray: "border-gray-500",
  zinc: "border-zinc-500",
  neutral: "border-neutral-500",
  stone: "border-stone-500",
  red: "border-red-500",
  orange: "border-orange-500",
  amber: "border-amber-500",
  yellow: "border-yellow-500",
  lime: "border-lime-500",
  green: "border-green-500",
  emerald: "border-emerald-500",
  teal: "border-teal-500",
  cyan: "border-cyan-500",
  sky: "border-sky-500",
  blue: "border-blue-500",
  indigo: "border-indigo-500",
  violet: "border-violet-500",
  purple: "border-purple-500",
  fuchsia: "border-fuchsia-500",
  pink: "border-pink-500",
  rose: "border-rose-500",
};

const textColorClasses: ColorClasses = {
  slate: "text-slate-500",
  gray: "text-gray-500",
  zinc: "text-zinc-500",
  neutral: "text-neutral-500",
  stone: "text-stone-500",
  red: "text-red-500",
  orange: "text-orange-500",
  amber: "text-amber-500",
  yellow: "text-yellow-500",
  lime: "text-lime-500",
  green: "text-green-500",
  emerald: "text-emerald-500",
  teal: "text-teal-500",
  cyan: "text-cyan-500",
  sky: "text-sky-500",
  blue: "text-blue-500",
  indigo: "text-indigo-500",
  violet: "text-violet-500",
  purple: "text-purple-500",
  fuchsia: "text-fuchsia-500",
  pink: "text-pink-500",
  rose: "text-rose-500",
};

const DashboardStat: React.FC<Props> = ({
  title,
  value,
  icon,
  className,
  color = "slate",
}) => {
  const Icon = icon || FaAd;

  return (
    <div
      className={clsx(
        className,
        "bg-white shadow-lg rounded-lg p-8 border-b-8 flex flex-col gap-3",
        borderColorClasses[color]
      )}
    >
      <div className="flex justify-between">
        <h3 className="text-4xl font-bold">{value}</h3>

        <Icon className={clsx("text-4xl", textColorClasses[color])} />
      </div>

      <span className="text-gray-500 font-medium">{title}</span>
    </div>
  );
};

export default DashboardStat;
