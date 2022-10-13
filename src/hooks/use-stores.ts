import { Store } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import config from "src/config";

const BASE_URL = `${config.baseUrl}/api/stores`;

const fetchStores = async () => {
  const resp = await axios.get<Store[]>(`${BASE_URL}`);

  return resp.data;
};

export default function useStores() {
  const { data, ...rest } = useQuery(["stores"], fetchStores);

  return {
    stores: data || [],

    ...rest,
  };
}
