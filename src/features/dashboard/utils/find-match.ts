import { Product } from "@prisma/client";
import { DiscDetails } from "src/types/prisma";

export const findMatch = (product: Product, discs: DiscDetails[]) => {
  const titleWords = product.title.toLowerCase().split(" ");

  const extraCheck = (value: string) => {
    if (
      product.title.toLowerCase().includes(value.toLowerCase()) &&
      !titleWords.includes(value)
    ) {
      titleWords.push(value);
    }
  };

  extraCheck("v2");
  extraCheck("swan");
  extraCheck("banger");
  extraCheck("ringer");

  return discs
    .filter((disc) => {
      const discNameWords = disc.name.toLowerCase().split(" ");

      return titleWords.some((word) => discNameWords.includes(word));
    })
    .sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }

      if (a.name < b.name) {
        return -1;
      }

      return 0;
    });
};
