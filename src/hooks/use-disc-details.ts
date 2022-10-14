import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import config from "src/config";
import { DiscDetails } from "src/types/prisma";

const BASE_URL = `${config.baseUrl}/discs`;

const fetchDisc = async (slug: string) => {
  const response = await axios.get<DiscDetails>(`${BASE_URL}/${slug}`);
  return response.data;
};

export default function useDiscDetails(slug?: string) {
  const { data, ...rest } = useQuery(["disc", slug], () => fetchDisc(slug!), {
    enabled: !!slug,
  });

  return {
    disc: data,

    ...rest,
  };
}
