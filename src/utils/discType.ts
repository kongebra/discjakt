export const discTypeToString = (type: string): string => {
  switch (type.toLowerCase()) {
    case "distance":
      return "Distance Driver";
    case "fairway":
      return "Fairway Driver";
    case "midrage":
      return "Midrage Driver";
    case "putter":
      return "Putt & Approach";
    default:
      return "Mangler type";
  }
};
