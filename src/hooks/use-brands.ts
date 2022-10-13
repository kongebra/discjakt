import { Brand } from "@prisma/client";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import config from "src/config";

const BASE_URL = `${config.baseUrl}/api/brands`;

const fetchBrands = async () => {
  const resp = await axios.get<Brand[]>(`${BASE_URL}`);

  return await resp.data;
};

const createBrand = async (record: Brand) => {
  const resp = await axios.post<Brand>(`${BASE_URL}`, record);

  return await resp.data;
};

export default function useBrands() {
  const queryClient = useQueryClient();

  const { data, ...rest } = useQuery<Brand[]>(["brands"], fetchBrands);

  const createMutation = useMutation(createBrand, {
    onSuccess() {
      queryClient.invalidateQueries(["brands"]);
    },
  });

  return {
    brands: data || [],

    ...rest,

    mutations: {
      create: createMutation,
    },
  };
}
