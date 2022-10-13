import React, { useState } from "react";
import Select from "./Select";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const SelectDiscSort: React.FC<Props> = ({ value = "name", onChange }) => {
  return (
    <Select
      placeholder="Sorter"
      aria-label="Sorter disker"
      value={value}
      options={[
        {
          value: "name",
          label: "Navn",
        },
        {
          value: "speed-asc",
          label: "Speed lav-høy",
        },
        {
          value: "speed-desc",
          label: "Speed høy-lav",
        },
        {
          value: "glide-asc",
          label: "Glide lav-høy",
        },
        {
          value: "glide-desc",
          label: "Glide høy-lav",
        },
        {
          value: "turn-asc",
          label: "Turn lav-høy",
        },
        {
          value: "turn-desc",
          label: "Turn høy-lav",
        },
        {
          value: "fade-asc",
          label: "Fade lav-høy",
        },
        {
          value: "fade-desc",
          label: "Fade høy-lav",
        },
      ]}
      onChange={(event) => {
        const { value } = event.currentTarget;
        onChange(value);
      }}
    />
  );
};

export default SelectDiscSort;
