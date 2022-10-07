import { DiscType } from "@prisma/client";

export const discTypeToString = (type: DiscType): string => {
  switch (type) {
    case "DISTANCE":
      return "Distance Driver";
    case "FAIRWAY":
      return "Fairway Driver";
    case "MIDRAGE":
      return "Midrage Driver";
    case "PUTTER":
      return "Putt & Approach";
    default:
      return "Mangler type";
  }
};
