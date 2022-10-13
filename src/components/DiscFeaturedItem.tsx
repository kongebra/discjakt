import React, { useMemo } from "react";

import Image from "next/future/image";
import { FaBoxOpen, FaCoins } from "react-icons/fa";
import Link from "next/link";
import { DiscDetails } from "src/types/prisma";

type Props = {
  disc: DiscDetails;
};

const css = { width: "100%", height: "auto" };

const DiscFeaturedItem: React.FC<Props> = ({ disc }: Props) => {
  const lowestPrice = useMemo(() => {
    const prices = disc.products
      ?.filter((product) => product.prices.length)
      .map((product) => product.prices[product.prices.length - 1]?.amount!)
      .filter((price) => price > 0);

    const lowest = Math.min(...prices);

    if (lowest === Infinity) {
      return 0;
    }

    return lowest;
  }, [disc.products]);

  return (
    <Link href={`/discs/${disc.slug}`} passHref>
      <a className="flex flex-col gap-4 rounded-lg bg-zinc-100 p-4 hover:shadow transition group">
        <Image
          src={disc.imageUrl}
          blurDataURL={"/placeholder.png"}
          placeholder={"blur"}
          alt={disc.name}
          sizes="100vw"
          style={css}
          width={1024}
          height={1024}
          className="max-w-full h-auto rounded-md aspect-square group-hover:animate-pulse"
          quality={50}
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
            className="group-hover:animate-pulse select-none p-2 bg-lime-300 flex items-center justify-center rounded-md text-sky-900 font-bold text-lg aspect-square w-full"
          >
            {disc.speed.toString()}
          </span>
          <span
            title="Glide"
            className="group-hover:animate-pulse select-none p-2 bg-orange-300 flex items-center justify-center rounded-md text-sky-900 font-bold text-lg aspect-square w-full"
          >
            {disc.glide.toString()}
          </span>
          <span
            title="Turn"
            className="group-hover:animate-pulse select-none p-2 bg-sky-300 flex items-center justify-center rounded-md text-sky-900 font-bold text-lg aspect-square w-full"
          >
            {disc.turn.toString()}
          </span>
          <span
            title="Fade"
            className="group-hover:animate-pulse select-none p-2 bg-yellow-300 flex items-center justify-center rounded-md text-sky-900 font-bold text-lg aspect-square w-full"
          >
            {disc.fade.toString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span
            className="flex items-center gap-1 font-semibold text-lg"
            title="Minste pris (NOK)"
          >
            <FaCoins className="text-amber-600" />{" "}
            {lowestPrice === 0 ? "Ikke på lager" : lowestPrice}
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
