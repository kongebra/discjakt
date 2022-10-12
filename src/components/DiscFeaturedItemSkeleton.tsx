import React from "react";

import Image from "next/future/image";

type Props = {};

const DiscFeaturedItemSkeleton: React.FC<Props> = () => {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-zinc-100 p-4">
      <div className="bg-white rounde-md max-w-full h-auto aspect-square">
        <div className="w-[1024px] h-[1024px]"></div>
      </div>

      <div>
        <div className="bg-zinc-300 w-48 rounded-md h-8 mb-3 animate-pulse"></div>
        <div className="bg-zinc-300 w-32 rounded-md h-6 animate-pulse"></div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="animate-pulse p-2 bg-green-200 flex items-center justify-center rounded-md text-sky-900 font-bold text-lg aspect-square w-full"></span>
        <span className="animate-pulse p-2 bg-amber-200 flex items-center justify-center rounded-md text-sky-900 font-bold text-lg aspect-square w-full"></span>
        <span className="animate-pulse p-2 bg-sky-200 flex items-center justify-center rounded-md text-sky-900 font-bold text-lg aspect-square w-full"></span>
        <span className="animate-pulse p-2 bg-yellow-200 flex items-center justify-center rounded-md text-sky-900 font-bold text-lg aspect-square w-full"></span>
      </div>
    </div>
  );
};

export default DiscFeaturedItemSkeleton;
