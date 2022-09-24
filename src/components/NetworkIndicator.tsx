import React from "react";
import clsx from "clsx";

type StatusType = "online" | "offline" | "idle";

type Props = {
  status: StatusType;
};

const NetworkIndicator: React.FC<Props> = ({ status }) => {
  return (
    <div
      className={clsx(
        "absolute top-0 right-0 h-3 w-3 my-1 border-2 border-white rounded-full z-2",
        {
          "bg-green-400": status === "online",
          "bg-red-400": status === "offline",
          "bg-gray-400": status === "idle",
        }
      )}
    ></div>
  );
};

export default NetworkIndicator;
