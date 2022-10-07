import { Disc } from "@prisma/client";
import React from "react";
import Image from "next/future/image";

type Props = {
  disc: Disc;
  getBrandName: (id: number) => string;
};

const DiscItemOne: React.FC<Props> = ({ disc, getBrandName }) => {
  return (
    <div className="bg-white shadow-md rounded-md p-3 flex flex-col justify-between gap-3">
      <div>
        <Image
          className="w-full h-auto"
          src={disc.imageUrl}
          alt={disc.name}
          width={512}
          height={512}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-xl font-semibold text-center">{disc.name}</h3>
          <h4 className="text-lg font-medium text-center">
            {getBrandName(disc.brandId)}
          </h4>
        </div>

        <div className="flex justify-center items-center">
          <span className="bg-green-200 w-16 h-16 flex items-center justify-center font-semibold text-2xl">
            {disc.speed.toString()}
          </span>
          <span className="bg-amber-300 w-16 h-16 flex items-center justify-center font-semibold text-2xl">
            {disc.glide.toString()}
          </span>
          <span className="bg-sky-200 w-16 h-16 flex items-center justify-center font-semibold text-2xl">
            {disc.turn.toString()}
          </span>
          <span className="bg-yellow-200 w-16 h-16 flex items-center justify-center font-semibold text-2xl">
            {disc.fade.toString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DiscItemOne;
