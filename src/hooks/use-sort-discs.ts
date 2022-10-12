import { useMemo, useState } from "react";
import { DiscDetails } from "src/types/prisma";

type SortValue =
  | "name"
  | "speed-asc"
  | "speed-desc"
  | "glide-asc"
  | "glide-desc"
  | "turn-asc"
  | "turn-desc"
  | "fade-asc"
  | "fade-desc"
  | string;

export default function useSortDiscs() {
  const [sort, setSort] = useState<SortValue>("name");

  const sortFn = useMemo<(a: DiscDetails, b: DiscDetails) => number>(() => {
    switch (sort) {
      case "speed-asc":
        return (a, b) => a.speed - b.speed;
      case "speed-desc":
        return (a, b) => b.speed - a.speed;

      case "glide-asc":
        return (a, b) => a.glide - b.glide;
      case "glide-desc":
        return (a, b) => b.glide - a.glide;

      case "turn-asc":
        return (a, b) => a.turn - b.turn;
      case "turn-desc":
        return (a, b) => b.turn - a.turn;

      case "fade-asc":
        return (a, b) => a.fade - b.fade;
      case "fade-desc":
        return (a, b) => b.fade - a.fade;

      case "name":
      default:
        return (a, b) => a.name.localeCompare(b.name);
    }
  }, [sort]);

  return { sort, setSort, sortFn };
}
