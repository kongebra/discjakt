import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DiscDetails } from "./use-discs";

const fetchDisc = async (slug: string) => {
  const response = await axios.get<DiscDetails>(`/api/discs/${slug}`);
  return response.data;
};

export function useDiscDetails(slug?: string) {
  const { data, ...rest } = useQuery(["disc", slug], () => fetchDisc(slug!), {
    enabled: !!slug,
  });

  return {
    disc: data,

    ...rest,
  };
}
