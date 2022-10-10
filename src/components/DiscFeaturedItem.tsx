import React, { useMemo } from "react";

import Image from "next/future/image";
import { FaBoxOpen, FaCoins } from "react-icons/fa";
import Link from "next/link";
import { DiscDetails } from "src/types/trpc";

type Props = {
  disc: DiscDetails;
};

const DiscFeaturedItem: React.FC<Props> = ({ disc }) => {
  const lowestPrice = useMemo(() => {
    const latestPrices =
      disc.products?.map((product) => product.prices.slice(-1)).flat() || [];

    const lowestPrice =
      latestPrices
        ?.map((x) => x.amount)
        .reduce((prev, curr) => (curr > prev ? curr : prev), 0) || 0;

    return lowestPrice;
  }, [disc.products]);

  return (
    <Link href={`/discs/${disc.slug}`} passHref>
      <a className="flex flex-col gap-4 rounded-lg bg-zinc-100 p-4 hover:shadow transition group">
        <Image
          src={disc.imageUrl}
          alt={disc.name}
          width={333}
          height={333}
          className="max-w-full h-auto rounded-md aspect-square group-hover:animate-pulse"
        />

        <div>
          <h2 className="text-2xl font-semibold group-hover:underline">
            {disc.name}
          </h2>
          <h3 className="text-lg">{disc.brand.name}</h3>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span
            title="Speed"
            className="group-hover:animate-pulse select-none p-2 bg-green-200 flex items-center justify-center rounded-md text-sky-900 font-bold text-lg aspect-square w-full"
          >
            {disc.speed.toString()}
          </span>
          <span
            title="Glide"
            className="group-hover:animate-pulse select-none p-2 bg-amber-200 flex items-center justify-center rounded-md text-sky-900 font-bold text-lg aspect-square w-full"
          >
            {disc.glide.toString()}
          </span>
          <span
            title="Turn"
            className="group-hover:animate-pulse select-none p-2 bg-sky-200 flex items-center justify-center rounded-md text-sky-900 font-bold text-lg aspect-square w-full"
          >
            {disc.turn.toString()}
          </span>
          <span
            title="Fade"
            className="group-hover:animate-pulse select-none p-2 bg-yellow-200 flex items-center justify-center rounded-md text-sky-900 font-bold text-lg aspect-square w-full"
          >
            {disc.fade.toString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span
            className="flex items-center gap-1 font-semibold text-lg"
            title="Minste pris (NOK)"
          >
            <FaCoins className="text-amber-600" /> {lowestPrice}
          </span>
          <span
            className="flex items-center gap-1 font-semibold text-lg"
            title="Antall produkter"
          >
            <FaBoxOpen className="text-amber-900" /> {disc.products.length}
          </span>
        </div>
      </a>
    </Link>
  );
};

export default DiscFeaturedItem;
