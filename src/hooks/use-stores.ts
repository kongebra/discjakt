import { Store } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const BASE_URL = `${API_URL}/api/stores`;

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
