import { Disc } from "@prisma/client";
import React from "react";
import Image from "next/future/image";
import Button from "./Button";

type Props = {
  disc: Disc;
  getBrandName: (id: number) => string;
};

const DiscItemOne: React.FC<Props> = ({ disc, getBrandName }) => {
  return (
    <div className="bg-white shadow-md rounded-md p-3 flex gap-3">
      <div className="w-24">
        <Image
          className="w-full h-auto"
          src={disc.imageUrl}
          alt={disc.name}
          width={512}
          height={512}
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <h2 className="text-xl font-bold">{disc.name}</h2>
            <h3 className="text-lg font-medium">
              {getBrandName(disc.brandId)}
            </h3>
          </div>

          <div>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4">
          <span className="bg-green-200 flex items-center justify-center font-semibold text-lg">
            {disc.speed.toString()}
          </span>
          <span className="bg-amber-300 flex items-center justify-center font-semibold text-lg">
            {disc.glide.toString()}
          </span>
          <span className="bg-sky-200 flex items-center justify-center font-semibold text-lg">
            {disc.turn.toString()}
          </span>
          <span className="bg-yellow-200 flex items-center justify-center font-semibold text-lg">
            {disc.fade.toString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DiscItemOne;
